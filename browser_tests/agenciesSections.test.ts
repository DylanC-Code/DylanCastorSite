import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, sideOverflow } from "./pageChecks.ts";
import {
    desktop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

const sections = [
    "under-your-name",
    "after-the-first-test",
    "the-method",
    "have-a-test",
];

/**
 * The agencies home's last four sections: each waits below the fold, plays once
 * in view, and reads well for assistive tech.
 */
describe("the agencies sections on desktop", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("waits below the fold, then plays once in view", async () => {
        const section = site.page.locator("section:has(#under-your-name)");
        expect(await section.getAttribute("data-reveal")).toBe("pending");
        await section.scrollIntoViewIfNeeded();
        await site.page.waitForTimeout(2400);
        expect(await section.getAttribute("data-reveal")).toBe("seen");
        expect(
            await site.page.evaluate<string>(
                `getComputedStyle(document.querySelector(".label.is-over")).opacity`,
            ),
        ).toBe("1");
    });

    it.each(sections)("has no problem in %s", async (id) => {
        await site.page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await site.page.waitForTimeout(2400);
        expect(
            await accessibilityProblems(site.page, `section:has(#${id})`),
        ).toEqual([]);
    });

    it("leads the method to the All floor", async () => {
        expect(
            await site.page.getAttribute("section:has(#the-method) a", "href"),
        ).toBe("/how-i-build-software");
    });
});

describe("the agencies page on a phone", () => {
    it.each([320, 390])("never scrolls sideways at %ipx", async (width) => {
        const site = await openSite({
            ...phone,
            viewport: { width, height: 700 },
        });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        await site.page.waitForTimeout(300);
        expect(await sideOverflow(site.page)).toBe(0);
        await site.browser.close();
    });
});
