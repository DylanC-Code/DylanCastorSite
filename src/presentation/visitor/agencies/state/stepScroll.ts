/**
 * The steps section's scroll model (agencies steps handoff, desktop and phone).
 * `y` is how far the steps have run under the stuck ticket. The current step is
 * the block whose top is nearest; progress runs to the last block; the title
 * part tears past 60px and the stub is cut a little before the last block
 * arrives (70px on desktop, the 2330 rule; 80px on a phone).
 */
const tearAt = 60;

export interface StepScroll {
    readonly current: number;
    readonly progress: number;
    readonly torn: boolean;
    readonly ended: boolean;
}

/** Where each step block starts, measured from the first one (0, 600, …). */
export type StepTops = readonly number[];

export function stepScroll(
    y: number,
    tops: StepTops,
    endBefore: number,
): StepScroll {
    const last = tops.at(-1) ?? 0;
    return {
        current: nearest(y, tops),
        progress: last === 0 ? 0 : clamp(y / last, 0, 1),
        torn: y > tearAt,
        ended: y > last - endBefore,
    };
}

/** Steps seen at least once: a step's own motion plays the first time only. */
export function withSeen(
    seen: ReadonlySet<number>,
    current: number,
): ReadonlySet<number> {
    return seen.has(current) ? seen : new Set([...seen, current]);
}

function nearest(y: number, tops: StepTops): number {
    let best = 0;
    tops.forEach((top, index) => {
        if (Math.abs(top - y) < Math.abs((tops[best] ?? 0) - y)) {
            best = index;
        }
    });
    return best;
}

function clamp(value: number, low: number, high: number): number {
    return Math.min(high, Math.max(low, value));
}
