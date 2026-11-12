import { describe, expect, it } from "vitest";

import {
    bigLevel,
    clampLevel,
    houseLayout,
    smallLevel,
} from "#/presentation/visitor/brands/state/houseLayout.ts";

function total(k: number): number {
    return houseLayout(k).heights.reduce((sum, h) => sum + h, 0);
}

const totals = [0, 1, 2, 3].map((k) => total(k));
const clamped = [-1, 4, 1.4].map((k) => clampLevel(k));
const streets = [1, 2, 3].map((k) => houseLayout(k).street);

describe("the house's layout", () => {
    it("opens on the storefront, big, the street just under it", () => {
        expect(houseLayout(0)).toEqual({
            heights: [216, 92, 92, 92],
            street: 296,
            cabin: 58,
            needle: -54,
            belt: { top: 254, bottom: 431.6 },
        });
    });

    it("keeps the four levels 492px high, whichever is chosen", () => {
        expect(bigLevel + 3 * smallLevel).toBe(492);
        expect(totals).toEqual([492, 492, 492, 492]);
    });

    it("lifts the street to the small storefront once another level is chosen", () => {
        expect(streets).toEqual([172, 172, 172]);
    });

    it("sends the lift down 92px a level and turns the needle 36deg", () => {
        expect(houseLayout(3)).toMatchObject({ cabin: 334, needle: 54 });
        expect(houseLayout(2)).toMatchObject({ cabin: 242, needle: 18 });
    });

    it("runs the belt from the theme's pulley to the cellar's", () => {
        expect(houseLayout(1).belt).toEqual({
            top: 92 + 19 + 71.2,
            bottom: 431.6,
        });
        expect(houseLayout(3).belt.top).toBe(92 + 38);
        expect(houseLayout(3).belt.bottom).toBeCloseTo(276 + 19 + 56.96);
    });

    it("keeps the chosen level within the four", () => {
        expect(clamped).toEqual([0, 3, 1]);
    });
});
