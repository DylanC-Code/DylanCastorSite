/**
 * The steps section's scroll model (agencies steps handoff). `y` is how far the
 * steps have run under the stuck ticket. Each step block is 600px: the current
 * step is the nearest block, progress runs over the four gaps, the ticket's
 * title part tears past 60px and its stub past 2330px.
 */
export const stepHeight = 600;
const tearAt = 60;
const endAt = 2330;
const lastStep = 4;

export interface StepScroll {
    readonly current: number;
    readonly progress: number;
    readonly torn: boolean;
    readonly ended: boolean;
}

export function stepScroll(y: number): StepScroll {
    return {
        current: clamp(Math.round(y / stepHeight), 0, lastStep),
        progress: clamp(y / (stepHeight * lastStep), 0, 1),
        torn: y > tearAt,
        ended: y > endAt,
    };
}

/** Steps seen at least once: a step's own motion plays the first time only. */
export function withSeen(
    seen: ReadonlySet<number>,
    current: number,
): ReadonlySet<number> {
    return seen.has(current) ? seen : new Set([...seen, current]);
}

function clamp(value: number, low: number, high: number): number {
    return Math.min(high, Math.max(low, value));
}
