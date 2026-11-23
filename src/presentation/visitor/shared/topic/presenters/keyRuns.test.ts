import { describe, expect, it } from "vitest";

import { keyRuns } from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";

describe("a text's key phrases", () => {
    it("marks the phrases between double stars and drops the stars", () => {
        expect(keyRuns("A page that **jumps** gets noticed.")).toEqual([
            { text: "A page that ", key: false },
            { text: "jumps", key: true },
            { text: " gets noticed.", key: false },
        ]);
    });

    it("keeps a text without stars whole", () => {
        expect(keyRuns("Plain words.")).toEqual([
            { text: "Plain words.", key: false },
        ]);
    });
});
