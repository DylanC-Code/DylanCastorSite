import { describe, expect, it } from "vitest";

import {
    jump,
    nearestToMiddle,
} from "#/presentation/visitor/floor/state/phoneRooms.ts";

describe("the room open on a phone", () => {
    it("is the one whose middle is nearest the screen's", () => {
        const spans = [
            { top: -300, bottom: 120 },
            { top: 150, bottom: 570 },
        ];
        expect(nearestToMiddle(spans, 844)).toBe(1);
        expect(nearestToMiddle([{ top: 40, bottom: 460 }], 844)).toBe(0);
    });
});

describe("the visitor's jump", () => {
    it("goes down in 760ms, up in 700ms, 260ms after the curtains", () => {
        expect(jump(0, 1)).toEqual({
            direction: "down",
            duration: 760,
            delay: 260,
        });
        expect(jump(1, 0)).toEqual({
            direction: "up",
            duration: 700,
            delay: 260,
        });
    });
});
