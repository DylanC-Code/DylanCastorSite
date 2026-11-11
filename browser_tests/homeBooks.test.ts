import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { onContents } from "./pageChecks.ts";
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

/** The books on a wide screen: open on the contents, turn, bookmark, close. */
describe("the books on desktop", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/#paths`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("opens on the contents, focus there, the others inert", async () => {
        await site.page.click(cover("engineers"));
        expect(
            await site.page.getAttribute(cover("engineers"), "aria-expanded"),
        ).toBe("true");
        expect(await onContents(site.page)).toBe(true);
        expect(
            await site.page.getAttribute('[data-book="agencies"]', "inert"),
        ).toBe("");
        await site.page.locator("section:has(#paths)").screenshot({
            path: "browser_tests/screenshots/books_contents_desktop.png",
        });
    });

    it("leads on through its bookmark, a link to the path", async () => {
        const bookmark = site.page.locator('[data-bookmark="engineers"]');
        expect(await bookmark.isVisible()).toBe(true);
        expect(await bookmark.getAttribute("href")).toBe("/engineering");
    });
});

/** On a phone: one page at a time, step I included. */
describe("the books on a phone", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...phone, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/#paths`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("opens the book tapped on its contents", async () => {
        await site.page.tap(cover("agencies"));
        expect(await onContents(site.page)).toBe(true);
        await site.page.locator("section:has(#paths)").screenshot({
            path: "browser_tests/screenshots/books_contents_phone.png",
        });
    });

    it("turns to step I, then to step All", async () => {
        await site.page.tap("[data-page-next]");
        expect(
            await site.page
                .locator(
                    '[data-book="agencies"] .is-single .book-leaf.is-turned',
                )
                .count(),
        ).toBe(1);
        await site.page.locator("section:has(#paths)").screenshot({
            path: "browser_tests/screenshots/books_step_phone.png",
        });
        await site.page.tap("[data-page-next]");
        expect(
            await site.page
                .locator(
                    '[data-book="agencies"] .is-single .book-leaf.is-turned',
                )
                .count(),
        ).toBe(2);
    });
});
