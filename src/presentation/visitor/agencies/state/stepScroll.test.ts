import { describe, expect, it } from "vitest";

import {
    stepScroll,
    withSeen,
} from "#/presentation/visitor/agencies/state/stepScroll.ts";

describe("stepScroll", () => {
    it("starts on step 1, the ticket whole", () => {
        expect(stepScroll(0)).toEqual({
            current: 0,
            progress: 0,
            torn: false,
            ended: false,
        });
    });

    it("tears the title part just past 60px, not at it", () => {
        expect(stepScroll(60).torn).toBe(false);
        expect(stepScroll(61).torn).toBe(true);
    });

    it("moves to the nearest step block", () => {
        expect(stepScroll(299).current).toBe(0);
        expect(stepScroll(300).current).toBe(1);
        expect(stepScroll(1200).current).toBe(2);
    });

    it("cuts the stub just past 2330px", () => {
        expect(stepScroll(2330).ended).toBe(false);
        expect(stepScroll(2331)).toMatchObject({ current: 4, ended: true });
    });

    it("clamps the step and the progress at both ends", () => {
        expect(stepScroll(-500)).toMatchObject({ current: 0, progress: 0 });
        expect(stepScroll(9000)).toMatchObject({ current: 4, progress: 1 });
    });
});

describe("withSeen", () => {
    it("remembers a step the first time it is current", () => {
        expect([...withSeen(new Set([0]), 2)]).toEqual([0, 2]);
    });

    it("keeps the same set when the step was seen already", () => {
        const seen = new Set([0, 1]);
        expect(withSeen(seen, 1)).toBe(seen);
    });
});
