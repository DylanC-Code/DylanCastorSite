import {
    drawPlate,
    type PlateView,
} from "#/presentation/visitor/check_test/behaviour/plateView.ts";
import { streetPartsOf } from "#/presentation/visitor/check_test/behaviour/streetParts.ts";
import { runStreet } from "#/presentation/visitor/check_test/behaviour/streetRun.ts";
import { placeTicket } from "#/presentation/visitor/check_test/behaviour/ticketPlace.ts";
import {
    endIsDue,
    finish,
    type PlateState,
    startOfPlate,
} from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * One life of the plate in the sheet shown: its state, its street, and the end
 * that comes 0.9s after the sixth ticket is closed. Every change goes through
 * `apply`, which draws the plate and places the ticket; at the end the street
 * runs corrected from 000.
 */
export interface PlateSession {
    readonly view: PlateView;
    readonly state: () => PlateState;
    readonly apply: (change: (state: PlateState) => PlateState) => void;
    readonly startAgain: () => void;
    readonly stop: () => void;
}

const endPause = 900;

export function sessionOf(view: PlateView): PlateSession {
    const memory: { state: PlateState; endTimer?: number } = {
        state: startOfPlate,
    };
    const street = runStreet(streetPartsOf(view.sheet), () => memory.state);
    function apply(change: (state: PlateState) => PlateState): void {
        const before = memory.state;
        memory.state = change(before);
        window.clearTimeout(memory.endTimer);
        drawPlate(view, memory.state);
        placeTicket(view, memory.state.open);
        if (memory.state.done && !before.done) {
            street.restart();
        }
        if (endIsDue(memory.state)) {
            memory.endTimer = window.setTimeout(apply, endPause, finish);
        }
    }
    apply(() => startOfPlate);
    return {
        view,
        state: () => memory.state,
        apply,
        startAgain: () => {
            apply(() => startOfPlate);
            street.restart();
        },
        stop: () => {
            street.stop();
            window.clearTimeout(memory.endTimer);
        },
    };
}
