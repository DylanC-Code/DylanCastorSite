import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { desktop, openSite, siteUrl } from "./servedSite.ts";

/**
 * "Checking a test before launch" is a draft: built by `bun run dev` only
 * (decided by Dylan, 23 Nov 2026). The site's build never holds it, and its
 * room on floor I stays "Coming later", with no link to it.
 */
describe("the check test draft", () => {
    it("is not in the built site", () => {
        expect(
            existsSync("dist/shopify-cro/checking-a-test-before-launch.html"),
        ).toBe(false);
    });

    it("keeps its room on floor I closed", async () => {
        const site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/shopify-cro`, { waitUntil: "load" });
        expect(
            await site.page
                .locator('a[href*="checking-a-test-before-launch"]')
                .count(),
        ).toBe(0);
        await site.browser.close();
    });
});
