import { describe, expect, it } from "vitest";

import type { Mail } from "#/infrastructure/message/cloudflare_email/cloudflareMail.ts";
import worker, { type Env } from "#/interfaces/form_worker/formWorker.ts";

const site = "https://dylancastor.com";

const person = {
    message: "Our store needs a faster theme.\nCan you look?",
    replyTo: "shop@brand.com",
    from: "Brand\r\nBcc: x@y.z",
    website: "",
    writingMs: 30_000,
};

/** A Worker environment whose binding keeps what it was asked to send. */
function envWith(allowed: boolean, failing = false): Env & { sent: Mail[] } {
    const sent: Mail[] = [];
    return {
        sent,
        SENDER: "forms@dylancastor.com",
        SITE: site,
        PER_VISITOR: { limit: () => Promise.resolve({ success: allowed }) },
        MAIL: {
            send: (mail) => {
                sent.push(mail);
                return failing
                    ? Promise.reject(new Error("E_RECIPIENT_NOT_ALLOWED"))
                    : Promise.resolve({ messageId: "1" });
            },
        },
    };
}

function post(body: unknown, origin = site): Request {
    return new Request(`${site}/api/message`, {
        method: "POST",
        headers: { origin, "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("the form Worker", () => {
    it("sends a person's message to Dylan, the visitor in Reply-To", async () => {
        const env = envWith(true);
        const response = await worker.fetch(post(person), env);
        expect(response.status).toBe(204);
        expect(env.sent).toStrictEqual([
            {
                from: {
                    email: "forms@dylancastor.com",
                    name: "dylancastor.com",
                },
                replyTo: { email: "shop@brand.com", name: "Brand Bcc: x@y.z" },
                subject: "A message from the site: Brand Bcc: x@y.z",
                text: "Our store needs a faster theme.\nCan you look?\n\n—\nReply to: shop@brand.com\nFrom: Brand Bcc: x@y.z",
            },
        ]);
    });

    it("refuses a robot, another site and a visitor over the limit", async () => {
        const env = envWith(true);
        const statuses = [
            (await worker.fetch(post({ ...person, website: "x" }), env)).status,
            (await worker.fetch(post({ ...person, writingMs: 500 }), env))
                .status,
            (await worker.fetch(post(person, "https://evil.example"), env))
                .status,
            (await worker.fetch(post(person), envWith(false))).status,
        ];
        expect([statuses, env.sent]).toStrictEqual([[400, 400, 400, 429], []]);
    });

    it("says it failed when Cloudflare refuses to send", async () => {
        const response = await worker.fetch(post(person), envWith(true, true));
        expect(response.status).toBe(502);
    });
});
