import { describe, expect, it } from "vitest";

import { accessibilityProblems } from "./pageChecks.ts";
import { desktop, openSite, siteUrl } from "./servedSite.ts";

/**
 * The pages not written yet (closed floor handoff): floors II, III, IV and All
 * behind one closed curtain.
 */
describe("a closed floor on desktop", () => {
    it("shows the floor's name, its line, the sign and one closed curtain", async () => {
        const site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/development`, { waitUntil: "load" });
        expect([
            await site.page.innerText("h1"),
            await site.page.innerText(".floor-intro"),
            await site.page.innerText(".floor-sign"),
            await site.page.innerText(".closed-card"),
            await site.page.innerText(".building-hint"),
            await site.page.locator(".closed").count(),
        ]).toStrictEqual([
            "Development.",
            "Typed, tested code that stays easy to change, in small files with one job each.",
            "FLOOR II\nThe application\nOPENING LATER",
            "Development\nComing later",
            "THIS FLOOR OPENS LATER · TAKE THE LIFT TO ANOTHER FLOOR",
            1,
        ]);
        expect(await accessibilityProblems(site.page)).toStrictEqual([]);
        await site.browser.close();
    });
});
