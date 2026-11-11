import type { Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { accessibilityProblems, sideOverflow } from "./pageChecks.ts";
import { type OpenedSite, openSite, phone, siteUrl } from "./servedSite.ts";

/** Scrolls so step `index` (its measured block) sits under the stuck ticket. */
async function runToStep(page: Page, index: number): Promise<void> {
    await page.evaluate<number>(
        `(() => { const list = document.querySelector("[data-steps-list]"); const band = document.querySelector("[data-ticket]");
        const steps = [...document.querySelectorAll("[data-step]")]; const top = steps[${index}].offsetTop - steps[0].offsetTop;
        const ran = document.querySelector("body > header").offsetHeight + band.offsetHeight - list.getBoundingClientRect().top;
        window.scrollBy({ top: top - ran, behavior: "instant" }); return 0; })()`,
    );
    await page.waitForTimeout(250);
}

function currentStation(page: Page): Promise<string | null> {
    return page.getAttribute(
        '[data-station][aria-current="step"]',
        "data-station",
    );
}

/** The agencies steps on a phone: the ticket follows, nothing scrolls sideways. */
describe("the agencies steps on a phone", () => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...phone, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it("never scrolls sideways", async () => {
        expect(await sideOverflow(site.page)).toBe(0);
    });

    it.each([0, 1, 2, 3, 4])(
        "marks step %i in the ticket and reads it accessibly",
        async (index) => {
            await runToStep(site.page, index);
            expect(await currentStation(site.page)).toBe(String(index));
            expect(
                await accessibilityProblems(
                    site.page,
                    `[data-step="${index}"]`,
                ),
            ).toEqual([]);
        },
    );

    it("cuts the stub at the end and drops the tab back to step 1", async () => {
        await runToStep(site.page, 4);
        expect(await site.page.getAttribute("[data-steps]", "data-ended")).toBe(
            "true",
        );
        await site.page.tap("[data-ticket-tab]");
        await site.page.waitForTimeout(1500);
        expect(await currentStation(site.page)).toBe("0");
    });
});
