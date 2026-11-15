import { describe, expect, it } from "vitest";

import { legalRuns } from "#/presentation/visitor/legal/presenters/legalRuns.ts";

describe("a legal paragraph's runs", () => {
    it("marks key phrases and italics, and drops the stars", () => {
        expect(
            legalRuns(
                "EI stands for *entrepreneur individuel*, I keep **one year**.",
            ),
        ).toEqual([
            { text: "EI stands for ", mark: "plain" },
            { text: "entrepreneur individuel", mark: "italic" },
            { text: ", I keep ", mark: "plain" },
            { text: "one year", mark: "key" },
            { text: ".", mark: "plain" },
        ]);
    });

    it("keeps a paragraph without marks whole", () => {
        expect(legalRuns("Ask me before reusing them.")).toEqual([
            { text: "Ask me before reusing them.", mark: "plain" },
        ]);
    });
});
