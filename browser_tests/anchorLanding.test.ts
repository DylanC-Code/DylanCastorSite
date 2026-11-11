import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { landing } from "./pageChecks.ts";
import {
    desktop,
    laptop,
    type OpenedSite,
    openSite,
    phone,
    siteUrl,
} from "./servedSite.ts";

/**
 * Every jump to an anchor lands its section's first line just under the header
 * (32px, 24px on a phone), and the books are whole after #paths.
 */
describe.each([
    { ...desktop, gap: 32 },
    { ...laptop, gap: 32 },
    { ...phone, gap: 24 },
])("anchors on $name", ({ gap, ...device }) => {
    let site: OpenedSite;

    beforeAll(async () => {
        site = await openSite({ ...device, reducedMotion: "reduce" });
    });

    afterAll(async () => {
        await site.browser.close();
    });

    it.each(["paths", "floors"])(
        "a link to #%s lands its heading under the header",
        async (id) => {
            await site.page.goto(`${siteUrl}/#${id}`, { waitUntil: "load" });
            const landed = await landing(site.page, `#${id}`, `#${id}`);
            expect(Math.abs(landed.gap - gap)).toBeLessThanOrEqual(2);
        },
    );

    it("shows the whole shelf after the hero's Find your path", async () => {
        await site.page.goto(siteUrl, { waitUntil: "load" });
        await site.page.click('a.btn[href="#paths"]');
        const landed = await landing(site.page, "#paths", ".shelf");
        expect(Math.abs(landed.gap - gap)).toBeLessThanOrEqual(2);
        expect(landed.cut).toBe(0);
        await site.page.screenshot({
            path: `browser_tests/screenshots/landing_paths_${device.name}.png`,
        });
    });
});
