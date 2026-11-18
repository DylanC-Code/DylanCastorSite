import { describe, expect, it } from "vitest";

import { desktop, openSite, phone, siteUrl } from "./servedSite.ts";

/**
 * Without script a form cannot send (decided 16 Nov 2026): the postcard and the
 * letter slot are hidden, and "Email me at" the address shows instead.
 */
const forms = [
    { page: "/agencies", form: "[data-postcard-form]" },
    { page: "/cro", form: "[data-letter-form]" },
];

describe.each([desktop, phone])(
    "the forms without script, on $name",
    (size) => {
        it.each(forms)(
            "$page shows the email in place of its form",
            async (one) => {
                const site = await openSite({
                    ...size,
                    javaScriptEnabled: false,
                });
                await site.page.goto(`${siteUrl}${one.page}`, {
                    waitUntil: "load",
                });
                expect([
                    await site.page.isVisible(one.form),
                    await site.page.innerText(".no-script-email"),
                    await site.page.getAttribute(".no-script-email a", "href"),
                ]).toStrictEqual([
                    false,
                    "Email me at contact@dylancastor.com.",
                    "mailto:contact@dylancastor.com",
                ]);
                await site.browser.close();
            },
        );
    },
);

describe("the forms with script", () => {
    it.each(forms)("$page shows its form and no email line", async (one) => {
        const site = await openSite({ ...desktop, reducedMotion: "reduce" });
        await site.page.goto(`${siteUrl}${one.page}`, { waitUntil: "load" });
        expect([
            await site.page.locator(one.form).count(),
            await site.page.locator(".no-script-email").count(),
        ]).toStrictEqual([1, 0]);
        await site.browser.close();
    });
});
