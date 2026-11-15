import { describe, expect, it } from "vitest";

import { isListed } from "#/presentation/shared/document/presenters/searchListing.ts";

const site = new URL("https://dylancastor.com");
const open = ["/", "/cro"];

describe("isListed", () => {
    it("lists the open pages, the home included", () => {
        expect([
            isListed(new URL("https://dylancastor.com/"), open, site),
            isListed(new URL("https://dylancastor.com/cro"), open, site),
        ]).toStrictEqual([true, true]);
    });

    it("hides every other page, one under an open page included", () => {
        expect([
            isListed(new URL("https://dylancastor.com/legal"), open, site),
            isListed(new URL("https://dylancastor.com/cro/x"), open, site),
        ]).toStrictEqual([false, false]);
    });
});
