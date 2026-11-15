import { pathFromAddress } from "#/presentation/visitor/shared/path_memory/behaviour/pathVia.ts";

/** The closing ask of the home the visitor came through, if any. */
function askOfPath(container: HTMLElement): string | undefined {
    const path = pathFromAddress();
    const marker = container.querySelector<HTMLElement>(
        `[data-ask-for="${CSS.escape(path ?? "")}"]`,
    );
    return marker?.dataset["href"];
}

/**
 * "Write to me" leads to the closing ask of the home the visitor came through
 * (its `data-ask-for` markers); without one it keeps its own link.
 */
export function pointAsk(container: HTMLElement): void {
    const href = askOfPath(container);
    if (href === undefined) {
        return;
    }
    for (const link of container.querySelectorAll("[data-ask-link]")) {
        link.setAttribute("href", href);
    }
}
