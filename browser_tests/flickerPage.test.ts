import { describe, expect, it } from "vitest";

import { sideOverflow } from "./pageChecks.ts";
import { desktop, openSite, phone, siteUrl } from "./servedSite.ts";

const flickerUrl = `${siteUrl}/shopify-cro/flicker-free-ab-tests`;

/**
 * The rest of the flicker page: the cabinet, the two wordings, the page without
 * script, a phone.
 */
describe("the details cabinet", () => {
    it("writes one drawer's note at a time", async () => {
        const site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(flickerUrl, { waitUntil: "load" });
        await site.page.click('[data-drawer="1"]');
        expect(
            await site.page.getAttribute('[data-drawer="1"]', "aria-expanded"),
        ).toBe("true");
        expect(await site.page.isVisible('[data-note="1"]')).toBe(true);
        expect(await site.page.isVisible('[data-note="0"]')).toBe(false);
        await site.browser.close();
    });
});

describe("the two wordings", () => {
    it("speaks to an agency that came through its home", async () => {
        const site = await openSite(desktop);
        await site.page.goto(flickerUrl, { waitUntil: "load" });
        expect(await site.page.innerText("#topic-ask-title")).toContain(
            "your tests",
        );
        await site.page.goto(`${flickerUrl}?via=agencies`, {
            waitUntil: "load",
        });
        expect(await site.page.innerText("#topic-ask-title")).toContain(
            "your clients’ tests",
        );
        await site.browser.close();
    });
});

describe("the flicker page without JavaScript", () => {
    it("is a still page: no tabs, the cabinet shut, all five notes", async () => {
        const site = await openSite({ ...desktop, javaScriptEnabled: false });
        await site.page.goto(flickerUrl, { waitUntil: "load" });
        expect(await site.page.isVisible("[data-tabs]")).toBe(false);
        expect(await site.page.locator(".cabinet-note:visible").count()).toBe(
            5,
        );
        expect(await site.page.isDisabled('[data-drawer="0"]')).toBe(true);
        await site.browser.close();
    });
});

describe("the flicker page on a phone", () => {
    it.each([320, 390])("never scrolls sideways at %ipx", async (width) => {
        const site = await openSite({
            ...phone,
            viewport: { width, height: 800 },
        });
        await site.page.goto(flickerUrl, { waitUntil: "load" });
        expect(await sideOverflow(site.page)).toBe(0);
        await site.browser.close();
    });

    it("opens the plate's wide view", async () => {
        const site = await openSite(phone);
        await site.page.goto(flickerUrl, { waitUntil: "load" });
        await site.page.click("[data-wide-open]");
        expect(await site.page.getAttribute("[data-plate]", "data-wide")).toBe(
            "on",
        );
        await site.browser.close();
    });
});
