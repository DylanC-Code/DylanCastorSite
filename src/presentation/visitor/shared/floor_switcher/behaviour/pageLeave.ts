import type { PickPlan } from "#/presentation/visitor/shared/floor_switcher/state/switcherSteps.ts";

interface Leaving {
    root: HTMLElement;
    panel: HTMLElement;
}

interface Choice {
    link: HTMLAnchorElement;
    plan: Extract<PickPlan, { kind: "go" }>;
    event: MouseEvent;
}

/**
 * The pick sequence: the floor is marked at once, the panel closes and the
 * content leaves at `closeAt`, the browser goes at `navigateAt`. With reduced
 * motion the link is simply followed.
 */
export function leaveTowards(switcher: Leaving, choice: Choice): void {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }
    choice.event.preventDefault();
    choice.link.classList.add("is-chosen");
    const { dataset } = document.documentElement;
    dataset["leaving"] = choice.plan.direction;
    window.setTimeout(() => {
        closeAndLeave(switcher);
    }, Number(switcher.root.dataset["closeAt"]));
    window.setTimeout(() => {
        window.location.assign(choice.plan.href);
    }, Number(switcher.root.dataset["navigateAt"]));
}

function closeAndLeave(switcher: Leaving): void {
    const { dataset } = switcher.root;
    dataset["open"] = "false";
    switcher.panel.toggleAttribute("inert", true);
    document.querySelector("main")?.classList.add("is-leaving");
}

/** Only a pick plays the page transition; any other navigation is plain. */
export function skipUnlessLeaving(): void {
    window.addEventListener("pageswap", (event) => {
        if (document.documentElement.dataset["leaving"] === undefined) {
            event.viewTransition?.skipTransition();
        }
    });
}
