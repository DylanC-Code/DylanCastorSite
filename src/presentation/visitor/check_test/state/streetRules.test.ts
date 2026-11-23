import { describe, expect, it } from "vitest";

import {
    markIds,
    type PlateState,
    startOfPlate,
} from "#/presentation/visitor/check_test/state/plateState.ts";
import {
    faultsOf,
    visitOf,
} from "#/presentation/visitor/check_test/state/streetRules.ts";

const ended: PlateState = { ...startOfPlate, seen: [...markIds], done: true };
const first = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function visitsOf(plate: PlateState): ReturnType<typeof visitOf>[] {
    return first.map((index) => visitOf(index, plate));
}

function doors(plate: PlateState): string {
    return visitsOf(plate)
        .map((visit) => visit.door)
        .join("");
}

function countsOf(plate: PlateState): number[] {
    return visitsOf(plate).map((visit) => visit.counts);
}

function beanieVisitors(plate: PlateState): number[] {
    return first.filter((index) => visitOf(index, plate).beanie);
}

describe("the street before the end", () => {
    it("sends even visitors to A and odd ones to B, the beanie to B", () => {
        expect(doors(startOfPlate)).toBe("ABBBABBBABB");
    });

    it("puts the beanie on visitor 2, 6, 10", () => {
        expect(beanieVisitors(startOfPlate)).toStrictEqual([2, 6, 10]);
    });

    it("counts a visit through B twice", () => {
        expect([
            visitOf(0, startOfPlate).counts,
            visitOf(1, startOfPlate).counts,
        ]).toStrictEqual([1, 2]);
    });

    it("still sends visitors to B with the lever off", () => {
        expect(doors({ ...startOfPlate, leverOff: true })).toBe(
            doors(startOfPlate),
        );
    });
});

describe("the street after the end", () => {
    it("has no beanie and counts each visit once", () => {
        expect([
            beanieVisitors(ended),
            countsOf(ended),
            doors(ended),
        ]).toStrictEqual([
            [],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "ABABABABABA",
        ]);
    });

    it("sends everyone to A with the lever off", () => {
        expect(doors({ ...ended, leverOff: true })).toBe("AAAAAAAAAAA");
    });
});

describe("the red pen", () => {
    it("marks each fault as it happens", () => {
        const off = { ...startOfPlate, leverOff: true };
        expect([
            faultsOf(visitOf(0, off), off),
            faultsOf(visitOf(2, off), off),
        ]).toStrictEqual([[], ["count", "where", "off"]]);
    });

    it("stops for a fault whose ticket has been seen", () => {
        const seen: PlateState = { ...startOfPlate, seen: ["count"] };
        expect(faultsOf(visitOf(2, seen), seen)).toStrictEqual(["where"]);
    });

    it("stops at the end", () => {
        const off = { ...ended, leverOff: true };
        expect(faultsOf(visitOf(1, off), off)).toStrictEqual([]);
    });
});
