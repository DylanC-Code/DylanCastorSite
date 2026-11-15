/** A room's top and bottom on screen, in px. */
export interface Span {
    readonly top: number;
    readonly bottom: number;
}

/**
 * The published room to open on a phone: the one whose middle is nearest the
 * middle of the screen.
 */
export function nearestToMiddle(
    spans: readonly Span[],
    screen: number,
): number {
    const gaps = spans.map((span) =>
        Math.abs((span.top + span.bottom) / 2 - screen / 2),
    );
    return gaps.indexOf(Math.min(...gaps));
}

export interface Jump {
    readonly direction: "down" | "up";
    readonly duration: number;
    /** He leaves 260ms after the curtains start to move. */
    readonly delay: number;
}

/** The visitor's jump from one open room to another. */
export function jump(from: number, to: number): Jump {
    return to > from
        ? { direction: "down", duration: 760, delay: 260 }
        : { direction: "up", duration: 700, delay: 260 };
}
