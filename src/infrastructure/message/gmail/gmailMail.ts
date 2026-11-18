import type { Incoming } from "#/domain/message/incoming.ts";

/**
 * The mail Dylan receives for one message: from his own inbox to itself (the
 * Gmail API sends as the account it signs in as), the visitor in Reply-To so
 * that answering is one click. No copy ever goes to the visitor.
 */
export interface Mail {
    readonly from: { readonly email: string; readonly name: string };
    readonly to: string;
    readonly replyTo: { readonly email: string; readonly name?: string };
    readonly subject: string;
    readonly text: string;
}

/** One line, no line breaks: what may go in a subject or a name. */
function oneLine(value: string): string {
    return value.replaceAll(/[\r\n]+/gu, " ").trim();
}

export function mailOf(incoming: Incoming, inbox: string): Mail {
    const replyTo = incoming.replyTo.trim();
    const name = oneLine(incoming.from);
    const who = name === "" ? replyTo : name;
    return {
        from: { email: inbox, name: "dylancastor.com" },
        to: inbox,
        replyTo: name === "" ? { email: replyTo } : { email: replyTo, name },
        subject: `A message from the site: ${who}`,
        text: [
            incoming.message.trim(),
            "",
            "—",
            `Reply to: ${replyTo}`,
            `From: ${name === "" ? "(not given)" : name}`,
        ].join("\n"),
    };
}
