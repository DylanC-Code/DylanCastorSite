import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { desktop, openSite, siteUrl } from "./servedSite.ts";

const checkPath = "/shopify-cro/checking-a-test-before-launch";
const checkUrl = `${siteUrl}${checkPath}`;
const description =
    "Six ways a test can be wrong before it goes live, and how I check each one. Open the six marks to see them.";

/**
 * "Checking a test before launch", published on floor I (decided by Dylan, 26
 * Nov 2026): built at its address, open to search, its room lit on the floor,
 * its ways out as on the flicker page.
 */
describe("the check test page", () => {
    it("is built at its address, open to search", async () => {
        expect(existsSync(`dist${checkPath}.html`)).toBe(true);
        const site = await openSite(desktop);
        await site.page.goto(checkUrl, { waitUntil: "load" });
        expect(await site.page.title()).toBe(
            "Checking a test before launch · Dylan Castor",
        );
        expect(
            await site.page.getAttribute('meta[name="description"]', "content"),
        ).toBe(description);
        expect(await site.page.locator('meta[name="robots"]').count()).toBe(0);
        await site.browser.close();
    });

    it("leads back to floor I", async () => {
        const site = await openSite(desktop);
        await site.page.goto(checkUrl, { waitUntil: "load" });
        await site.page.click(".topic-back");
        await site.page.waitForURL(`${siteUrl}/shopify-cro`);
        expect(await site.page.title()).toBe("Shopify & CRO · Dylan Castor");
        await site.browser.close();
    });

    it.each([
        ["", "/cro#slot-title"],
        ["?via=agencies", "/agencies#have-a-test"],
        ["?via=brands", "/cro#slot-title"],
    ])("asks the way the visitor came (%s)", async (via, href) => {
        const site = await openSite(desktop);
        await site.page.goto(`${checkUrl}${via}`, { waitUntil: "load" });
        expect(await site.page.getAttribute("[data-ask-link]", "href")).toBe(
            href,
        );
        await site.browser.close();
    });
});

describe("its room on floor I", () => {
    it("is open and leads to the page; rooms 3 and 4 stay later", async () => {
        const site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
        const room = site.page.locator('[data-room-link][data-index="1"]');
        expect(await room.getAttribute("href")).toBe(checkPath);
        expect(
            await site.page
                .locator(
                    '[data-room-later]:is([data-index="2"], [data-index="3"])',
                )
                .allInnerTexts(),
        ).toHaveLength(2);
        await room.click();
        await site.page.waitForURL(checkUrl, { timeout: 2000 });
        await site.browser.close();
    });
});
