import { vi } from "vitest";

import type { GoogleAccount } from "#/infrastructure/message/gmail/googleAccess.ts";

/**
 * For the tests only: a service account with a key made on the spot, and a fake
 * Google answering the two calls (sign-in, send) with chosen statuses. Nothing
 * reaches the network.
 */
export interface FakeCall {
    readonly url: string;
    readonly body: string;
    readonly authorization: string | null;
}

export async function testAccount(): Promise<{
    account: GoogleAccount;
    publicKey: CryptoKey;
}> {
    const pair = await crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["sign", "verify"],
    );
    const pkcs8 = new Uint8Array(
        await crypto.subtle.exportKey("pkcs8", pair.privateKey),
    );
    const body = btoa(
        Array.from(pkcs8, (b) => String.fromCodePoint(b)).join(""),
    );
    const privateKey = `-----BEGIN PRIVATE KEY-----\\n${body}\\n-----END PRIVATE KEY-----\\n`;
    return {
        account: {
            clientEmail: "site@project.iam.gserviceaccount.com",
            privateKey,
            inbox: "dylan@example.dev",
        },
        publicKey: pair.publicKey,
    };
}

function answerFor(url: string, statuses: FakeStatuses): Response {
    return url.includes("oauth2")
        ? Response.json({ access_token: "token-1" }, { status: statuses.token })
        : new Response(null, { status: statuses.gmail });
}

interface FakeStatuses {
    readonly token: number;
    readonly gmail: number;
}

/** Replaces fetch with a fake Google; returns the calls it receives. */
export function fakeGoogle(statuses: FakeStatuses): FakeCall[] {
    const calls: FakeCall[] = [];
    vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
        const request = new Request(url, init);
        calls.push({
            url,
            body: await request.text(),
            authorization: request.headers.get("authorization"),
        });
        return answerFor(url, statuses);
    });
    return calls;
}

/** Base64url back to text, as Gmail and Google read it. */
export function fromBase64Url(value: string): string {
    return new TextDecoder().decode(bytesOf(value));
}

/** Base64url back to bytes: a JSON Web Token's signature. */
export function bytesOf(value: string): Uint8Array<ArrayBuffer> {
    const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
    return Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);
}

/** The JSON Web Token the sign-in call carried: head, claims, signature. */
export function tokenParts(call: FakeCall | undefined): string[] {
    const assertion = new URLSearchParams(call?.body).get("assertion") ?? "";
    return assertion.split(".");
}

function fieldsOf(text: string | undefined): ReadonlyMap<string, unknown> {
    const parsed: unknown = JSON.parse(text ?? "{}");
    return typeof parsed === "object" && parsed !== null
        ? new Map(Object.entries<unknown>({ ...parsed }))
        : new Map();
}

/** The fields of a JSON body, by name. */
export function jsonKeys(text: string | undefined): string[] {
    return [...fieldsOf(text).keys()];
}

/** The mail a Gmail send call carried, as text. */
export function sentMail(call: FakeCall | undefined): string {
    const raw = fieldsOf(call?.body).get("raw");
    return fromBase64Url(typeof raw === "string" ? raw : "");
}
