import type { Page } from "playwright";
import { describe, expect, it } from "vitest";

import { desktop, openSite, phone, siteUrl } from "./servedSite.ts";

/** How far the stuck ticket's band sits from the header's bottom edge. */
function gapUnderHeader(page: Page): Promise<number> {
    return page.evaluate<number>(
        `(() => { const header = document.querySelector("body > header").getBoundingClientRect();
        return Math.round(document.querySelector("[data-ticket]").getBoundingClientRect().top - header.bottom); })()`,
    );
}

/**
 * The part 2 correction: the ticket pins under the sticky header (84px, 60px on
 * a phone), never behind it.
 */
describe("the steps' ticket under the header", () => {
    it.each([
        ["desktop", desktop],
        ["phone", phone],
    ])("pins flush under the header on %s", async (_name, options) => {
        const site = await openSite({ ...options, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        await site.page.locator("[data-step='1']").scrollIntoViewIfNeeded();
        await site.page.waitForTimeout(250);
        expect(await gapUnderHeader(site.page)).toBe(0);
        await site.browser.close();
    });
});
