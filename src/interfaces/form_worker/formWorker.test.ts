import { afterEach, describe, expect, it, vi } from "vitest";

import {
    fakeGoogle,
    sentMail,
    testAccount,
} from "#/infrastructure/message/gmail/googleFakes.ts";
import worker, { type Env } from "#/interfaces/form_worker/formWorker.ts";

const site = "https://dylancastor.com";

const person = {
    message: "Our store needs a faster theme.\nCan you look?",
    replyTo: "shop@brand.com",
    from: "Brand\r\nBcc: x@y.z",
    website: "",
    writingMs: 30_000,
};

/** A Worker environment: a test service account, a limiter that says yes or no. */
async function envWith(allowed: boolean): Promise<Env> {
    const { account } = await testAccount();
    return {
        SITE: site,
        GOOGLE_CLIENT_EMAIL: account.clientEmail,
        GOOGLE_PRIVATE_KEY: account.privateKey,
        INBOX: account.inbox,
        PER_VISITOR: { limit: () => Promise.resolve({ success: allowed }) },
    };
}

function post(body: unknown, origin = site): Request {
    return new Request(`${site}/api/message`, {
        method: "POST",
        headers: { origin, "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("the form Worker", () => {
    it("sends a person's message to Dylan, the visitor in Reply-To", async () => {
        const calls = fakeGoogle({ token: 200, gmail: 200 });
        const response = await worker.fetch(post(person), await envWith(true));
        const mail = sentMail(calls[1]);
        expect([
            response.status,
            mail.includes("To: dylan@example.dev\r\n"),
            mail.includes("<shop@brand.com>\r\n"),
        ]).toStrictEqual([204, true, true]);
    });

    it("refuses a robot, another site and a visitor over the limit", async () => {
        const calls = fakeGoogle({ token: 200, gmail: 200 });
        const env = await envWith(true);
        const statuses = [
            (await worker.fetch(post({ ...person, website: "x" }), env)).status,
            (await worker.fetch(post({ ...person, writingMs: 500 }), env))
                .status,
            (await worker.fetch(post(person, "https://evil.example"), env))
                .status,
            (await worker.fetch(post(person), await envWith(false))).status,
        ];
        expect([statuses, calls]).toStrictEqual([[400, 400, 400, 429], []]);
    });

    it("says it failed when Google refuses, and which step", async () => {
        fakeGoogle({ token: 401, gmail: 200 });
        const response = await worker.fetch(post(person), await envWith(true));
        expect([
            response.status,
            response.headers.get("x-send-failure"),
        ]).toStrictEqual([502, "token 401"]);
    });

    it("says setup when the key cannot be read", async () => {
        fakeGoogle({ token: 200, gmail: 200 });
        const env = { ...(await envWith(true)), GOOGLE_PRIVATE_KEY: "nope" };
        const response = await worker.fetch(post(person), env);
        expect(response.headers.get("x-send-failure")).toBe("setup");
    });
});
