import { describe, expect, it } from "vitest";

import {
    beltBox,
    currentLevel,
} from "#/presentation/visitor/brands/state/scrollLevels.ts";

const spans = [
    { top: -500, bottom: -20 },
    { top: -20, bottom: 460 },
    { top: 460, bottom: 940 },
];

describe("the current level of the scrolled house", () => {
    it("is the level crossing the reading line", () => {
        expect(currentLevel(spans, 380)).toBe(1);
    });

    it("counts a level's top edge as in, its bottom edge as out", () => {
        expect(currentLevel(spans, 460)).toBe(2);
        expect(currentLevel(spans, -20)).toBe(1);
    });

    it("is none above or below the house", () => {
        expect(currentLevel(spans, -600)).toBe(-1);
        expect(currentLevel(spans, 1000)).toBe(-1);
    });
});

describe("the belt of the scrolled house", () => {
    it("runs from the theme's pulley to the cellar's, at x 422 to 438", () => {
        const scene = { left: 40, width: 286, height: 130 };
        expect(
            beltBox(
                { ...scene, top: 600 },
                { ...scene, top: 1600 },
                { top: 100, left: 20, width: 300, height: 2000 },
            ),
        ).toEqual({ top: 552, bottom: 1541.6, left: 294.3, width: 10.4 });
    });
});
