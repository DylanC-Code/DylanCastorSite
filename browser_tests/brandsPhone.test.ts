import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems } from "./pageChecks.ts";
import { type OpenedSite, openSite, phone, siteUrl } from "./servedSite.ts";

/** Scrolls so the top of level `index` sits `y` px down the screen. */
async function levelAt(page: Page, index: number, y: number): Promise<void> {
    await page.evaluate<number>(
        `(() => { const level = document.querySelectorAll("[data-scroll-level]")[${index}];
        window.scrollBy({ top: level.getBoundingClientRect().top - ${y}, behavior: "instant" }); return 0; })()`,
    );
    await page.waitForTimeout(200);
}

function currentLevel(page: Page): Promise<string | null> {
    return page.getAttribute(
        "[data-scroll-level][data-current]",
        "data-scroll-level",
    );
}

/**
 * The house on a phone: you scroll through it; the level crossing the line
 * 380px down is drawn on paper. No lift on a phone.
 */
describe("the brands house on a phone", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...phone, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("makes current the level crossing the reading line", async () => {
        await levelAt(site.page, 1, 300);
        expect(await currentLevel(site.page)).toBe("1");
        await levelAt(site.page, 3, 100);
        expect(await currentLevel(site.page)).toBe("3");
    });

    it("has no problem for assistive tech", async () => {
        expect(
            await accessibilityProblems(site.page, "section:has(#house-title)"),
        ).toEqual([]);
    });
});

describe("the brands house on a phone without JavaScript", () => {
    it("draws every level dark, none current", async () => {
        const site = await openSite({ ...phone, javaScriptEnabled: false });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        expect(
            await site.page
                .locator("[data-scroll-level][data-current]")
                .count(),
        ).toBe(0);
        expect(await site.page.locator(".scroll-title:visible").count()).toBe(
            4,
        );
        await site.browser.close();
    });
});
