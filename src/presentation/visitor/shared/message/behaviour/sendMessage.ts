import type { RobotSigns } from "#/presentation/visitor/shared/message/behaviour/robotSigns.ts";

/** What a form sends: the visitor's words, and its robot signs. */
export interface OutgoingMessage extends RobotSigns {
    readonly message: string;
    readonly replyTo: string;
    readonly from: string;
}

export type SendResult = "ok" | "failed";

/** The form Worker's address, on the site itself (src/interfaces/form_worker). */
const endpoint = "/api/message";

/**
 * The one place that sends a message (the agencies postcard, the brands letter
 * slot): to the form Worker, which mails Dylan's own inbox. Only an answer of
 * success is "ok"; a refusal, an error, no network or no answer within 15
 * seconds is "failed", so a page never says "posted" for a message nobody got.
 */
export async function sendMessage(
    outgoing: OutgoingMessage,
): Promise<SendResult> {
    try {
        const answer = await fetch(endpoint, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(outgoing),
            signal: AbortSignal.timeout(15_000),
        });
        return answer.ok ? "ok" : "failed";
    } catch {
        return "failed";
    }
}
