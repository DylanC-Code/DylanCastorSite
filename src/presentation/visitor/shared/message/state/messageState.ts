/**
 * A message written on the page (the agencies postcard, the brands letter
 * slot): an optional front, the writing side, sending, then posted or failed.
 * Pure: each page's DOM glue only shows a state. "Posted" is reached from one
 * place only: a send that answered ok.
 */
type MessagePhase = "front" | "writing" | "sending" | "posted" | "failed";

export interface MessageState {
    readonly phase: MessagePhase;
    /** "Reply to" is empty or not an email: the field is marked. */
    readonly replyInvalid: boolean;
}

export const onFront: MessageState = {
    phase: "front",
    replyInvalid: false,
};

/** Where a form with no front (the letter slot) starts. */
const onWritingSide: MessageState = {
    phase: "writing",
    replyInvalid: false,
};

/** Something, an @, something, a dot, something: enough to reply to. */
export function isReplyAddress(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value.trim());
}

/** Pressing the front turns the card over to its writing side. */
export function turn(state: MessageState): MessageState {
    return state.phase === "front" ? onWritingSide : state;
}

/**
 * "Post it": from the writing side (or after a failure), a valid "Reply to"
 * starts sending; an invalid one keeps the card where it is, marked.
 */
export function post(state: MessageState, replyTo: string): MessageState {
    if (state.phase !== "writing" && state.phase !== "failed") {
        return state;
    }
    if (!isReplyAddress(replyTo)) {
        return { phase: state.phase, replyInvalid: true };
    }
    return { phase: "sending", replyInvalid: false };
}

/** The send's answer: posted when it went through, failed otherwise. */
export function sent(state: MessageState, ok: boolean): MessageState {
    if (state.phase !== "sending") {
        return state;
    }
    return { phase: ok ? "posted" : "failed", replyInvalid: false };
}

/** "Write another": back to an empty writing side. */
export function writeAnother(state: MessageState): MessageState {
    return state.phase === "posted" ? onWritingSide : state;
}
