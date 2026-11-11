import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { hrefs } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

/** Text first: with JavaScript off, the home still reads and still leads on. */
describe("the home without JavaScript", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, javaScriptEnabled: false });
        await site.page.goto(siteUrl, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("shows the title", async () => {
        const title = site.page.getByRole("heading", { level: 1 });
        expect(await title.isVisible()).toBe(true);
        expect(await title.textContent()).toContain("floor by floor.");
    });

    it("keeps the three books as links to their paths", async () => {
        expect(await hrefs(site.page, "a.book-cover")).toEqual([
            "/agencies",
            "/cro",
            "/engineering",
        ]);
    });
});
