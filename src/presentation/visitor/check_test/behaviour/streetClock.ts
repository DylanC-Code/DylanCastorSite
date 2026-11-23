import {
    forAWhile,
    type Later,
    showCount,
    type StreetParts,
    visitorFigure,
} from "#/presentation/visitor/check_test/behaviour/streetParts.ts";
import {
    pause,
    walk,
    walkTimes,
} from "#/presentation/visitor/check_test/behaviour/streetWalk.ts";
import type { PlateState } from "#/presentation/visitor/check_test/state/plateState.ts";
import {
    faultsOf,
    type Visit,
    visitOf,
} from "#/presentation/visitor/check_test/state/streetRules.ts";

/**
 * The street's own clock (HANDOFF.md, "What the street does"): each visitor
 * stops at the signpost while his board moves, his door opens 0.38s before him,
 * the counter turns as he goes in (twice through B before the end), and the red
 * pen marks a fault as it happens, until its ticket has been seen.
 */
export interface Clock {
    readonly spawn: () => void;
    readonly reset: () => void;
}

interface Street {
    readonly parts: StreetParts;
    readonly plate: () => PlateState;
    readonly later: Later;
    readonly countOne: () => void;
}

const penTime = 3200;

function pen(street: Street, mark: Element | null): void {
    forAWhile(mark, { name: "is-drawn", ms: penTime }, street.later);
}

function shows(street: Street, visit: Visit, fault: string): boolean {
    return faultsOf(visit, street.plate()).some((one) => one === fault);
}

function countIn(street: Street, visit: Visit): void {
    const { sheet } = street.parts;
    street.countOne();
    if (shows(street, visit, "off")) {
        pen(street, sheet.querySelector('[data-pen-mark="off"]'));
    }
    if (visit.counts === 2) {
        street.later(420, () => {
            street.countOne();
            if (shows(street, visit, "count")) {
                pen(street, sheet.querySelector('[data-pen-mark="count"]'));
            }
        });
    }
}

function goIn(street: Street, visit: Visit, figure: Element): void {
    const { stop, inAt } = walkTimes(visit.door);
    const { sheet } = street.parts;
    const board = sheet.querySelector(`[data-board="${visit.door}"]`);
    const door = sheet.querySelector(`[data-door="${visit.door}"]`);
    street.later(stop, () => {
        forAWhile(figure, { name: "is-stopped", ms: pause }, street.later);
        forAWhile(board, { name: "is-nudged", ms: pause }, street.later);
    });
    street.later(inAt - 380, () => {
        forAWhile(door, { name: "is-open", ms: 1000 }, street.later);
    });
    street.later(inAt, () => {
        countIn(street, visit);
    });
}

function spawnVisit(street: Street, visit: Visit): void {
    const figure = visitorFigure(street.parts, visit.beanie);
    walk(figure, visit.door).addEventListener("finish", () => {
        figure.remove();
    });
    if (shows(street, visit, "where")) {
        street.later(700, () => {
            pen(street, figure.querySelector("[data-beanie-mark]"));
        });
    }
    goIn(street, visit, figure);
}

export function clockOf(
    parts: StreetParts,
    plate: () => PlateState,
    later: Later,
): Clock {
    const memory = { count: 0, next: 0 };
    function countOne(): void {
        memory.count += 1;
        showCount(parts, memory.count);
    }
    const street: Street = { parts, plate, later, countOne };
    return {
        spawn: () => {
            spawnVisit(street, visitOf(memory.next, plate()));
            memory.next += 1;
        },
        reset: () => {
            memory.count = 0;
            memory.next = 0;
            showCount(parts, 0);
        },
    };
}
