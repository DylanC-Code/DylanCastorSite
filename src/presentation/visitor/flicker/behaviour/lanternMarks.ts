import { turnCrank } from "#/presentation/visitor/flicker/behaviour/lanternInvite.ts";
import {
    penEnding,
    penLeave,
    penTick,
} from "#/presentation/visitor/flicker/behaviour/lanternPen.ts";
import type { Plate } from "#/presentation/visitor/flicker/behaviour/lanternSession.ts";
import {
    markTabs,
    say,
} from "#/presentation/visitor/flicker/behaviour/lanternWords.ts";
import type {
    Lantern,
    Outcome,
} from "#/presentation/visitor/flicker/state/lanternState.ts";

function reduced(): boolean {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The plate's own marks of the state: which way the parts lean, the tabs. */
export function reflect(plate: Plate, lantern: Lantern): void {
    plate.root.toggleAttribute("data-shown", lantern.open);
    plate.root.toggleAttribute("data-slid", lantern.slideB);
    markTabs(plate.root, lantern);
}

/** The pen on the way: tick the step made, or fade when the way is left. */
function penStep(plate: Plate, before: Lantern, outcome: Outcome): void {
    if (outcome.leftWay) {
        penLeave(plate.pen);
    } else if (before.intent !== null) {
        penTick(plate.pen, outcome.lantern.moves.length);
    }
}

/** The pen's ending word, from the plate's data. */
function penWord(plate: Plate, flicker: boolean): string {
    return plate.root.dataset[flicker ? "penFlick" : "penClean"] ?? "";
}

/** At an ending the pen writes on the screen; the crank nudges 2.8s later. */
function penEnd(plate: Plate, outcome: Outcome): void {
    const flicker = outcome.caption === "flick";
    if (!flicker && outcome.caption !== "cleanEnd") {
        return;
    }
    const text = penWord(plate, flicker);
    penEnding(plate.end, { flicker, slideB: outcome.lantern.slideB, text });
    setTimeout(() => {
        turnCrank(plate.crank, "is-nudging");
    }, 2800);
}

/** Both ways done: the hand under the plate appears, 1.7s later, for good. */
function raiseCue(): void {
    const cue = document.querySelector<HTMLElement>("[data-cue]");
    setTimeout(
        () => {
            cue?.removeAttribute("hidden");
        },
        reduced() ? 0 : 1700,
    );
}

/** What a move leaves on the plate: the caption, the tabs, the pen, the hand. */
export function settle(plate: Plate, before: Lantern, outcome: Outcome): void {
    say(plate.root, outcome.caption, outcome.leftWay);
    reflect(plate, outcome.lantern);
    penStep(plate, before, outcome);
    penEnd(plate, outcome);
    if (outcome.bothDone) {
        raiseCue();
    }
}
