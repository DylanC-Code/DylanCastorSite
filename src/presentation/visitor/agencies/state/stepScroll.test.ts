import { describe, expect, it } from "vitest";

import {
    stepScroll,
    withSeen,
} from "#/presentation/visitor/agencies/state/stepScroll.ts";

const desktop = [0, 600, 1200, 1800, 2400];
const phone = [0, 820, 1640, 2440, 3240];

describe("stepScroll on desktop (600px blocks, cut 70px early)", () => {
    it("starts on step 1, the ticket whole", () => {
        expect(stepScroll(0, desktop, 70)).toEqual({
            current: 0,
            progress: 0,
            torn: false,
            ended: false,
        });
    });

    it("tears the title part just past 60px, not at it", () => {
        expect(stepScroll(60, desktop, 70).torn).toBe(false);
        expect(stepScroll(61, desktop, 70).torn).toBe(true);
    });

    it("moves to the nearest step block", () => {
        expect(stepScroll(299, desktop, 70).current).toBe(0);
        expect(stepScroll(301, desktop, 70).current).toBe(1);
        expect(stepScroll(1200, desktop, 70).current).toBe(2);
    });

    it("cuts the stub just past 2330px", () => {
        expect(stepScroll(2330, desktop, 70).ended).toBe(false);
        expect(stepScroll(2331, desktop, 70)).toMatchObject({
            current: 4,
            ended: true,
        });
    });

    it("clamps the progress at both ends", () => {
        expect(stepScroll(-500, desktop, 70)).toMatchObject({
            current: 0,
            progress: 0,
        });
        expect(stepScroll(9000, desktop, 70)).toMatchObject({
            current: 4,
            progress: 1,
        });
    });
});

describe("stepScroll on a phone (measured blocks, cut 80px early)", () => {
    it("follows the real block tops, however tall a step grows", () => {
        expect(stepScroll(1100, phone, 80).current).toBe(1);
        expect(stepScroll(1300, phone, 80).current).toBe(2);
    });

    it("cuts the stub 80px before the last block", () => {
        expect(stepScroll(3160, phone, 80).ended).toBe(false);
        expect(stepScroll(3161, phone, 80).ended).toBe(true);
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
