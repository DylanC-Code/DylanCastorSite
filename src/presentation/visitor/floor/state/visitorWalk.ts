/**
 * The visitor's walk along the floor (desktop), in px of the 1100px building.
 * He walks 300px a second in whole strides of 460ms, so he always stops with
 * his feet together, and faces the way he walks. Pure: the DOM glue plays it.
 */
const strideMs = 460;
const pxPerSecond = 300;

/** Where he stands at the lift, facing the rooms. */
export const liftStop = 70;

/** The left edge of room `index`: rooms are 230px wide, 10px apart. */
export function roomLeft(index: number): number {
    return 126 + index * 240;
}

/**
 * Where he stops in a room: in a lit room behind its scene (34px in), at a
 * curtain 16px inside its left edge.
 */
export function roomStop(index: number, lit: boolean): number {
    return roomLeft(index) + (lit ? 34 : 16);
}

export interface Walk {
    readonly from: number;
    readonly to: number;
    readonly strides: number;
    readonly duration: number;
    readonly facingLeft: boolean;
}

/** The walk from `from` to `to`: whole strides, at least one. */
export function walk(from: number, to: number): Walk {
    const seconds = Math.abs(to - from) / pxPerSecond;
    const strides = Math.max(1, Math.round((seconds * 1000) / strideMs));
    return {
        from,
        to,
        strides,
        duration: strides * strideMs,
        facingLeft: to < from,
    };
}
