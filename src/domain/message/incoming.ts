/**
 * What a form posts (the agencies postcard, the brands letter slot), and the
 * robot checks it must pass before anything is sent. Pure: no Worker API here.
 */
export interface Incoming {
    readonly message: string;
    readonly replyTo: string;
    readonly from: string;
    /** The hidden trap field: a person never fills it. */
    readonly website: string;
    /** Milliseconds between the visitor's first touch of the form and sending. */
    readonly writingMs: number;
}

export type Refusal =
    | "not a message"
    | "trap filled"
    | "too fast"
    | "empty message"
    | "too long"
    | "no reply address";

/** The robot checks' values, chosen by Dylan on 15 Nov 2026. */
const limits = {
    minimumWritingMs: 3000,
    longestMessage: 5000,
    longestName: 200,
    longestAddress: 254,
} as const;

function fieldsOf(body: unknown): ReadonlyMap<string, unknown> | null {
    return typeof body === "object" && body !== null
        ? new Map(Object.entries<unknown>({ ...body }))
        : null;
}

function required(
    fields: ReadonlyMap<string, unknown>,
    name: string,
): string | null {
    const value = fields.get(name);
    return typeof value === "string" ? value : null;
}

function optional(fields: ReadonlyMap<string, unknown>, name: string): string {
    return required(fields, name) ?? "";
}

function incomingFrom(fields: ReadonlyMap<string, unknown>): Incoming | null {
    const message = required(fields, "message");
    const replyTo = required(fields, "replyTo");
    const writingMs = fields.get("writingMs");
    if (message === null || replyTo === null || typeof writingMs !== "number") {
        return null;
    }
    const [from, website] = [
        optional(fields, "from"),
        optional(fields, "website"),
    ];
    return { message, replyTo, from, website, writingMs };
}

/** The posted body as a message, or null when it is not one. */
export function incomingOf(body: unknown): Incoming | null {
    const fields = fieldsOf(body);
    return fields === null ? null : incomingFrom(fields);
}

/**
 * Something, an @, something, a dot, something: enough to reply to. The one
 * rule: the forms mark "Reply to" with it, the form Worker refuses with it.
 */
export function isReplyAddress(value: string): boolean {
    const address = value.trim();
    return (
        address.length <= limits.longestAddress
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(address)
    );
}

/** Why a message is refused, or null when it may be sent. */
export function refusalOf(incoming: Incoming): Refusal | null {
    const checks: readonly [boolean, Refusal][] = [
        [incoming.website !== "", "trap filled"],
        [incoming.writingMs < limits.minimumWritingMs, "too fast"],
        [incoming.message.trim() === "", "empty message"],
        [
            incoming.message.length > limits.longestMessage
                || incoming.from.length > limits.longestName,
            "too long",
        ],
        [!isReplyAddress(incoming.replyTo), "no reply address"],
    ];
    const failed = checks.find(([fails]) => fails);
    return failed === undefined ? null : failed[1];
}
