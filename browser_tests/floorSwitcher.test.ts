import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, focusedHref } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

/** What the switcher of a design says about itself right now. */
async function switcherState(page: Page, design: string): Promise<object> {
    const root = `[data-design="${design}"]`;
    return {
        expanded: await page.getAttribute(
            `${root} [aria-controls]`,
            "aria-expanded",
        ),
        focused: await focusedHref(page),
        current: await page.getAttribute(
            `${root} nav [aria-current="page"]`,
            "href",
        ),
        laterHref: await page.getAttribute(
            `${root} nav [aria-disabled="true"]`,
            "href",
        ),
    };
}

/** Both designs, on floor II: open, focus, keyboard, and what is left out. */
describe("the switcher at launch", () => {
    it("is the card on every built page, with no design to rewrite", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/development`, { waitUntil: "load" });
        expect(
            await site.page.getAttribute("html", "data-switcher"),
        ).toBeNull();
        expect(
            await site.page.isVisible('[data-design="card"] [aria-controls]'),
        ).toBe(true);
        expect(
            await site.page.isVisible('[data-design="shelf"] [aria-controls]'),
        ).toBe(false);
        await site.browser.close();
    });
});

describe.each(["card", "shelf"] as const)("the %s switcher", (design) => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({
            ...desktop,
            switcher: design,
            reducedMotion: "reduce",
        });
        await site.page.goto(`${siteUrl}/development`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("opens on the current floor, floor V out of reach", async () => {
        await site.page.click(`[data-design="${design}"] [aria-controls]`);
        expect(await switcherState(site.page, design)).toEqual({
            expanded: "true",
            focused: "/development",
            current: "/development",
            laterHref: null,
        });
        await site.page.screenshot({
            path: `browser_tests/screenshots/switcher_${design}_open.png`,
        });
    });

    it("has no accessibility problem while open", async () => {
        expect(await accessibilityProblems(site.page)).toEqual([]);
    });

    it("closes on Escape and gives focus back to the opener", async () => {
        await site.page.keyboard.press("Escape");
        expect(await switcherState(site.page, design)).toMatchObject({
            expanded: "false",
            focused: "",
        });
        expect(
            await site.page.evaluate<boolean>(
                `document.activeElement?.hasAttribute("aria-controls") ?? false`,
            ),
        ).toBe(true);
    });
});
