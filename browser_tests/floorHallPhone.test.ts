import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, sideOverflow } from "./pageChecks.ts";
import { type OpenedSite, openSite, phone, siteUrl } from "./servedSite.ts";

/**
 * Floor I on a phone: the rooms stacked, the published one shown open at load;
 * without script every published room is open and is a plain link.
 */
describe("the floor I hall on a phone", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...phone, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("shows the first published room open, its card gone", async () => {
        expect(await site.page.getAttribute("[data-lit]", "data-curtain")).toBe(
            "shown",
        );
        expect(await site.page.isVisible(".room-showing")).toBe(true);
        expect(
            await site.page.evaluate<string>(
                `getComputedStyle(document.querySelector(".room-showing")).opacity`,
            ),
        ).toBe("0");
    });

    it("has no problem for assistive tech", async () => {
        expect(await accessibilityProblems(site.page, "main")).toEqual([]);
    });
});

describe("the floor I hall on a phone without JavaScript", () => {
    it("shows the published room open, as a plain link", async () => {
        const site = await openSite({ ...phone, javaScriptEnabled: false });
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
        expect(await site.page.isVisible(".room-curtain")).toBe(false);
        expect(await site.page.getAttribute("[data-room-link]", "href")).toBe(
            "/shopify-cro/flicker-free-ab-tests",
        );
        await site.browser.close();
    });
});

describe("the floor I hall on narrow screens", () => {
    it.each([320, 390, 820])(
        "never scrolls sideways at %ipx",
        async (width) => {
            const site = await openSite({
                ...phone,
                viewport: { width, height: 800 },
            });
            await site.page.goto(`${siteUrl}/shopify-cro`, {
                waitUntil: "load",
            });
            expect(await sideOverflow(site.page)).toBe(0);
            await site.browser.close();
        },
    );
});
