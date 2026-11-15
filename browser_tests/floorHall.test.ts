import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

const topic = `${siteUrl}/shopify-cro/flicker-free-ab-tests`;

/** Where the visitor stands, in px along the building. */
function standing(page: Page): Promise<number> {
    return page.evaluate<number>(
        `new DOMMatrixReadOnly(getComputedStyle(document.querySelector("[data-visitor]")).transform).m41`,
    );
}

/**
 * Floor I on desktop: a click on a room walks the visitor there, the lift
 * brings him back, and the lit room's link is followed when he arrives.
 */
describe("the floor I hall on desktop", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("has no problem for assistive tech", async () => {
        expect(await accessibilityProblems(site.page, "main")).toEqual([]);
    });

    it("walks the visitor to a curtain, then back to the lift", async () => {
        expect(await standing(site.page)).toBe(70);
        await site.page.click('[data-room-later][data-index="3"]');
        await site.page.waitForTimeout(3000);
        expect(await standing(site.page)).toBe(862);
        await site.page.click("[data-lift]");
        await site.page.waitForTimeout(3000);
        expect(await standing(site.page)).toBe(70);
    });

    it("follows the lit room's link once he has walked there", async () => {
        await site.page.click("[data-room-link]");
        await site.page.waitForURL(topic, { timeout: 3000 });
        expect(site.page.url()).toBe(topic);
    });
});

describe("the floor I hall with reduced motion", () => {
    it("follows the lit room's link at once", async () => {
        const site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
        await site.page.click("[data-room-link]");
        await site.page.waitForURL(topic, { timeout: 1000 });
        expect(site.page.url()).toBe(topic);
        await site.browser.close();
    });
});

describe("the floor's Write to me", () => {
    it("leads to the brands slot, or to the home the visitor came through", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
        expect(await site.page.getAttribute(".ask-link", "href")).toBe(
            "/cro#slot-title",
        );
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        const carried = await site.page.getAttribute(
            "a[href^='/shopify-cro']",
            "href",
        );
        expect(carried).toBe("/shopify-cro?via=agencies");
        await site.page.click("a[href='/shopify-cro?via=agencies']");
        await site.page.waitForURL("**/shopify-cro?via=agencies");
        expect(await site.page.getAttribute(".ask-link", "href")).toBe(
            "/agencies#have-a-test",
        );
        await site.browser.close();
    });
});
