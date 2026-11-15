import { describe, expect, it } from "vitest";

import {
    liftStop,
    roomLeft,
    roomStop,
    walk,
} from "#/presentation/visitor/floor/state/visitorWalk.ts";

const curtainStops = [1, 2, 3].map((index) => roomStop(index, false));

describe("the visitor's walk", () => {
    it("stops behind the lantern in the lit room, 16px into a curtain", () => {
        expect(roomStop(0, true)).toBe(160);
        expect(curtainStops).toEqual([382, 622, 862]);
        expect(roomLeft(3)).toBe(846);
    });

    it("walks in whole strides, so his feet stop together", () => {
        expect(walk(liftStop, 862)).toMatchObject({
            strides: 6,
            duration: 2760,
        });
        expect(walk(160, 382).duration % 460).toBe(0);
    });

    it("takes at least one stride, however short the way", () => {
        expect(walk(liftStop, 160)).toMatchObject({
            strides: 1,
            duration: 460,
        });
    });

    it("faces the way he walks", () => {
        expect(walk(liftStop, 382).facingLeft).toBe(false);
        expect(walk(862, liftStop).facingLeft).toBe(true);
    });
});
