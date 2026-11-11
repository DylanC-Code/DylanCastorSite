import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { focused } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

const engineers = '[data-book="engineers"] [data-cover]';
const turned = ".is-spread .book-leaf.is-turned";

/** An open book on a wide screen: its leaves turn, then it closes. */
describe("turning the engineers' book on desktop", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/#paths`, { waitUntil: "load" });
        await site.page.click(engineers);
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("turns its leaves to the last spread, never past it", async () => {
        await site.page.click("[data-page-next]");
        await site.page.click("[data-page-next]");
        expect(await site.page.locator(turned).count()).toBe(2);
        expect(await site.page.getAttribute("[data-page-next]", "inert")).toBe(
            "",
        );
        await site.page.locator("section:has(#paths)").screenshot({
            path: "browser_tests/screenshots/books_last_spread_desktop.png",
        });
    });

    it("turns back with the left arrow key, then closes on Escape", async () => {
        await site.page.keyboard.press("ArrowLeft");
        expect(await site.page.locator(turned).count()).toBe(1);
        await site.page.keyboard.press("Escape");
        await site.page.waitForTimeout(100);
        expect(await site.page.getAttribute(engineers, "aria-expanded")).toBe(
            "false",
        );
        expect(await focused(site.page)).toBe("engineers");
    });
});
