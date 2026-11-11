import { describe, expect, it } from "vitest";

import {
    openingFocus,
    planPick,
} from "#/presentation/visitor/shared/floor_switcher/state/switcherSteps.ts";

const order = [
    "/shopify-cro",
    "/development",
    "/architecture",
    "/infrastructure",
    "/low-level",
    "/how-i-build-software",
];

describe("planPick", () => {
    it("only closes the panel when the current floor is picked", () => {
        expect(planPick(order, "/development", "/development")).toEqual({
            kind: "close",
        });
    });

    it("goes deeper to a floor further down", () => {
        expect(planPick(order, "/development", "/infrastructure")).toEqual({
            kind: "go",
            href: "/infrastructure",
            direction: "deeper",
        });
    });

    it("goes higher to a floor further up", () => {
        expect(planPick(order, "/infrastructure", "/shopify-cro")).toEqual({
            kind: "go",
            href: "/shopify-cro",
            direction: "higher",
        });
    });

    it("goes deeper from a page that is no floor", () => {
        expect(planPick(order, null, "/shopify-cro")).toEqual({
            kind: "go",
            href: "/shopify-cro",
            direction: "deeper",
        });
    });
});

describe("openingFocus", () => {
    it("lands on the current floor", () => {
        expect(openingFocus(order, "/architecture")).toBe("/architecture");
    });

    it("lands on the first floor from a page that is no floor", () => {
        expect(openingFocus(order, null)).toBe("/shopify-cro");
    });
});
