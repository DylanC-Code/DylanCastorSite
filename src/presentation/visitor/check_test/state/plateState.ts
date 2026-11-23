/**
 * The check plate as a small state: which marks have been seen, which ticket is
 * open and whether it is kept open (a click, a tap, a key, focus) or only shown
 * while the pointer rests on its mark, whether the end has played, and the off
 * lever. Six seen and the ticket closed: the end is due.
 */
export const markIds = [
    "phone",
    "cart",
    "count",
    "flick",
    "where",
    "off",
] as const;

export type MarkId = (typeof markIds)[number];

export interface PlateState {
    readonly seen: readonly MarkId[];
    readonly open: MarkId | null;
    readonly kept: boolean;
    readonly done: boolean;
    readonly leverOff: boolean;
}

export const startOfPlate: PlateState = {
    seen: [],
    open: null,
    kept: false,
    done: false,
    leverOff: false,
};

function opened(state: PlateState, mark: MarkId, kept: boolean): PlateState {
    if (state.done) {
        return state;
    }
    const seen = state.seen.includes(mark) ? state.seen : [...state.seen, mark];
    return { ...state, seen, open: mark, kept };
}

/** The pointer rests on a mark: its ticket shows, unless one is kept open. */
export function hoverMark(state: PlateState, mark: MarkId): PlateState {
    return state.kept ? state : opened(state, mark, false);
}

/** The pointer leaves the mark: a ticket only shown goes. */
export function leaveMark(state: PlateState): PlateState {
    return state.kept ? state : closeTicket(state);
}

/** Focus on a mark keeps its ticket open. */
export function focusMark(state: PlateState, mark: MarkId): PlateState {
    return opened(state, mark, true);
}

/** A click, a tap, Enter or Space: the kept ticket closes, any other opens kept. */
export function pressMark(state: PlateState, mark: MarkId): PlateState {
    return state.kept && state.open === mark
        ? closeTicket(state)
        : opened(state, mark, true);
}

export function closeTicket(state: PlateState): PlateState {
    return { ...state, open: null, kept: false };
}

export function pullLever(state: PlateState): PlateState {
    return { ...state, leverOff: !state.leverOff };
}

export function endIsDue(state: PlateState): boolean {
    return (
        state.seen.length === markIds.length
        && state.open === null
        && !state.done
    );
}

/** The end: the test corrected and stamped, the lever back on. */
export function finish(state: PlateState): PlateState {
    return endIsDue(state) ? { ...state, done: true, leverOff: false } : state;
}

/** "See it corrected", in the last ticket on a phone: closes it and ends. */
export function seeCorrected(state: PlateState): PlateState {
    return finish(closeTicket(state));
}
