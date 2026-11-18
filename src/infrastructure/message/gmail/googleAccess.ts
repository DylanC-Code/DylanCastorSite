import { base64Url } from "#/infrastructure/message/gmail/rawMessage.ts";
import { SendFailure } from "#/infrastructure/message/gmail/sendFailure.ts";

/**
 * Signing in to Google as the site's service account, allowed (domain-wide
 * delegation, Gmail send scope only) to send as Dylan's inbox: a JSON Web Token
 * signed with the account's key (RS256, Web Crypto), traded for an access
 * token. The three values are Worker secrets, never in the repo.
 */
export interface GoogleAccount {
    readonly clientEmail: string;
    /** The service account's private key, PEM, as in its JSON key file. */
    readonly privateKey: string;
    /** Dylan's Workspace inbox: who the mail is sent as, and to. */
    readonly inbox: string;
}

const tokenUrl = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/gmail.send";
const utf8 = new TextEncoder();
const rs256 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as const;

function json64(value: object): string {
    return base64Url(utf8.encode(JSON.stringify(value)));
}

/** The key's bytes, its line breaks real or written `\n` as in a JSON file. */
function pemBytes(pem: string): Uint8Array<ArrayBuffer> {
    const body = pem
        .replaceAll(String.raw`\n`, "\n")
        .replaceAll(/-----[A-Z ]+-----/gu, "")
        .replaceAll(/\s/gu, "");
    return Uint8Array.from(atob(body), (char) => char.codePointAt(0) ?? 0);
}

async function signedToken(
    account: GoogleAccount,
    nowSeconds: number,
): Promise<string> {
    const head = json64({ alg: "RS256", typ: "JWT" });
    const claims = json64({
        iss: account.clientEmail,
        sub: account.inbox,
        scope,
        aud: tokenUrl,
        iat: nowSeconds,
        exp: nowSeconds + 3600,
    });
    const key = await crypto.subtle.importKey(
        "pkcs8",
        pemBytes(account.privateKey),
        rs256,
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign(
        rs256,
        key,
        utf8.encode(`${head}.${claims}`),
    );
    return `${head}.${claims}.${base64Url(new Uint8Array(signature))}`;
}

function tokenIn(body: unknown): string | null {
    const token =
        typeof body === "object" && body !== null
            ? new Map(Object.entries<unknown>({ ...body })).get("access_token")
            : undefined;
    return typeof token === "string" ? token : null;
}

/** An access token for sending, or a SendFailure("token", status). */
export async function accessTokenFor(
    account: GoogleAccount,
    nowSeconds: number,
): Promise<string> {
    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: await signedToken(account, nowSeconds),
        }),
    });
    const body: unknown = await response.json();
    const token = response.ok ? tokenIn(body) : null;
    if (token === null) {
        throw new SendFailure("token", response.status);
    }
    return token;
}
