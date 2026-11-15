import { describe, expect, it } from "vitest";

import { desktop, openSite, siteUrl } from "./servedSite.ts";

/**
 * Both forms, sending for real: they post to the form Worker's address with the
 * robot signs, and only its success shows "posted". The refusals are in
 * agenciesPostcard.test.ts and brandsPage.test.ts (the test server refuses by
 * default), the Worker's own checks in src/interfaces/form_worker.
 */
const words = { message: "A test to build.", replyTo: "studio@agency.com" };

const signs = {
    message: words.message,
    replyTo: words.replyTo,
    from: "",
    website: "",
    hasTime: true,
};

function fieldsOf(body: unknown): Map<string, unknown> {
    return new Map(
        typeof body === "object" && body !== null
            ? Object.entries<unknown>({ ...body })
            : [],
    );
}

/** What a form posted, with its time reduced to "was it measured". */
function postedSigns(posted: unknown[]): unknown[] {
    return posted.map((body) => {
        const read = fieldsOf(body);
        return {
            message: read.get("message"),
            replyTo: read.get("replyTo"),
            from: read.get("from"),
            website: read.get("website"),
            hasTime: typeof read.get("writingMs") === "number",
        };
    });
}

describe("the forms, sending", () => {
    it("posts the postcard with its robot signs and shows it posted", async () => {
        const site = await openSite({
            ...desktop,
            mail: "sent",
            reducedMotion: "reduce",
        });
        await site.page.goto(`${siteUrl}/agencies`, { waitUntil: "load" });
        await site.page.click("[data-postcard-front]");
        await site.page.fill("#postcard-message", words.message);
        await site.page.fill("#postcard-reply", words.replyTo);
        await site.page.click(".paper-post");
        await site.page.waitForTimeout(300);
        expect(
            await site.page.getAttribute("[data-postcard]", "data-state"),
        ).toBe("posted");
        expect(postedSigns(site.posted)).toStrictEqual([signs]);
        await site.browser.close();
    });

    it("posts the letter slot the same way and shows it sent", async () => {
        const site = await openSite({
            ...desktop,
            mail: "sent",
            reducedMotion: "reduce",
        });
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        await site.page.fill("#slot-message", words.message);
        await site.page.fill("#slot-reply", words.replyTo);
        await site.page.click(".slot-send");
        await site.page.waitForTimeout(300);
        expect(
            await site.page.getAttribute("[data-letter-slot]", "data-state"),
        ).toBe("posted");
        expect(postedSigns(site.posted)).toStrictEqual([signs]);
        await site.browser.close();
    });
});

describe("the robot trap", () => {
    it("hides the robot trap from people and the keyboard", async () => {
        const site = await openSite(desktop);
        await site.page.goto(`${siteUrl}/cro`, { waitUntil: "load" });
        const trap = '[data-letter-form] [name="website"]';
        expect(
            await site.page.evaluate<string>(`(() => {
                const field = document.querySelector('${trap}');
                return [
                    Math.round(field.parentElement.getBoundingClientRect().width),
                    field.tabIndex,
                    field.closest("[aria-hidden]") !== null,
                ].join(" ");
            })()`),
        ).toBe("1 -1 true");
        await site.browser.close();
    });
});
