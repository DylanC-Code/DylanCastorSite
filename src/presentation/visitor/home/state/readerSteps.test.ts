import { describe, expect, it } from "vitest";

import {
    step,
    switchPause,
    turnBackPause,
} from "#/presentation/visitor/home/state/readerSteps.ts";

const closed = { open: null, page: 0 };
const atContents = { open: "agencies", page: 0 };
const turned = { open: "engineers", page: 2 };

describe("opening and closing", () => {
    it("opens a book on its contents, focus there", () => {
        expect(step(closed, { type: "pick", id: "agencies" })).toEqual({
            shelf: atContents,
            focus: { contents: "agencies" },
            followUp: null,
        });
    });

    it("closes from the contents and gives focus back to the cover", () => {
        expect(step(atContents, { type: "close" })).toEqual({
            shelf: closed,
            focus: { cover: "agencies" },
            followUp: null,
        });
    });

    it("turns the leaves back before closing from a later page", () => {
        expect(step(turned, { type: "close" })).toEqual({
            shelf: { open: "engineers", page: 0 },
            focus: null,
            followUp: { after: turnBackPause, event: { type: "close" } },
        });
    });

    it("closes this book, followUp opens the one picked", () => {
        expect(
            step(atContents, { type: "pick", id: "brands" }).followUp,
        ).toEqual({
            after: switchPause,
            event: { type: "pick", id: "brands" },
        });
    });
});

describe("turning pages", () => {
    it("turns forward up to the last page, never past it", () => {
        expect(step(atContents, { type: "next", lastPage: 1 }).shelf.page).toBe(
            1,
        );
        expect(
            step({ open: "agencies", page: 1 }, { type: "next", lastPage: 1 })
                .shelf.page,
        ).toBe(1);
    });

    it("turns back down to the contents, never before it", () => {
        expect(step(turned, { type: "prev" }).shelf.page).toBe(1);
        expect(step(atContents, { type: "prev" }).shelf.page).toBe(0);
    });

    it("turns nothing while every book is closed", () => {
        expect(step(closed, { type: "next", lastPage: 2 }).shelf).toEqual(
            closed,
        );
    });
});
