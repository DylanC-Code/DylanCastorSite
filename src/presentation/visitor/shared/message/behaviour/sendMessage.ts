/** What the postcard sends. */
export interface OutgoingMessage {
    readonly message: string;
    readonly replyTo: string;
    readonly from: string;
}

export type SendResult = "ok" | "failed";

/**
 * The one place that sends the postcard. Not wired yet: how it sends (a
 * service, an endpoint on the host) is still Dylan's call. Until then every
 * send fails, so the card never says "posted" for a message nobody got: the
 * visitor sees the failure sentence and the email link instead.
 */
export function sendMessage(_outgoing: OutgoingMessage): Promise<SendResult> {
    return Promise.resolve("failed");
}
