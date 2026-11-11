import { describe, expect, it } from "vitest";

import { canonicalUrl } from "#/presentation/shared/document/presenters/canonicalUrl.ts";

const site = new URL("https://dylancastor.com");

describe("canonicalUrl", () => {
    it.each([
        ["/index.html", "https://dylancastor.com/"],
        ["/", "https://dylancastor.com/"],
        ["/cro/index.html", "https://dylancastor.com/cro"],
        ["/cro/", "https://dylancastor.com/cro"],
        [
            "/cro/flicker-free-ab-tests.html",
            "https://dylancastor.com/cro/flicker-free-ab-tests",
        ],
        [
            "/cro/flicker-free-ab-tests",
            "https://dylancastor.com/cro/flicker-free-ab-tests",
        ],
    ])("%s becomes %s", (pathname, expected) => {
        expect(canonicalUrl(pathname, site).href).toBe(expected);
    });
});
