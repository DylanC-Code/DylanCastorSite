import { describe, expect, it } from "vitest";

import { dial } from "#/presentation/visitor/flicker/state/lanternDial.ts";
import {
    firstLantern,
    type Lantern,
    move,
    type Outcome,
    type Part,
    start,
} from "#/presentation/visitor/flicker/state/lanternState.ts";

/** Plays moves one after the other; returns every outcome. */
function play(from: Lantern, parts: readonly Part[]): Outcome[] {
    const outcomes: Outcome[] = [];
    let lantern = from;
    for (const part of parts) {
        const outcome = move(lantern, part);
        outcomes.push(outcome);
        lantern = outcome.lantern;
    }
    return outcomes;
}

function lastOf(outcomes: readonly Outcome[]): Lantern {
    const last = outcomes.at(-1);
    if (last === undefined) {
        throw new Error("no move played");
    }
    return last.lantern;
}

function captions(outcomes: readonly Outcome[]): string[] {
    return outcomes.map((outcome) => outcome.caption);
}

function leftWays(outcomes: readonly Outcome[]): boolean[] {
    return outcomes.map((outcome) => outcome.leftWay);
}

function cues(outcomes: readonly Outcome[]): boolean[] {
    return outcomes.map((outcome) => outcome.bothDone);
}

const usual = play(start(firstLantern, "usual"), ["open", "slide"]);
const clean = play(start(firstLantern, "clean"), ["slide", "open"]);
const wrong = play(start(firstLantern, "clean"), ["open"]);
const restarted = start(lastOf(usual), "clean");
const cleanAfterUsual = play(start(lastOf(usual), null), [
    "slide",
    "open",
    "slide",
    "open",
]);

describe("the lantern's two ways", () => {
    it("the usual way: the original page, then the flicker", () => {
        expect(captions(usual)).toEqual(["openA", "flick"]);
        expect(lastOf(usual).done.usual).toBe(true);
    });

    it("without flicker: nothing shown, then only the tested version", () => {
        expect(captions(clean)).toEqual(["slideDarkB", "cleanEnd"]);
        expect(lastOf(clean).done.clean).toBe(true);
    });

    it("a wrong move leaves the way and keeps the move", () => {
        expect(captions(wrong)).toEqual(["openA"]);
        expect(leftWays(wrong)).toEqual([true]);
        expect(lastOf(wrong)).toMatchObject({
            open: true,
            intent: null,
            left: "clean",
        });
    });

    it("keeps the ways done through a restart", () => {
        expect(restarted).toMatchObject({
            open: false,
            slideB: false,
            moves: [],
            intent: "clean",
        });
        expect(restarted.done.usual).toBe(true);
    });
});

describe("the price, on the dial", () => {
    it("stops at one quarter the usual way, at two without flicker", () => {
        expect(dial(["open", "slide"])).toBe(1);
        expect(dial(["slide", "open"])).toBe(2);
    });
});

describe("the hand under the plate", () => {
    it("is raised once, when both ways are done", () => {
        expect(cues(usual)).toEqual([false, false]);
        expect(cues(cleanAfterUsual)).toEqual([false, true, false, false]);
    });
});
