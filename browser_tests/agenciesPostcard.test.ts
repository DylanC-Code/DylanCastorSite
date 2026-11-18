import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, focused } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

function cardState(page: Page): Promise<string | null> {
    return page.getAttribute("[data-postcard]", "data-state");
}

/**
 * The postcard: its front turns to the writing side, "Reply to" is checked, and
 * while sending is not wired every send says it failed, never "posted".
 */
describe("the postcard", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        await site.page.locator("[data-postcard]").scrollIntoViewIfNeeded();
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("shows its front, then turns to the message", async () => {
        expect(await cardState(site.page)).toBe("front");
        await site.page.click("[data-postcard-front]");
        expect(await cardState(site.page)).toBe("writing");
        expect(await focused(site.page)).toBe("postcard-message");
        expect(
            await accessibilityProblems(site.page, "[data-postcard]"),
        ).toEqual([]);
    });

    it("marks an empty Reply to and keeps the writing side", async () => {
        await site.page.click(".paper-post");
        expect(
            await site.page.getAttribute("#postcard-reply", "aria-invalid"),
        ).toBe("true");
        expect(await site.page.isVisible("#postcard-reply-error")).toBe(true);
        expect(await cardState(site.page)).toBe("writing");
    });

    it("says a failed send failed, keeps the words, never posts", async () => {
        await site.page.fill("#postcard-message", "A test to build.");
        await site.page.fill("#postcard-reply", "studio@agency.com");
        await site.page.click(".paper-post");
        await site.page.waitForTimeout(200);
        expect(await cardState(site.page)).toBe("failed");
        expect(await site.page.innerText("[data-postcard-failed]")).toBe(
            "The message did not go through. Nothing is lost: try again, or email me directly.",
        );
        expect(await site.page.inputValue("#postcard-message")).toBe(
            "A test to build.",
        );
        expect(await site.page.isVisible(".postcard-envelope")).toBe(false);
    });
});
