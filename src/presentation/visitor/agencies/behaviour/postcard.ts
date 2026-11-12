import { sendMessage } from "#/presentation/visitor/shared/message/behaviour/sendMessage.ts";
import {
    onFront,
    post,
    type MessageState,
    sent,
    turn,
    writeAnother,
} from "#/presentation/visitor/shared/message/state/messageState.ts";

interface Parts {
    root: HTMLElement;
    front: HTMLButtonElement;
    form: HTMLFormElement;
    message: HTMLTextAreaElement;
    reply: HTMLInputElement;
    from: HTMLInputElement;
    again: HTMLButtonElement;
    news: HTMLElement;
}

/** One part of the card, by its `data-postcard-*` mark: missing is a bug. */
function part<T extends Element>(
    root: HTMLElement,
    name: string,
    kind: new () => T,
): T {
    const found = root.querySelector(`[data-postcard-${name}]`);
    if (!(found instanceof kind)) {
        throw new TypeError(`The postcard has no ${name}`);
    }
    return found;
}

function partsOf(root: HTMLElement): Parts {
    return {
        root,
        front: part(root, "front", HTMLButtonElement),
        form: part(root, "form", HTMLFormElement),
        message: part(root, "message", HTMLTextAreaElement),
        reply: part(root, "reply", HTMLInputElement),
        from: part(root, "from", HTMLInputElement),
        again: part(root, "again", HTMLButtonElement),
        news: part(root, "news", HTMLElement),
    };
}

/** Shows a state: which side is reachable, what is marked, what is said. */
function render(parts: Parts, state: MessageState): void {
    const { root, front, form, again, reply, news } = parts;
    const { dataset } = root;
    dataset["state"] = state.phase;
    front.inert = state.phase !== "front";
    form.inert = state.phase === "front" || state.phase === "posted";
    again.inert = state.phase !== "posted";
    reply.setAttribute("aria-invalid", String(state.replyInvalid));
    root.querySelector("[data-postcard-reply-error]")?.toggleAttribute(
        "hidden",
        !state.replyInvalid,
    );
    root.querySelector("[data-postcard-failed]")?.toggleAttribute(
        "hidden",
        state.phase !== "failed",
    );
    news.textContent = newsFor(news, state);
}

/** What the live region says: "posted" or "failed", in the page's own words. */
function newsFor(news: HTMLElement, state: MessageState): string {
    const { dataset } = news;
    const said: Partial<Record<MessageState["phase"], string | undefined>> = {
        posted: dataset["posted"],
        failed: dataset["failed"],
    };
    return said[state.phase] ?? "";
}

/**
 * The postcard, upgraded: its front shows, pressing it turns the card to the
 * writing side, "Post it" checks "Reply to", sends, then plays "posted" or says
 * it failed. Without this script the writing side is a plain form.
 */
export function initPostcard(root: HTMLElement): void {
    const parts = partsOf(root);
    let state = onFront;
    function show(next: MessageState): void {
        state = next;
        render(parts, next);
    }
    async function submit(): Promise<void> {
        show(post(state, parts.reply.value));
        if (state.phase !== "sending") {
            parts.reply.focus();
            return;
        }
        const { message, reply, from } = parts;
        const result = await sendMessage({
            message: message.value,
            replyTo: reply.value,
            from: from.value,
        });
        show(sent(state, result === "ok"));
    }
    bind(parts, { current: () => state, set: show, submit });
}

interface Controls {
    current: () => MessageState;
    set: (next: MessageState) => void;
    submit: () => Promise<void>;
}

function bind(parts: Parts, controls: Controls): void {
    const { root, front, form, message, again } = parts;
    front.addEventListener("click", () => {
        controls.set(turn(controls.current()));
        message.focus({ preventScroll: true });
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        void controls.submit();
    });
    again.addEventListener("click", () => {
        form.reset();
        controls.set(writeAnother(controls.current()));
        message.focus({ preventScroll: true });
    });
    form.noValidate = true;
    front.hidden = false;
    again.hidden = false;
    root.toggleAttribute("data-live", true);
    controls.set(controls.current());
}
