/**
 * Groups marked `data-reveal` play their entrance once, at 25% in view, with
 * one observer for the page. Text paints first: only groups still below the
 * fold are set to "pending", and nothing is hidden when the visitor prefers
 * reduced motion.
 */
export function initReveal(doc: Document): void {
    const view = doc.defaultView;
    if (!motionAllowed(view)) {
        return;
    }
    const observer = new IntersectionObserver(markSeen, { threshold: 0.25 });
    for (const group of doc.querySelectorAll<HTMLElement>("[data-reveal]")) {
        if (isBelowFold(group.getBoundingClientRect().top, view.innerHeight)) {
            group.dataset["reveal"] = "pending";
            observer.observe(group);
        }
    }
}

/** True when a group starts under the first screen. */
function isBelowFold(top: number, viewportHeight: number): boolean {
    return top >= viewportHeight;
}

function motionAllowed(view: Window | null): view is Window {
    return (
        view !== null
        && "IntersectionObserver" in view
        && !view.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

function markSeen(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
): void {
    for (const entry of entries.filter(
        (candidate) => candidate.isIntersecting,
    )) {
        if (entry.target instanceof HTMLElement) {
            const { dataset } = entry.target;
            dataset["reveal"] = "seen";
        }
        observer.unobserve(entry.target);
    }
}
