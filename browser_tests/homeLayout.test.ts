import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
    accessibilityProblems,
    layoutShift,
    scrollThrough,
    sideOverflow,
} from "./pageChecks.ts";
import {
    desktop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

/**
 * The home at the handoff's two sizes. Motion is reduced so every element is in
 * its final place; the full-page screenshots land in browser_tests/screenshots/
 * for review beside the handoff's.
 */
describe.each([desktop, phone])("the home on $name", (device) => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...device, reducedMotion: "reduce" });
        await site.page.goto(siteUrl, { waitUntil: "load" });
        await scrollThrough(site.page);
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("asks nothing of another host", () => {
        expect(site.foreign).toEqual([]);
    });

    it("has no accessibility problem", async () => {
        expect(await accessibilityProblems(site.page)).toEqual([]);
    });

    it("never scrolls sideways", async () => {
        expect(await sideOverflow(site.page)).toBe(0);
    });

    it("does not shift while it loads", async () => {
        expect(await layoutShift(site.page)).toBeLessThan(0.001);
    });

    it("is captured for review", async () => {
        const shot = await site.page.screenshot({
            path: `browser_tests/screenshots/home_${device.name}.png`,
            fullPage: true,
        });
        expect(shot.byteLength).toBeGreaterThan(0);
    });
});
