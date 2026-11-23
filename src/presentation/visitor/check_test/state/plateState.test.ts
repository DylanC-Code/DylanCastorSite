import { describe, expect, it } from "vitest";

import {
    closeTicket,
    endIsDue,
    finish,
    focusMark,
    hoverMark,
    leaveMark,
    markIds,
    type PlateState,
    pressMark,
    pullLever,
    seeCorrected,
    startOfPlate,
} from "#/presentation/visitor/check_test/state/plateState.ts";

const allSeen: PlateState = { ...startOfPlate, seen: [...markIds] };

describe("opening a mark", () => {
    it("makes it seen, once", () => {
        const twice = pressMark(
            closeTicket(pressMark(startOfPlate, "cart")),
            "cart",
        );
        expect([twice.seen, twice.open, twice.kept]).toStrictEqual([
            ["cart"],
            "cart",
            true,
        ]);
    });

    it("shows a ticket on hover and hides it when the pointer leaves", () => {
        const shown = hoverMark(startOfPlate, "count");
        expect([shown.open, shown.kept, leaveMark(shown).open]).toStrictEqual([
            "count",
            false,
            null,
        ]);
    });

    it("keeps a pressed ticket while the pointer passes other marks", () => {
        const kept = hoverMark(pressMark(startOfPlate, "phone"), "off");
        expect([kept.open, leaveMark(kept).open, kept.seen]).toStrictEqual([
            "phone",
            "phone",
            ["phone"],
        ]);
    });

    it("closes a kept ticket when its mark is pressed again", () => {
        const again = pressMark(pressMark(startOfPlate, "flick"), "flick");
        expect([again.open, again.kept]).toStrictEqual([null, false]);
    });

    it("keeps open a ticket that hover showed, when its mark is pressed", () => {
        const pressed = pressMark(hoverMark(startOfPlate, "where"), "where");
        expect([pressed.open, pressed.kept]).toStrictEqual(["where", true]);
    });

    it("keeps the ticket of a focused mark open", () => {
        expect(focusMark(startOfPlate, "off").kept).toBe(true);
    });
});

describe("the end", () => {
    it("is due only once the six are seen and the ticket is closed", () => {
        const five: PlateState = { ...startOfPlate, seen: markIds.slice(1) };
        expect([
            endIsDue(five),
            endIsDue({ ...allSeen, open: "off" }),
            endIsDue(allSeen),
        ]).toStrictEqual([false, false, true]);
    });

    it("does not come before", () => {
        const open = { ...allSeen, open: "off" as const, kept: true };
        expect([finish(open).done, finish(startOfPlate).done]).toStrictEqual([
            false,
            false,
        ]);
    });

    it("comes, the lever back on and no more ticket", () => {
        const ended = finish(pullLever(allSeen));
        expect([
            ended.done,
            ended.leverOff,
            pressMark(ended, "cart").open,
        ]).toStrictEqual([true, false, null]);
    });

    it("comes at once with See it corrected", () => {
        expect(seeCorrected({ ...allSeen, open: "off", kept: true }).done).toBe(
            true,
        );
    });

    it("still lets the lever be pulled", () => {
        expect(pullLever(finish(allSeen)).leverOff).toBe(true);
    });
});

describe("Start again", () => {
    it("empties everything", () => {
        expect(startOfPlate).toStrictEqual({
            seen: [],
            open: null,
            kept: false,
            done: false,
            leverOff: false,
        });
    });
});
