import { watchForm } from "#/presentation/visitor/shared/message/behaviour/robotSigns.ts";
import { sendMessage } from "#/presentation/visitor/shared/message/behaviour/sendMessage.ts";
import {
    type MessageState,
    onWritingSide,
    post,
    sent,
    writeAnother,
} from "#/presentation/visitor/shared/message/state/messageState.ts";

interface Parts {
    root: HTMLElement;
    form: HTMLFormElement;
    message: HTMLTextAreaElement;
    reply: HTMLInputElement;
    from: HTMLInputElement;
    again: HTMLButtonElement;
    news: HTMLElement;
}

/** One part of the slot, by its `data-letter-*` mark: missing is a bug. */
function part<T extends Element>(
    root: HTMLElement,
    name: string,
    kind: new () => T,
): T {
    const found = root.querySelector(`[data-letter-${name}]`);
    if (!(found instanceof kind)) {
        throw new TypeError(`The letter slot has no ${name}`);
    }
    return found;
}

function partsOf(root: HTMLElement): Parts {
    return {
        root,
        form: part(root, "form", HTMLFormElement),
        message: part(root, "message", HTMLTextAreaElement),
        reply: part(root, "reply", HTMLInputElement),
        from: part(root, "from", HTMLInputElement),
        again: part(root, "again", HTMLButtonElement),
        news: part(root, "news", HTMLElement),
    };
}

/** What the live region says: sent or failed, in the page's own words. */
function newsFor(news: HTMLElement, state: MessageState): string {
    const { dataset } = news;
    const said: Partial<Record<MessageState["phase"], string | undefined>> = {
        posted: dataset["posted"],
        failed: dataset["failed"],
    };
    return said[state.phase] ?? "";
}

/** Shows a state: the note or the card, what is marked, what is said. */
function render(parts: Parts, state: MessageState): void {
    const { root, form, again, reply, news } = parts;
    const { dataset } = root;
    dataset["state"] = state.phase;
    form.inert = state.phase === "posted";
    again.inert = state.phase !== "posted";
    reply.setAttribute("aria-invalid", String(state.replyInvalid));
    root.querySelector("[data-letter-reply-error]")?.toggleAttribute(
        "hidden",
        !state.replyInvalid,
    );
    root.querySelector("[data-letter-failed]")?.toggleAttribute(
        "hidden",
        state.phase !== "failed",
    );
    news.textContent = newsFor(news, state);
}

/**
 * The letter slot, upgraded: "Slip it through the door" checks "Reply to",
 * sends, then plays the letter going in, or says it failed. Without this script
 * the note is a plain form.
 */
export function initLetterSlot(root: HTMLElement): void {
    const parts = partsOf(root);
    let state = onWritingSide;
    const signs = watchForm(parts.form);
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
            ...signs(),
        });
        show(sent(state, result === "ok"));
    }
    parts.form.addEventListener("submit", (event) => {
        event.preventDefault();
        void submit();
    });
    parts.again.addEventListener("click", () => {
        parts.form.reset();
        show(writeAnother(state));
        parts.message.focus({ preventScroll: true });
    });
    const { form } = parts;
    form.noValidate = true;
    show(state);
}
