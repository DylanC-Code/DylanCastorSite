import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, sideOverflow } from "./pageChecks.ts";
import {
    desktop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

function slotState(page: Page): Promise<string | null> {
    return page.getAttribute("[data-letter-slot]", "data-state");
}

/**
 * The brands home's guarantee, door and letter slot: each reads well, and while
 * sending is not wired, the slot says it failed, never "sent".
 */
describe("the brands home's last parts", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it.each(["guarantee-title", "start-title", "slot-title"])(
        "has no problem in %s",
        async (id) => {
            await site.page.locator(`#${id}`).scrollIntoViewIfNeeded();
            expect(
                await accessibilityProblems(site.page, `section:has(#${id})`),
            ).toEqual([]);
        },
    );

    it("marks an empty Reply to and keeps the note", async () => {
        await site.page.click(".slot-send");
        expect(
            await site.page.getAttribute("#slot-reply", "aria-invalid"),
        ).toBe("true");
        expect(await slotState(site.page)).toBe("writing");
    });

    it("says a failed send failed, keeps the words, never sends", async () => {
        await site.page.fill("#slot-message", "Our store needs a fix.");
        await site.page.fill("#slot-reply", "shop@brand.com");
        await site.page.click(".slot-send");
        await site.page.waitForTimeout(200);
        expect(await slotState(site.page)).toBe("failed");
        expect(await site.page.isVisible("[data-letter-failed]")).toBe(true);
        expect(await site.page.inputValue("#slot-message")).toBe(
            "Our store needs a fix.",
        );
        expect(await site.page.isVisible(".slot-card")).toBe(false);
    });
});

describe("the brands home on a phone", () => {
    it.each([320, 390])("never scrolls sideways at %ipx", async (width) => {
        const site = await openSite({
            ...phone,
            viewport: { width, height: 700 },
        });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        expect(await sideOverflow(site.page)).toBe(0);
        await site.browser.close();
    });
});
