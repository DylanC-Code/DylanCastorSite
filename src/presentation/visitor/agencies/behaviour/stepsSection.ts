import {
    firstSeen,
    watchOnScreen,
} from "#/presentation/visitor/agencies/behaviour/stepVisuals.ts";
import {
    stepScroll,
    type StepScroll,
    type StepTops,
} from "#/presentation/visitor/agencies/state/stepScroll.ts";

interface Steps {
    section: HTMLElement;
    list: HTMLElement;
    steps: HTMLElement[];
    stations: HTMLElement[];
    /** The stuck ticket: the steps run under its bottom edge. */
    band: HTMLElement;
    /** The sticky header the ticket sticks under (60px, 84px from 768px). */
    header: HTMLElement;
}

/**
 * The steps section: one passive scroll listener, throttled to a frame, turns
 * the scroll into the current step, the ticket's progress, its tear and its
 * end. The step blocks are measured, so a taller step on a phone still counts.
 */
export function initSteps(section: HTMLElement): void {
    const list = section.querySelector<HTMLElement>("[data-steps-list]");
    const band = section.querySelector<HTMLElement>("[data-ticket]");
    const header = document.querySelector<HTMLElement>("body > header");
    if (list === null || band === null || header === null) {
        return;
    }
    const steps: Steps = {
        section,
        list,
        steps: [...list.querySelectorAll<HTMLElement>("[data-step]")],
        stations: [...section.querySelectorAll<HTMLElement>("[data-station]")],
        band,
        header,
    };
    const { dataset } = section;
    dataset["live"] = "";
    bindSteps(steps);
    update(steps);
}

/** Runs `work` at most once a frame, however often it is asked for. */
function oncePerFrame(work: () => void): () => void {
    let queued = false;
    return function ask(): void {
        if (!queued) {
            queued = true;
            window.requestAnimationFrame(() => {
                queued = false;
                work();
            });
        }
    };
}

function bindSteps(steps: Steps): void {
    const onScroll = oncePerFrame(() => {
        update(steps);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
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

/**
 * Under the header and the ticket at its height now, so y holds through the
 * fold.
 */
function ranUnder(steps: Steps): number {
    const under = steps.header.offsetHeight + steps.band.offsetHeight;
    return under - steps.list.getBoundingClientRect().top;
}

/** Where each step block starts, from the first. */
function tops(steps: Steps): StepTops {
    const first = steps.steps[0]?.offsetTop ?? 0;
    return steps.steps.map((step) => step.offsetTop - first);
}

/** The stub is cut 70px before the last block on desktop, 80px on a phone. */
function endBefore(): number {
    return window.matchMedia("(min-width: 48rem)").matches ? 70 : 80;
}

function goTo(steps: Steps, index: number): void {
    const top = tops(steps)[index] ?? 0;
    window.scrollBy({ top: top - ranUnder(steps), behavior: "smooth" });
}

function update(steps: Steps): void {
    const now = stepScroll(ranUnder(steps), tops(steps), endBefore());
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
