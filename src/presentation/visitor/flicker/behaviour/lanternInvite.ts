/**
 * How the plate invites the hand: the parts stir on arrival and every 9s until
 * the first move or tab; a clicked part does not lean again until the pointer
 * leaves it; the crank spins on a click and nudges after an ending; the price
 * note opens from "at a price" and closes outside it or on Escape.
 */
export function stirUntilTouched(plate: HTMLElement): () => void {
    const { dataset } = plate;
    dataset["idle"] = "stir";
    const timer = setInterval(() => {
        delete dataset["idle"];
        void plate.offsetWidth;
        dataset["idle"] = "stir";
    }, 9000);
    return function stop(): void {
        clearInterval(timer);
        delete dataset["idle"];
    };
}

export function holdAfterClick(parts: Iterable<Element>): void {
    for (const part of parts) {
        part.addEventListener("click", () => {
            part.classList.add("is-held");
        });
        part.addEventListener("pointerleave", () => {
            part.classList.remove("is-held");
        });
    }
}

/** Plays a one-time class on the crank ("is-spinning", "is-nudging"). */
export function turnCrank(crank: Element, motion: string): void {
    crank.classList.remove("is-spinning", "is-nudging");
    void crank.getBoundingClientRect();
    crank.classList.add(motion);
}

/** "at a price" opens or closes the note; a click elsewhere closes it. */
function toggleNote(note: HTMLElement, target: EventTarget | null): void {
    if (!(target instanceof Element)) {
        return;
    }
    const { hidden } = note;
    if (target.closest("[data-price-link]") !== null) {
        note.toggleAttribute("hidden", hidden !== true);
    } else if (target.closest("[data-price-note]") === null) {
        note.toggleAttribute("hidden", true);
    }
}

export function watchPriceNote(plate: HTMLElement): void {
    const note = plate.querySelector<HTMLElement>("[data-price-note]");
    if (note === null) {
        return;
    }
    document.addEventListener("click", (event) => {
        toggleNote(note, event.target);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            note.hidden = true;
        }
    });
}
