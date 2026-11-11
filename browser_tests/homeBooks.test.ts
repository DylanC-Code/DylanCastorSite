import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { focused } from "./pageChecks.ts";
import {
    desktop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

function cover(id: string): string {
    return `[data-book="${id}"] [data-cover]`;
}

/** The three books, on a wide screen: open, focus in, close, focus back. */
describe("the books on desktop", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/#paths`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("opens a book and moves focus to its first page", async () => {
        await site.page.click(cover("agencies"));
        expect(
            await site.page.getAttribute(cover("agencies"), "aria-expanded"),
        ).toBe("true");
        expect(await focused(site.page)).toBe("path-agencies");
    });

    it("sets the other books aside, inert", async () => {
        expect(
            await site.page.getAttribute('[data-book="brands"]', "inert"),
        ).toBe("");
        await site.page.locator("section:has(#paths)").screenshot({
            path: "browser_tests/screenshots/books_open_desktop.png",
        });
    });

    it("closes on Escape and gives focus back to the cover", async () => {
        await site.page.keyboard.press("Escape");
        expect(
            await site.page.getAttribute(cover("agencies"), "aria-expanded"),
        ).toBe("false");
        expect(await focused(site.page)).toBe("agencies");
    });
});

/** On a phone: tap a book, its page opens below; tap another to switch. */
describe("the books on a phone", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...phone, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/#paths`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("opens the page of the book tapped", async () => {
        await site.page.tap(cover("brands"));
        expect(await site.page.isVisible("#path-brands")).toBe(true);
    });

    it("switches to another book in one tap", async () => {
        await site.page.tap(cover("engineers"));
        expect(await site.page.isVisible("#path-engineers")).toBe(true);
        expect(await site.page.isVisible("#path-brands")).toBe(false);
        await site.page.locator("section:has(#paths)").screenshot({
            path: "browser_tests/screenshots/books_open_phone.png",
        });
    });
});
