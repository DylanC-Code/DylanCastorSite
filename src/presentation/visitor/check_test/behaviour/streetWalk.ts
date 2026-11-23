import { shopX } from "#/presentation/visitor/check_test/presenters/sheetGeometry.ts";
import type { Visit } from "#/presentation/visitor/check_test/state/streetRules.ts";

/**
 * A visitor's walk, in the street's units: he fades in at the left, walks at 40
 * units a second to the signpost, stops there 0.6s, walks to his door and fades
 * out as he goes in.
 */
const speed = 40;
const enter = -26;
export const pause = 600;

/** Where a visitor stops, at the signpost; a still one stands there. */
export const signpostStop = shopX - 48 - 46;

function doorX(door: Visit["door"]): number {
    return shopX + (door === "B" ? 106 : 24);
}

/** When he stops at the signpost, and when he reaches his door, in ms. */
export function walkTimes(door: Visit["door"]): {
    stop: number;
    inAt: number;
} {
    const stop = ((signpostStop - enter) / speed) * 1000;
    const onward = ((doorX(door) - signpostStop) / speed) * 1000;
    return { stop, inAt: stop + pause + onward };
}

function step(x: number, at: number, total: number): Keyframe {
    return { transform: `translateX(${x}px)`, opacity: 1, offset: at / total };
}

export function walk(figure: Element, door: Visit["door"]): Animation {
    const end = doorX(door);
    const { stop, inAt } = walkTimes(door);
    const total = inAt + 250;
    return figure.animate(
        [
            { transform: `translateX(${enter}px)`, opacity: 0, offset: 0 },
            step(enter + 10, 250, total),
            step(signpostStop, stop, total),
            step(signpostStop, stop + pause, total),
            step(end, inAt, total),
            { transform: `translateX(${end + 3}px)`, opacity: 0, offset: 1 },
        ],
        { duration: total },
    );
}
