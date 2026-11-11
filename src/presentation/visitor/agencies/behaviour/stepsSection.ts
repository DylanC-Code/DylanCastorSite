import {
    firstSeen,
    watchOnScreen,
} from "#/presentation/visitor/agencies/behaviour/stepVisuals.ts";
import {
    stepHeight,
    stepScroll,
    type StepScroll,
} from "#/presentation/visitor/agencies/state/stepScroll.ts";

interface Steps {
    section: HTMLElement;
    list: HTMLElement;
    steps: HTMLElement[];
    stations: HTMLElement[];
    /** The stuck ticket: the steps run under its bottom edge. */
    band: HTMLElement;
}

/**
 * The steps section from 768px: one passive scroll listener, throttled to a
 * frame, turns the scroll into the current step, the ticket's progress, its
 * tear and its end. Below 768px the steps stay a plain list.
 */
export function initSteps(section: HTMLElement): void {
    const list = section.querySelector<HTMLElement>("[data-steps-list]");
    const band = section.querySelector<HTMLElement>("[data-ticket]");
    if (
        list === null
        || band === null
        || !window.matchMedia("(min-width: 48rem)").matches
    ) {
        return;
    }
    const steps: Steps = {
        section,
        list,
        steps: [...list.querySelectorAll<HTMLElement>("[data-step]")],
        stations: [...section.querySelectorAll<HTMLElement>("[data-station]")],
        band,
    };
    const { dataset } = section;
    dataset["live"] = "";
    bindSteps(steps);
    update(steps);
}

function bindSteps(steps: Steps): void {
    let queued = false;
    window.addEventListener(
        "scroll",
        () => {
            if (!queued) {
                queued = true;
                window.requestAnimationFrame(() => {
                    queued = false;
                    update(steps);
                });
            }
        },
        { passive: true },
    );
    steps.stations.forEach((station, index) => {
        station.addEventListener("click", () => {
            goTo(steps, index);
        });
    });
    const tab = steps.section.querySelector<HTMLElement>("[data-ticket-tab]");
    tab?.removeAttribute("hidden");
    tab?.addEventListener("click", () => {
        goTo(steps, 0);
    });
    watchOnScreen(steps.steps);
}

function ranUnder(steps: Steps): number {
    // Under the header (84px) and the ticket at its height now: the fold
    // shrinks both together, so y holds still through it.
    return (
        84 + steps.band.offsetHeight - steps.list.getBoundingClientRect().top
    );
}

function goTo(steps: Steps, index: number): void {
    window.scrollBy({
        top: index * stepHeight - ranUnder(steps),
        behavior: "smooth",
    });
}

function update(steps: Steps): void {
    const now = stepScroll(ranUnder(steps));
    steps.section.style.setProperty("--progress", String(now.progress));
    mark(steps.section, "torn", now.torn);
    mark(steps.section, "ended", now.ended);
    steps.steps.forEach((step, index) => {
        updateStep(step, index, now);
    });
    steps.stations.forEach((station, index) => {
        station.classList.toggle("is-reached", index <= now.current);
        station.toggleAttribute("aria-current", index === now.current);
        if (index === now.current) {
            station.setAttribute("aria-current", "step");
        }
    });
}

/** Sets a one-time event: "true" past its threshold, "back" once undone. */
function mark(section: HTMLElement, name: "torn" | "ended", on: boolean): void {
    const { dataset } = section;
    if (on) {
        dataset[name] = "true";
    } else if (dataset[name] === "true") {
        dataset[name] = "back";
    }
}

function updateStep(step: HTMLElement, index: number, now: StepScroll): void {
    const isCurrent = index === now.current;
    step.classList.toggle("is-current", isCurrent);
    const { dataset } = step;
    if (isCurrent && !Object.hasOwn(dataset, "seen")) {
        dataset["seen"] = "";
        firstSeen(step);
    }
}
