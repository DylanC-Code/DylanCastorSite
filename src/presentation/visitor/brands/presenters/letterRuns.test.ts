import { describe, expect, it } from "vitest";

import { letterRuns } from "#/presentation/visitor/brands/presenters/letterRuns.ts";

describe("the guarantee's letter runs", () => {
    it("marks the phrases between brackets and drops the brackets", () => {
        expect(
            letterRuns("On your store, [nothing goes live]. I [check]."),
        ).toEqual([
            { text: "On your store, ", marked: false },
            { text: "nothing goes live", marked: true },
            { text: ". I ", marked: false },
            { text: "check", marked: true },
            { text: ".", marked: false },
        ]);
    });

    it("keeps a letter without brackets whole", () => {
        expect(letterRuns("Plain words.")).toEqual([
            { text: "Plain words.", marked: false },
        ]);
    });
});
