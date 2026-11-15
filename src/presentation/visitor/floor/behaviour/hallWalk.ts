import {
    liftStop,
    roomStop,
    type Walk,
    walk,
} from "#/presentation/visitor/floor/state/visitorWalk.ts";

const desktop = "(min-width: 72.75rem)";
const travel = "cubic-bezier(.3,.05,.7,.95)";

function reduced(): boolean {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function modified(event: MouseEvent): boolean {
    return event.metaKey || event.ctrlKey || event.shiftKey;
}

/** A click the browser should handle itself: a new tab, reduced motion. */
function leftAlone(event: MouseEvent, isLink: boolean): boolean {
    return isLink && (modified(event) || reduced());
}

/** Where the visitor stands now, mid-walk included. */
function standingAt(visitor: HTMLElement): number {
    return new DOMMatrixReadOnly(getComputedStyle(visitor).transform).m41;
}

/** Turns him the way he walks, sets his strides, and his stop. */
function setOff(visitor: HTMLElement, plan: Walk): void {
    for (const running of visitor.getAnimations()) {
        running.cancel();
    }
    const { dataset, style, classList } = visitor;
    dataset["facing"] = plan.facingLeft ? "left" : "right";
    style.setProperty("--strides", String(plan.strides));
    style.setProperty("--x", `${plan.to}px`);
    classList.add("is-walking");
}

/**
 * Walks the visitor from where he stands to `to`, in whole strides. True once
 * he is there; false when another walk took over on the way.
 */
async function walkTo(visitor: HTMLElement, to: number): Promise<boolean> {
    const plan = walk(standingAt(visitor), to);
    setOff(visitor, plan);
    const steps = [
        { transform: `translateX(${plan.from}px)` },
        { transform: `translateX(${to}px)` },
    ];
    const moving = visitor.animate(steps, {
        duration: plan.duration,
        easing: travel,
    });
    const arrived = await moving.finished.then(
        () => true,
        () => false,
    );
    visitor.classList.toggle("is-walking", !arrived);
    return arrived;
}

/** Where a room's control sends the visitor. */
function stopFor(control: HTMLElement): number {
    const { dataset } = control;
    if (Object.hasOwn(dataset, "lift")) {
        return liftStop;
    }
    return roomStop(
        Number(dataset["index"] ?? 0),
        Object.hasOwn(dataset, "roomLink"),
    );
}

function onPick(
    visitor: HTMLElement,
    event: MouseEvent,
    control: HTMLElement,
): void {
    const isLink = control instanceof HTMLAnchorElement;
    if (!matchMedia(desktop).matches || leftAlone(event, isLink)) {
        return;
    }
    event.preventDefault();
    if (reduced()) {
        visitor.style.setProperty("--x", `${stopFor(control)}px`);
        return;
    }
    void walkTo(visitor, stopFor(control)).then((arrived) => {
        if (arrived && isLink) {
            location.assign(control.href);
        }
        return arrived;
    });
}

/**
 * Desktop: a click on a room walks the visitor there (the lit room's link is
 * followed when he arrives); a click on the lift walks him back. With reduced
 * motion he is placed at once and the link followed at once; below 1164px the
 * rooms are links and bands, and nobody walks.
 */
export function initHallWalk(floor: HTMLElement): void {
    const visitor = floor.querySelector<HTMLElement>("[data-visitor]");
    if (visitor === null) {
        return;
    }
    const controls = floor.querySelectorAll<HTMLElement>(
        "[data-room-link], [data-room-later], [data-lift]",
    );
    for (const control of controls) {
        control.addEventListener("click", (event) => {
            onPick(visitor, event, control);
        });
    }
}
