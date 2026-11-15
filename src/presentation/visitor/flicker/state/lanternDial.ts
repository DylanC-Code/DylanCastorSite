import type { Part } from "#/presentation/visitor/flicker/state/lanternState.ts";

/**
 * The dial, in quarter turns: one per move until the page is first shown (the
 * shutter first opened), at most four.
 */
export function dial(moves: readonly Part[]): number {
    const shown = moves.indexOf("open");
    return Math.min(4, shown >= 0 ? shown + 1 : moves.length);
}
