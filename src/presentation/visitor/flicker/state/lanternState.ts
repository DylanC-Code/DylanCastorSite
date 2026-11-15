/**
 * The magic lantern's state, alone: the shutter (closed or open), the slide (A
 * or B), the moves since the last start, the way chosen, the way just left, and
 * the ways ever completed. Pure: the view draws a state, it holds none. The
 * usual way is open then slide; without flicker is slide then open.
 */
export type Part = "open" | "slide";
export type Way = "usual" | "clean";
export type Caption =
    | "hello"
    | "openA"
    | "openB"
    | "flick"
    | "slideDarkA"
    | "slideDarkB"
    | "close"
    | "cleanEnd";

export interface Lantern {
    readonly open: boolean;
    readonly slideB: boolean;
    readonly moves: readonly Part[];
    readonly intent: Way | null;
    readonly left: Way | null;
    readonly done: Readonly<Record<Way, boolean>>;
}

/** What a move did: the new state, its caption, and what it settled. */
export interface Outcome {
    readonly lantern: Lantern;
    readonly caption: Caption;
    /** The move left the chosen way. */
    readonly leftWay: boolean;
    /** Both ways are now done, for the first time: the hand appears. */
    readonly bothDone: boolean;
}

export const ways: Readonly<Record<Way, readonly [Part, Part]>> = {
    usual: ["open", "slide"],
    clean: ["slide", "open"],
};

export const firstLantern: Lantern = {
    open: false,
    slideB: false,
    moves: [],
    intent: null,
    left: null,
    done: { usual: false, clean: false },
};

/** Back to rest (shutter closed, slide A, no moves), with a way or none. */
export function start(lantern: Lantern, way: Way | null): Lantern {
    return { ...firstLantern, done: lantern.done, intent: way };
}

/** The moves are exactly this way's two. */
function follows(moves: readonly Part[], way: Way): boolean {
    const [first, second] = ways[way];
    return moves.length === 2 && moves[0] === first && moves[1] === second;
}

/** The moves so far still fit this way. */
function onTrack(moves: readonly Part[], way: Way): boolean {
    return moves.every((part, index) => ways[way][index] === part);
}

/** After the slide moved: the flicker if the page was shown, else unseen. */
function slideCaption(before: Lantern, after: Lantern): Caption {
    if (before.open) {
        return "flick";
    }
    return after.slideB ? "slideDarkB" : "slideDarkA";
}

/** After the shutter moved: hidden, the clean ending, or the page shown. */
function shutterCaption(after: Lantern): Caption {
    if (!after.open) {
        return "close";
    }
    if (follows(after.moves, "clean")) {
        return "cleanEnd";
    }
    return after.slideB ? "openB" : "openA";
}

function captionOf(before: Lantern, part: Part, after: Lantern): Caption {
    return part === "slide"
        ? slideCaption(before, after)
        : shutterCaption(after);
}

function turned(lantern: Lantern, part: Part): Lantern {
    return {
        ...lantern,
        open: part === "open" ? !lantern.open : lantern.open,
        slideB: part === "slide" ? !lantern.slideB : lantern.slideB,
        moves: [...lantern.moves, part],
    };
}

/** The ways completed so far, this move included. */
function doneAfter(
    moves: readonly Part[],
    done: Lantern["done"],
): Lantern["done"] {
    return {
        usual: done.usual || follows(moves, "usual"),
        clean: done.clean || follows(moves, "clean"),
    };
}

/** The way after this move: kept, completed (dropped), or left. */
function wayAfter(
    intent: Way | null,
    moves: readonly Part[],
): { intent: Way | null; left: Way | null } {
    if (intent === null || follows(moves, intent)) {
        return { intent: null, left: null };
    }
    return onTrack(moves, intent)
        ? { intent, left: null }
        : { intent: null, left: intent };
}

function allDone(done: Lantern["done"]): boolean {
    return done.usual && done.clean;
}

/** Makes a move: turns its part, records it, and settles the way. */
export function move(lantern: Lantern, part: Part): Outcome {
    const after = turned(lantern, part);
    const done = doneAfter(after.moves, lantern.done);
    const way = wayAfter(lantern.intent, after.moves);
    const leftWay = way.left !== null;
    return {
        lantern: {
            ...after,
            done,
            intent: way.intent,
            left: leftWay ? way.left : lantern.left,
        },
        caption: captionOf(lantern, part, after),
        leftWay,
        bothDone: allDone(done) && !allDone(lantern.done),
    };
}
