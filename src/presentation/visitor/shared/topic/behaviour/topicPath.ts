import {
    cameFromAgencies,
    pointAsk,
} from "#/presentation/visitor/shared/path_memory/behaviour/askLinks.ts";
import { passPathOn } from "#/presentation/visitor/shared/path_memory/behaviour/pathVia.ts";

/** The agency wording, put in place for a visitor from the agencies home. */
function useAgencyWording(page: HTMLElement): void {
    if (!cameFromAgencies()) {
        return;
    }
    for (const text of page.querySelectorAll("[data-versioned]")) {
        const template = text.querySelector("template");
        if (template !== null) {
            text.replaceChildren(template.content.cloneNode(true));
        }
    }
}

/** A topic page and the visitor's path: passed on, its wording, its ask. */
export function followPath(page: HTMLElement): void {
    passPathOn(document);
    useAgencyWording(page);
    pointAsk(page);
}
