import { clockOf } from "#/presentation/visitor/check_test/behaviour/streetClock.ts";
import {
    type Later,
    showCount,
    type StreetParts,
    visitorFigure,
} from "#/presentation/visitor/check_test/behaviour/streetParts.ts";
import { signpostStop } from "#/presentation/visitor/check_test/behaviour/streetWalk.ts";
import { shopX } from "#/presentation/visitor/check_test/presenters/sheetGeometry.ts";
import type { PlateState } from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * Runs the street of one sheet: a visitor every 2.7s, the first after 0.6s,
 * while a fifth of the sheet is in view and the tab is visible. `restart` sends
 * the count back to zero (the end, "Start again"); `stop` clears every timer.
 * Reduced motion: two still figures, the counter at 005.
 */
export interface Street {
    readonly restart: () => void;
    readonly stop: () => void;
}

const every = 2700;
const firstAfter = 600;

function stillStreet(parts: StreetParts): Street {
    visitorFigure(parts, false, signpostStop);
    visitorFigure(parts, true, shopX + 60);
    showCount(parts, 5);
    return {
        restart: () => {
            showCount(parts, 5);
        },
        stop: () => {
            parts.walk.replaceChildren();
        },
    };
}

function watchView(sheet: Element): {
    visible: () => boolean;
    stop: () => void;
} {
    const memory = { inView: false };
    const watcher = new IntersectionObserver(
        ([entry]) => {
            memory.inView = entry?.isIntersecting ?? false;
        },
        { threshold: 0.2 },
    );
    watcher.observe(sheet);
    return {
        visible: () => memory.inView && !document.hidden,
        stop: () => {
            watcher.disconnect();
        },
    };
}

/** `later`, with every timer it sets cleared by `clear`. */
function timersOf(): { later: Later; clear: () => void } {
    const timers = new Set<number>();
    function later(ms: number, then: () => void): void {
        const id = window.setTimeout(() => {
            timers.delete(id);
            then();
        }, ms);
        timers.add(id);
    }
    return {
        later,
        clear: () => {
            timers.forEach((id) => {
                window.clearTimeout(id);
            });
        },
    };
}

export function runStreet(parts: StreetParts, plate: () => PlateState): Street {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return stillStreet(parts);
    }
    const timers = timersOf();
    const clock = clockOf(parts, plate, timers.later);
    const view = watchView(parts.sheet);
    function tick(): void {
        if (view.visible()) {
            clock.spawn();
        }
    }
    timers.later(firstAfter, tick);
    const beat = window.setInterval(tick, every);
    return {
        restart: clock.reset,
        stop: () => {
            window.clearInterval(beat);
            view.stop();
            timers.clear();
            parts.walk.replaceChildren();
        },
    };
}
