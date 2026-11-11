import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
    desktop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

/** Picking a floor, with motion: the page leaves and the new floor arrives. */
describe.each(["card", "shelf"] as const)(
    "picking a floor on the %s",
    (design) => {
        let site: OpenedSite;
        const root = `[data-design="${design}"]`;

        beforeAll(async () => {
            site = await openSite({ ...desktop, switcher: design });
            await site.page.goto(`${siteUrl}/development`, {
                waitUntil: "load",
            });
        });

        afterAll(async () => {
            await site.browser.close();
        });

        it("takes the visitor to the floor picked", async () => {
            await site.page.click(`${root} [aria-controls]`);
            await site.page.waitForTimeout(800);
            await site.page.click(`${root} a[href="/infrastructure"]`);
            await site.page.waitForURL(`${siteUrl}/infrastructure`);
            await site.page.waitForTimeout(900);
            expect(
                await site.page.getAttribute(
                    `${root} nav [aria-current="page"]`,
                    "href",
                ),
            ).toBe("/infrastructure");
            await site.page.screenshot({
                path: `browser_tests/screenshots/switcher_${design}_arrived.png`,
            });
        });
    },
);

/** On a phone, both designs open in the corner, 16px from the edges. */
describe.each(["card", "shelf"] as const)(
    "the %s switcher on a phone",
    (design) => {
        let site: OpenedSite;

        beforeAll(async () => {
            site = await openSite({
                ...phone,
                switcher: design,
                reducedMotion: "reduce",
            });
            await site.page.goto(`${siteUrl}/development`, {
                waitUntil: "load",
            });
        });

        afterAll(async () => {
            await site.browser.close();
        });

        it("opens with a tap", async () => {
            await site.page.tap(`[data-design="${design}"] [aria-controls]`);
            expect(
                await site.page.isVisible(`[data-design="${design}"] nav`),
            ).toBe(true);
            await site.page.screenshot({
                path: `browser_tests/screenshots/switcher_${design}_phone_open.png`,
            });
        });
    },
);

/** Without JavaScript: the opener leads to the home's floors, no panel. */
describe("the switcher without JavaScript", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, javaScriptEnabled: false });
        await site.page.goto(`${siteUrl}/development`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("is a link to the floors on the home", async () => {
        expect(
            await site.page.getAttribute(
                '[data-design="card"] a[data-switcher-opener]',
                "href",
            ),
        ).toBe("/#floors");
        expect(
            await site.page.locator("nav[data-switcher-panel]").count(),
        ).toBe(0);
    });
});
