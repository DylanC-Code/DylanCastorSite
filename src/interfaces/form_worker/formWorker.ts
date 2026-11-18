import {
    type Incoming,
    incomingOf,
    refusalOf,
} from "#/domain/message/incoming.ts";
import { mailOf } from "#/infrastructure/message/gmail/gmailMail.ts";
import { sendWithGmail } from "#/infrastructure/message/gmail/gmailSend.ts";
import { SendFailure } from "#/infrastructure/message/gmail/sendFailure.ts";

/**
 * The one moving part outside Dylan's cluster: a Cloudflare Worker on
 * dylancastor.com/api/message. The forms post a message here; it passes the
 * robot checks, then goes to Dylan's own inbox only, through the Gmail API (his
 * Workspace; wrangler.jsonc at the repo's root). It answers 204 when sent; 400
 * for anything refused (not from the site, not a message, a robot), 429 over
 * the limit, 502 when Google does not send, with the failed step in
 * `x-send-failure`: the page shows its one failure sentence for any of them.
 * Nothing is stored, and nothing a visitor typed is logged.
 */
export interface Env {
    /** Secrets: the service account allowed to send as Dylan's inbox. */
    readonly GOOGLE_CLIENT_EMAIL: string;
    readonly GOOGLE_PRIVATE_KEY: string;
    /** Secret: Dylan's Workspace inbox, the one address mail goes to. */
    readonly INBOX: string;
    /** Cloudflare's rate limiter: 2 messages per minute per visitor. */
    readonly PER_VISITOR: {
        limit: (options: { key: string }) => Promise<{ success: boolean }>;
    };
    /** https://dylancastor.com: posts from any other page are refused. */
    readonly SITE: string;
}

function answer(status: number): Response {
    return new Response(null, { status });
}

async function bodyOf(request: Request): Promise<unknown> {
    const read = await request.text();
    if (read.length > 20_000) {
        return null;
    }
    try {
        const parsed: unknown = JSON.parse(read);
        return parsed;
    } catch {
        return null;
    }
}

/** Same site, a JSON POST: anything else never reaches the checks. */
function isFormPost(request: Request, env: Env): boolean {
    return (
        request.method === "POST"
        && request.headers.get("origin") === env.SITE
        && (request.headers.get("content-type") ?? "").startsWith(
            "application/json",
        )
    );
}

async function underLimit(request: Request, env: Env): Promise<boolean> {
    const visitor = request.headers.get("cf-connecting-ip") ?? "unknown";
    const { success } = await env.PER_VISITOR.limit({ key: visitor });
    return success;
}

/** The message, when it comes from the site's forms and passes the checks. */
async function acceptable(
    request: Request,
    env: Env,
): Promise<Incoming | null> {
    if (!isFormPost(request, env)) {
        return null;
    }
    const incoming = incomingOf(await bodyOf(request));
    return incoming !== null && refusalOf(incoming) === null ? incoming : null;
}

/** The failed step and Google's status ("token 401"), or "setup" (a bad key). */
function failureOf(error: unknown): string {
    return error instanceof SendFailure ? error.message : "setup";
}

async function send(incoming: Incoming, env: Env): Promise<Response> {
    const account = {
        clientEmail: env.GOOGLE_CLIENT_EMAIL,
        privateKey: env.GOOGLE_PRIVATE_KEY,
        inbox: env.INBOX,
    };
    try {
        const now = Math.floor(Date.now() / 1000);
        await sendWithGmail(mailOf(incoming, env.INBOX), account, now);
        return answer(204);
    } catch (error) {
        return new Response(null, {
            status: 502,
            headers: { "x-send-failure": failureOf(error) },
        });
    }
}

async function handle(request: Request, env: Env): Promise<Response> {
    const incoming = await acceptable(request, env);
    if (incoming === null) {
        return answer(400);
    }
    if (!(await underLimit(request, env))) {
        return answer(429);
    }
    return send(incoming, env);
}

// Cloudflare runs a Worker through its default export: the repo's one exception
// to "no default export" outside config files (.oxlintrc.json, 15 Nov 2026).
export default {
    fetch: handle,
};
