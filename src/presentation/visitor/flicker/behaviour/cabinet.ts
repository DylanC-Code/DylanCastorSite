/**
 * The details cabinet: one drawer open at a time; pulling it writes its note
 * under the cabinet, pulling it again closes it. Wakes the drawers (they are
 * disabled without script, when all five notes are shown).
 */
function openOnly(cabinet: HTMLElement, open: string | null): void {
    for (const drawer of cabinet.querySelectorAll<HTMLElement>(
        "[data-drawer]",
    )) {
        drawer.setAttribute(
            "aria-expanded",
            String(drawer.dataset["drawer"] === open),
        );
    }
    for (const note of cabinet.querySelectorAll<HTMLElement>("[data-note]")) {
        note.classList.toggle("is-open", note.dataset["note"] === open);
    }
    cabinet.toggleAttribute("data-one-open", open !== null);
}

export function initCabinet(cabinet: HTMLElement): void {
    for (const drawer of cabinet.querySelectorAll<HTMLButtonElement>(
        "[data-drawer]",
    )) {
        drawer.disabled = false;
        drawer.addEventListener("click", () => {
            const isOpen = drawer.getAttribute("aria-expanded") === "true";
            openOnly(
                cabinet,
                isOpen ? null : (drawer.dataset["drawer"] ?? null),
            );
        });
    }
    const { dataset } = cabinet;
    dataset["live"] = "";
}
