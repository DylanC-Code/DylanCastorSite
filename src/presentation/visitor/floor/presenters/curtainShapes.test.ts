import { describe, expect, it } from "vitest";

import { curtainPaths } from "#/presentation/visitor/floor/presenters/curtainPaths.ts";
import { closedFloorCurtain } from "#/presentation/visitor/floor/presenters/curtainShapes.ts";

/** How many separate pieces a path draws (its moves, or its closed shapes). */
function count(path: string, mark: RegExp): number {
    return path.match(mark)?.length ?? 0;
}

describe("the closed floors' curtains", () => {
    it("hangs twelve swags and 61 folds across a closed floor", () => {
        const paths = curtainPaths(closedFloorCurtain);
        expect([
            count(paths.swags, /z/gu),
            count(paths.tassels, /z/gu),
            count(paths.strongFolds, /M/gu) + count(paths.faintFolds, /M/gu),
        ]).toStrictEqual([12, 11, 61]);
    });

    it("meets in the middle of the floor, and hems at 261", () => {
        const paths = curtainPaths(closedFloorCurtain);
        expect(paths.seam).toBe("M473.5 8V261M476.5 8V261");
        expect(paths.hem.startsWith("M4 261q4 6 8 0")).toBe(true);
    });
});
