import { describe, expect, it } from "vitest";

import { step } from "#/presentation/visitor/home/state/readerSteps.ts";

describe("step", () => {
    it("opens a book and moves focus to its first page", () => {
        expect(step(null, { type: "pick", id: "agencies" })).toEqual({
            open: "agencies",
            focus: { page: "agencies" },
        });
    });

    it("closes on Escape or the back button and returns focus to the cover", () => {
        expect(step("agencies", { type: "close" })).toEqual({
            open: null,
            focus: { cover: "agencies" },
        });
    });

    it("closes when the open cover is clicked again", () => {
        expect(step("brands", { type: "pick", id: "brands" })).toEqual({
            open: null,
            focus: { cover: "brands" },
        });
    });

    it("switches straight to another book", () => {
        expect(step("agencies", { type: "pick", id: "engineers" })).toEqual({
            open: "engineers",
            focus: { page: "engineers" },
        });
    });

    it("leaves focus alone when nothing was open", () => {
        expect(step(null, { type: "close" })).toEqual({
            open: null,
            focus: null,
        });
    });
});
