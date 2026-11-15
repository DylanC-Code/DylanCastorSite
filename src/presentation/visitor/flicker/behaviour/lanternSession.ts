import { stirUntilTouched } from "#/presentation/visitor/flicker/behaviour/lanternInvite.ts";
import {
    reflect,
    settle,
} from "#/presentation/visitor/flicker/behaviour/lanternMarks.ts";
import { penWay } from "#/presentation/visitor/flicker/behaviour/lanternPen.ts";
import {
    draw,
    type Pose,
    type Scene,
    tween,
} from "#/presentation/visitor/flicker/behaviour/lanternView.ts";
import { say } from "#/presentation/visitor/flicker/behaviour/lanternWords.ts";
import { dial } from "#/presentation/visitor/flicker/state/lanternDial.ts";
import {
    firstLantern,
    type Lantern,
    move,
    type Part,
    start,
    type Way,
} from "#/presentation/visitor/flicker/state/lanternState.ts";

export interface Plate {
    readonly root: HTMLElement;
    readonly scene: Scene;
    readonly pen: Element;
    readonly end: Element;
    readonly crank: Element;
}

export interface Session {
    readonly begin: (way: Way | null) => void;
    readonly act: (part: Part) => Promise<void>;
}

function poseOf(lantern: Lantern): Pose {
    return {
        open: Number(lantern.open),
        slide: Number(lantern.slideB),
        dial: dial(lantern.moves),
    };
}

/** Back to rest, with a way's loops or a clean plate. */
function restart(plate: Plate, lantern: Lantern, way: Way | null): void {
    draw(plate.scene, poseOf(lantern));
    plate.end.replaceChildren();
    if (way === null) {
        plate.pen.replaceChildren();
    } else {
        penWay(plate.pen, way);
    }
    say(plate.root, "hello", false);
    reflect(plate, lantern);
}

/**
 * The lantern's session on a plate: the state lives here, one move at a time
 * (750ms); the plate only shows it.
 */
export function sessionOf(plate: Plate): Session {
    const memory = { lantern: firstLantern, busy: false };
    const stopStir = stirUntilTouched(plate.root);
    function begin(way: Way | null): void {
        if (memory.busy) {
            return;
        }
        stopStir();
        memory.lantern = start(memory.lantern, way);
        restart(plate, memory.lantern, way);
    }
    function quiet(): void {
        stopStir();
        plate.end.replaceChildren();
    }
    async function act(part: Part): Promise<void> {
        if (memory.busy) {
            return;
        }
        memory.busy = true;
        quiet();
        const before = memory.lantern;
        const outcome = move(before, part);
        await tween(plate.scene, poseOf(before), poseOf(outcome.lantern));
        memory.lantern = outcome.lantern;
        memory.busy = false;
        settle(plate, before, outcome);
    }
    reflect(plate, memory.lantern);
    return { begin, act };
}
