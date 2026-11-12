import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, focused } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

function chosenTab(page: Page): Promise<string | null> {
    return page.getAttribute('[role="tab"][aria-selected="true"]', "id");
}

function houseValue(page: Page, name: string): Promise<string> {
    return page.evaluate<string>(
        `document.querySelector("[data-house]").style.getPropertyValue("${name}")`,
    );
}

/**
 * The house: closed at first, opened by its button; its levels are tabs that
 * move the street, the lift and the dial.
 */
describe("the house on the brands home", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        await site.page.locator("[data-house]").scrollIntoViewIfNeeded();
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("is closed, its levels out of reach, until opened", async () => {
        expect(await site.page.isVisible("[data-house-open]")).toBe(true);
        expect(
            await site.page.getAttribute("[data-house-levels]", "inert"),
        ).toBe("");
        await site.page.click("[data-house-open]");
        expect(
            await site.page.getAttribute("[data-house-levels]", "inert"),
        ).toBeNull();
        expect(await focused(site.page)).toBe("house-tab-0");
    });

    it("chooses a level: its panel, the street and the lift follow", async () => {
        await site.page.click("#house-tab-2");
        expect(await chosenTab(site.page)).toBe("house-tab-2");
        expect(await site.page.isVisible("#house-panel-2")).toBe(true);
        expect(await site.page.isVisible("#house-panel-0")).toBe(false);
        expect(await houseValue(site.page, "--street")).toBe("172px");
        expect(await houseValue(site.page, "--cabin")).toBe("242px");
    });

    it("moves along the levels with the arrow keys", async () => {
        await site.page.focus("#house-tab-2");
        await site.page.keyboard.press("ArrowDown");
        expect(await chosenTab(site.page)).toBe("house-tab-3");
        await site.page.keyboard.press("Home");
        expect(await chosenTab(site.page)).toBe("house-tab-0");
        expect(await focused(site.page)).toBe("house-tab-0");
    });

    it("has no problem for assistive tech", async () => {
        await site.page.waitForTimeout(1400);
        expect(
            await accessibilityProblems(site.page, "section:has([data-house])"),
        ).toEqual([]);
    });
});

describe("the house without JavaScript", () => {
    it("is shown open, with every level's panel to read", async () => {
        const site = await openSite({ ...desktop, javaScriptEnabled: false });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        expect(await site.page.isVisible("[data-house-open]")).toBe(false);
        expect(await site.page.locator(".level-panel:visible").count()).toBe(4);
        await site.browser.close();
    });
});
