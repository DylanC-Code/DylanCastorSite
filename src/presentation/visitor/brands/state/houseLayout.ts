/**
 * The house's geometry for the chosen level `k` (0 storefront to 3 behind the
 * store), in px from the house's top (the roof is 80px high). Pure: the DOM
 * glue sets these as custom properties; CSS moves everything in 700–900ms.
 */
const roofHeight = 80;
export const bigLevel = 216;
export const smallLevel = 92;

export interface HouseLayout {
    /** The levels' heights, top to bottom: the chosen one big. */
    readonly heights: readonly number[];
    /** The street line: always just under the storefront. */
    readonly street: number;
    /** The lift cabin's top in the shaft, and so the rope's length. */
    readonly cabin: number;
    /** The roof dial's needle, in degrees. */
    readonly needle: number;
    /**
     * The belt, from the levels' top: from the theme's pulley down to the
     * cellar's, wherever the scenes sit (centred, 178px or 80px high).
     */
    readonly belt: { readonly top: number; readonly bottom: number };
}

const levels = [0, 1, 2, 3];

/** A scene's drawn height: 178px in the chosen level, 80px elsewhere. */
function sceneHeight(level: number, k: number): number {
    return level === k ? 178 : 80;
}

/** A point at `y` of a scene's 200 units, in px from its level's top. */
function inLevel(y: number, level: number, k: number): number {
    const height = level === k ? bigLevel : smallLevel;
    const drawn = sceneHeight(level, k);
    return (height - drawn) / 2 + (y / 200) * drawn;
}

/** The level asked for, kept within the four. */
export function clampLevel(k: number): number {
    return Math.min(3, Math.max(0, Math.round(k)));
}

export function houseLayout(chosen: number): HouseLayout {
    const k = clampLevel(chosen);
    const heights = levels.map((level) =>
        level === k ? bigLevel : smallLevel,
    );
    return {
        heights,
        street: roofHeight + (heights[0] ?? smallLevel),
        cabin: k * smallLevel + 58,
        needle: -54 + 36 * k,
        belt: {
            top: (heights[0] ?? 0) + inLevel(80, 1, k),
            bottom: 492 - (heights[3] ?? 0) + inLevel(64, 3, k),
        },
    };
}
