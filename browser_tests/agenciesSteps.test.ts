import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems } from "./pageChecks.ts";
import { desktop, type OpenedSite, openSite, siteUrl } from "./servedSite.ts";

/** Scrolls so the steps have run `y` px under the stuck ticket. */
async function runStepsTo(page: Page, y: number): Promise<void> {
    await page.evaluate<number>(
        `(() => { const list = document.querySelector("[data-steps-list]"); const band = document.querySelector("[data-ticket]");
        const ran = document.querySelector("body > header").offsetHeight + band.offsetHeight - list.getBoundingClientRect().top;
        window.scrollBy({ top: ${y} - ran, behavior: "instant" }); return 0; })()`,
    );
    await page.waitForTimeout(250);
}

/** The opacity of every step, in order. */
function stepOpacities(page: Page): Promise<string[]> {
    return page
        .locator("[data-step]")
        .evaluateAll((all) =>
            all.map((step) => getComputedStyle(step).opacity),
        );
}

function currentStation(page: Page): Promise<string | null> {
    return page.getAttribute(
        '[data-station][aria-current="step"]',
        "data-station",
    );
}

/**
 * The agencies steps on desktop: the ticket follows the scroll, the tab brings
 * you back.
 */
describe("the agencies steps on desktop", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("marks the step you are on, in the ticket", async () => {
        await runStepsTo(site.page, 1200);
        expect(await currentStation(site.page)).toBe("2");
        expect(await site.page.getAttribute("[data-steps]", "data-torn")).toBe(
            "true",
        );
    });

    it("cuts the stub at the end and drops a tab back to step 1", async () => {
        await runStepsTo(site.page, 2400);
        expect(await site.page.getAttribute("[data-steps]", "data-ended")).toBe(
            "true",
        );
        await site.page.click("[data-ticket-tab]");
        await site.page.waitForTimeout(1500);
        expect(await currentStation(site.page)).toBe("0");
    });
});

/**
 * Without JavaScript every step reads in full: nothing dimmed, the ticket
 * whole.
 */
describe("the agencies steps without JavaScript", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, javaScriptEnabled: false });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("shows every step at full strength", async () => {
        expect(await stepOpacities(site.page)).toEqual([
            "1",
            "1",
            "1",
            "1",
            "1",
        ]);
    });
});

/**
 * Accessibility as a visitor reads it: the hero and the ticket, then each step
 * while it is the current one, at full strength.
 */
describe("the agencies page, step by step, for assistive tech", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("has no problem in the hero and the ticket", async () => {
        expect(
            await accessibilityProblems(
                site.page,
                "main > section:first-child",
            ),
        ).toEqual([]);
        expect(await accessibilityProblems(site.page, "[data-ticket]")).toEqual(
            [],
        );
    });

    it.each([0, 1, 2, 3, 4])(
        "has no problem in step %i while it is current",
        async (index) => {
            await runStepsTo(site.page, index * 600);
            expect(
                await accessibilityProblems(
                    site.page,
                    `[data-step="${index}"]`,
                ),
            ).toEqual([]);
        },
    );
});
