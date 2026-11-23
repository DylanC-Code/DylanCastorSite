import { describe, expect, it } from "vitest";

import {
    loop,
    oval,
} from "#/presentation/visitor/shared/topic/presenters/penPaths.ts";

/** The extent of a path's points along x (0) or y (1). */
function extent(path: string, axis: 1 | 2): number {
    const values = [...path.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/gu)].map(
        (match) => Number(match[axis]),
    );
    return Math.max(...values) - Math.min(...values);
}

const ring = oval({ x: 707, y: 179 }, 62, 17);

describe("the pen's shapes", () => {
    it("draws a loop of 45 points around its centre", () => {
        const path = loop(249, 139, 13);
        expect(path.match(/[ML]/gu)).toHaveLength(45);
        expect(path.startsWith("M")).toBe(true);
    });

    it("draws an oval wider than it is high", () => {
        expect(extent(ring, 1)).toBeGreaterThan(extent(ring, 2) * 3);
    });
});
