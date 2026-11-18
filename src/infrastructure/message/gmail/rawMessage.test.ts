import { describe, expect, it } from "vitest";

import { mailOf } from "#/infrastructure/message/gmail/gmailMail.ts";
import { fromBase64Url } from "#/infrastructure/message/gmail/googleFakes.ts";
import { rawOf } from "#/infrastructure/message/gmail/rawMessage.ts";

const incoming = {
    message: "Notre boutique a besoin d'un thème plus rapide.",
    replyTo: "shop@brand.com",
    from: "Brand\r\nBcc: x@y.z",
    website: "",
    writingMs: 30_000,
};

function word(text: string): string {
    return `=?UTF-8?B?${btoa(String.fromCodePoint(...new TextEncoder().encode(text)))}?=`;
}

describe("the raw message for Gmail", () => {
    const raw = fromBase64Url(rawOf(mailOf(incoming, "dylan@example.dev")));
    const [head = "", body = ""] = raw.split("\r\n\r\n");

    it("is sent as and to the inbox, the visitor in Reply-To", () => {
        expect(head.split("\r\n")).toStrictEqual([
            `From: ${word("dylancastor.com")} <dylan@example.dev>`,
            "To: dylan@example.dev",
            `Reply-To: ${word("Brand Bcc: x@y.z")} <shop@brand.com>`,
            `Subject: ${word("A message from the site: Brand Bcc: x@y.z")}`,
            "MIME-Version: 1.0",
            "Content-Type: text/plain; charset=UTF-8",
            "Content-Transfer-Encoding: base64",
        ]);
    });

    it("carries the text in UTF-8, nothing lost", () => {
        expect(fromBase64Url(body.replaceAll("\r\n", ""))).toBe(
            "Notre boutique a besoin d'un thème plus rapide.\n\n—\nReply to: shop@brand.com\nFrom: Brand Bcc: x@y.z",
        );
    });

    it("never lets a visitor's line break start a header", () => {
        expect(head.includes("\nBcc:")).toBe(false);
    });
});
