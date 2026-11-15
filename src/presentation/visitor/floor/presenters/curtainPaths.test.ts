import { describe, expect, it } from "vitest";

import { curtainPaths } from "#/presentation/visitor/floor/presenters/curtainPaths.ts";

const room = {
    width: 230,
    height: 270,
    folds: 15,
    swags: 3,
    drop: 20,
    hem: 261,
};

describe("a curtain's paths", () => {
    it("draws the desktop room's fifteen folds, eight strong, seven faint", () => {
        const paths = curtainPaths(room);
        expect(paths.strongFolds.match(/M/gu)).toHaveLength(8);
        expect(paths.faintFolds.match(/M/gu)).toHaveLength(7);
        expect(
            paths.strongFolds.startsWith("M6.0 8C3.0 91 9.0 178 6.0 261"),
        ).toBe(true);
    });

    it("hatches every other gap and meets in a double line in the middle", () => {
        const paths = curtainPaths(room);
        expect(paths.stripes).toHaveLength(7);
        expect(paths.seam).toBe("M113.5 8V261M116.5 8V261");
    });

    it("hangs three swags with a tassel at each of the two joins", () => {
        const paths = curtainPaths(room);
        expect(paths.swags.match(/z/gu)).toHaveLength(3);
        expect(paths.tassels.match(/z/gu)).toHaveLength(2);
        expect(paths.swags.startsWith("M0.0 4Q38.3 44.0 76.7 4z")).toBe(true);
    });

    it("draws the phone band shorter and wider: five swags, 29 folds", () => {
        const band = curtainPaths({
            width: 358,
            height: 100,
            folds: 29,
            swags: 5,
            drop: 16,
            hem: 90,
        });
        expect(band.tassels.match(/z/gu)).toHaveLength(4);
        expect(band.hem.startsWith("M4 90q4 6 8 0")).toBe(true);
        expect(band.strongFolds.match(/M/gu)).toHaveLength(15);
    });
});
