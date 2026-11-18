import { afterEach, describe, expect, it, vi } from "vitest";

import { sendWithGmail } from "#/infrastructure/message/gmail/gmailSend.ts";
import {
    bytesOf,
    fakeGoogle,
    fromBase64Url,
    jsonKeys,
    testAccount,
    tokenParts,
} from "#/infrastructure/message/gmail/googleFakes.ts";

const mail = {
    from: { email: "dylan@example.dev", name: "dylancastor.com" },
    to: "dylan@example.dev",
    replyTo: { email: "shop@brand.com" },
    subject: "A message from the site: shop@brand.com",
    text: "Hello",
};

const now = 1_800_000_000;

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("signing in to Google", () => {
    it("asks for Gmail send only, as the service account for the inbox", async () => {
        const { account } = await testAccount();
        const calls = fakeGoogle({ token: 200, gmail: 200 });
        await sendWithGmail(mail, account, now);
        const [, claims = ""] = tokenParts(calls[0]);
        expect(JSON.parse(fromBase64Url(claims))).toStrictEqual({
            iss: "site@project.iam.gserviceaccount.com",
            sub: "dylan@example.dev",
            scope: "https://www.googleapis.com/auth/gmail.send",
            aud: "https://oauth2.googleapis.com/token",
            iat: now,
            exp: now + 3600,
        });
    });

    it("signs the token with the account's key", async () => {
        const { account, publicKey } = await testAccount();
        const calls = fakeGoogle({ token: 200, gmail: 200 });
        await sendWithGmail(mail, account, now);
        const [head = "", claims = "", signature = ""] = tokenParts(calls[0]);
        const valid = await crypto.subtle.verify(
            "RSASSA-PKCS1-v1_5",
            publicKey,
            bytesOf(signature),
            new TextEncoder().encode(`${head}.${claims}`),
        );
        expect(valid).toBe(true);
    });
});

describe("sending with Gmail", () => {
    it("sends the raw mail with the access token", async () => {
        const { account } = await testAccount();
        const calls = fakeGoogle({ token: 200, gmail: 200 });
        await sendWithGmail(mail, account, now);
        const [, send] = calls;
        expect([
            send?.url,
            send?.authorization,
            jsonKeys(send?.body),
        ]).toStrictEqual([
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            "Bearer token-1",
            ["raw"],
        ]);
    });

    it("names the step Google refused", async () => {
        const { account } = await testAccount();
        fakeGoogle({ token: 401, gmail: 200 });
        await expect(sendWithGmail(mail, account, now)).rejects.toThrow(
            "token 401",
        );
        fakeGoogle({ token: 200, gmail: 403 });
        await expect(sendWithGmail(mail, account, now)).rejects.toThrow(
            "gmail 403",
        );
    });
});
