import { describe, expect, it } from "vitest";

import { accessibilityProblems, sideOverflow } from "./pageChecks.ts";
import { desktop, openSite, phone, siteUrl } from "./servedSite.ts";

/**
 * The legal notice in its two languages, the link under each form, and the
 * visitor's path carried in the address, never stored on the device.
 */
describe("the legal notice", () => {
    it("reads in English, says so, and points to its French page", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/legal`, { waitUntil: "load" });
        expect(await site.page.getAttribute("html", "lang")).toBe("en");
        expect(await site.page.innerText("h1")).toBe("Legal notice.");
        expect(
            await site.page.getAttribute(
                'link[rel="alternate"][hreflang="fr"]',
                "href",
            ),
        ).toContain("/mentions-legales");
        expect(await site.page.isVisible("#your_data")).toBe(true);
        expect(await site.page.isVisible('a[href^="tel:+33"]')).toBe(true);
        expect(await accessibilityProblems(site.page)).toStrictEqual([]);
        await site.browser.close();
    });

    it("reads in French, footer included, on a phone", async () => {
        const site = await openSite(phone);
        await site.page.goto(`${siteUrl}/mentions-legales`, {
            waitUntil: "load",
        });
        expect(await site.page.getAttribute("html", "lang")).toBe("fr");
        expect(await site.page.innerText("h1")).toBe("Mentions légales.");
        expect(await site.page.innerText("footer")).toContain(
            "Mentions légales",
        );
        expect(await sideOverflow(site.page)).toBe(0);
        expect(await accessibilityProblems(site.page)).toStrictEqual([]);
        await site.browser.close();
    });
});

describe("the link under each form", () => {
    it("leads to the notice's data section from both homes", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        const agencies = await site.page.getAttribute(".data-line a", "href");
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        const brands = await site.page.getAttribute(".data-line a", "href");
        expect([agencies, brands]).toStrictEqual([
            "/legal?via=agencies#your_data",
            "/legal?via=brands#your_data",
        ]);
        await site.browser.close();
    });
});

describe("the visitor's path", () => {
    it("is kept in the address, not on the device", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        const stored = await site.page.evaluate<number>(
            "localStorage.length + sessionStorage.length + document.cookie.length",
        );
        expect(stored).toBe(0);
        await site.browser.close();
    });
});
