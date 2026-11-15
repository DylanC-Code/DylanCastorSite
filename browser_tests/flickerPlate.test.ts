import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

const flickerUrl = `${siteUrl}/shopify-cro/flicker-free-ab-tests`;

function caption(page: Page): Promise<string> {
    return page.innerText("[data-caption]");
}

/** Makes two moves, one after the other. */
async function play(
    page: Page,
    parts: readonly [string, string?],
): Promise<void> {
    const [first, second] = parts;
    await page.click(`[data-part="${first}"]`, { force: true });
    await page.waitForTimeout(80);
    if (second !== undefined) {
        await page.click(`[data-part="${second}"]`, { force: true });
        await page.waitForTimeout(80);
    }
}

/**
 * The lantern plate, worked as a visitor would (moves are instant with reduced
 * motion): the usual way shows the flicker, the other way does not, and both
 * done raise the hand under the plate.
 */
describe("the lantern plate", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(flickerUrl, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("shows the flicker the usual way", async () => {
        await site.page.click('[data-way="usual"]');
        await play(site.page, ["open", "slide"]);
        expect(await caption(site.page)).toContain("That is the flicker.");
        expect(
            await site.page.getAttribute('[data-way="usual"]', "data-state"),
        ).toBe("done");
    });

    it("shows no flicker the other way, then the hand", async () => {
        await site.page.click('[data-way="clean"]');
        await play(site.page, ["slide", "open"]);
        expect(await caption(site.page)).toContain("No flicker");
        await site.page.waitForTimeout(100);
        expect(await site.page.isVisible("[data-cue]")).toBe(true);
    });

    it("opens the price note, and closes it on Escape", async () => {
        await site.page.click("[data-price-link]");
        expect(await site.page.isVisible("[data-price-note]")).toBe(true);
        await site.page.keyboard.press("Escape");
        expect(await site.page.isVisible("[data-price-note]")).toBe(false);
    });

    it("says when the visitor leaves a way", async () => {
        await site.page.click('[data-way="clean"]');
        await play(site.page, ["open"]);
        expect(await caption(site.page)).toContain("You left this way.");
    });

    it("has no problem for assistive tech", async () => {
        expect(await accessibilityProblems(site.page, "main")).toEqual([]);
    });
});
