import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, sideOverflow } from "./pageChecks.ts";
import {
    desktop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

/**
 * The pages not written yet (closed floor handoff): floors II, III, IV and All
 * behind one closed curtain, the lift opening the floors panel.
 */
const lift = "[data-opens-floors]";
const panelOpen = '[data-design="card"]';

function openState(site: OpenedSite): Promise<string | null> {
    return site.page.getAttribute(panelOpen, "data-open");
}

function liftHasFocus(site: OpenedSite): Promise<boolean> {
    return site.page.evaluate<boolean>(
        `document.activeElement === document.querySelector('${lift}')`,
    );
}

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

describe("a closed floor's lift", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/development`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("opens the floors panel from the lift, and gives the focus back to it", async () => {
        await site.page.click(lift);
        expect([
            await openState(site),
            await site.page.getAttribute(lift, "aria-expanded"),
        ]).toStrictEqual(["true", "true"]);
        await site.page.keyboard.press("Escape");
        expect([await openState(site), await liftHasFocus(site)]).toStrictEqual(
            ["false", true],
        );
    });

    it("opens it from the keyboard too, the lift before the ask", async () => {
        await site.page.focus(lift);
        await site.page.keyboard.press("Enter");
        expect(await openState(site)).toBe("true");
        await site.page.keyboard.press("Escape");
        await site.page.keyboard.press("Tab");
        expect(
            await site.page.evaluate<string>(
                "document.activeElement.className",
            ),
        ).toContain("ask-link");
    });
});

describe("a closed floor on a phone", () => {
    it("points to the corner's mark, with no lift and no sideways scroll", async () => {
        const site = await openSite({ ...phone, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/how-i-build-software`, {
            waitUntil: "load",
        });
        expect([
            await site.page.innerText(".floor-hint"),
            await site.page.isVisible(lift),
            await site.page.isVisible(".closed-phone"),
            await sideOverflow(site.page),
        ]).toStrictEqual([
            "THIS FLOOR OPENS LATER · THE MARK IN THE CORNER OPENS THE FLOORS",
            false,
            true,
            0,
        ]);
        expect(await accessibilityProblems(site.page)).toStrictEqual([]);
        await site.browser.close();
    });
});
