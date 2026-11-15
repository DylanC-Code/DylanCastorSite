import { describe, expect, it } from "vitest";

import {
    type Incoming,
    incomingOf,
    refusalOf,
} from "#/domain/message/incoming.ts";

const person: Incoming = {
    message: "A test to build on our client's product page.",
    replyTo: "studio@agency.com",
    from: "Studio",
    website: "",
    writingMs: 42_000,
};

describe("incomingOf", () => {
    it("reads a form's message, its name optional", () => {
        expect(
            incomingOf({ ...person, from: undefined, website: undefined }),
        ).toStrictEqual({ ...person, from: "", website: "" });
    });

    it("refuses what is not a message", () => {
        expect([
            incomingOf(null),
            incomingOf("hello"),
            incomingOf({ ...person, message: 3 }),
            incomingOf({ ...person, writingMs: "3000" }),
        ]).toStrictEqual([null, null, null, null]);
    });
});

describe("refusalOf, the robot checks", () => {
    it("lets a person's message through", () => {
        expect(refusalOf(person)).toBeNull();
    });

    it("refuses each thing a robot does", () => {
        expect([
            refusalOf({ ...person, website: "https://spam.example" }),
            refusalOf({ ...person, writingMs: 2999 }),
        ]).toStrictEqual(["trap filled", "too fast"]);
    });

    it("refuses an empty, an overlong or an unanswerable message", () => {
        expect([
            refusalOf({ ...person, message: "   " }),
            refusalOf({ ...person, message: "a".repeat(5001) }),
            refusalOf({ ...person, from: "a".repeat(201) }),
            refusalOf({ ...person, replyTo: "studio at agency" }),
        ]).toStrictEqual([
            "empty message",
            "too long",
            "too long",
            "no reply address",
        ]);
    });
});
