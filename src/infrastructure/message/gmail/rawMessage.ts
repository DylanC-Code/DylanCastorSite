import type { Mail } from "#/infrastructure/message/gmail/gmailMail.ts";

/**
 * A mail as the Gmail API takes it: an RFC 2822 message, base64url encoded.
 * Every name and the subject are UTF-8 encoded words, the text is base64: no
 * visitor input ever reaches a header raw (and none carries a line break).
 */
const utf8 = new TextEncoder();

function base64Of(bytes: Uint8Array): string {
    return btoa(
        Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""),
    );
}

/** Base64 for URLs, unpadded: JSON Web Tokens and Gmail's `raw`. */
export function base64Url(bytes: Uint8Array): string {
    return base64Of(bytes)
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
}

function encodedWord(text: string): string {
    return `=?UTF-8?B?${base64Of(utf8.encode(text))}?=`;
}

function address(who: {
    readonly email: string;
    readonly name?: string;
}): string {
    return who.name === undefined
        ? who.email
        : `${encodedWord(who.name)} <${who.email}>`;
}

export function rawOf(mail: Mail): string {
    const body = base64Of(utf8.encode(mail.text)).match(/.{1,76}/gu) ?? [];
    const lines = [
        `From: ${address(mail.from)}`,
        `To: ${mail.to}`,
        `Reply-To: ${address(mail.replyTo)}`,
        `Subject: ${encodedWord(mail.subject)}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        ...body,
    ];
    return base64Url(utf8.encode(lines.join("\r\n")));
}
