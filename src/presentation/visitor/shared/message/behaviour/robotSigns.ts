/**
 * What the form Worker checks to tell a person from a robot: the hidden trap
 * field (a person never fills it) and the time between the visitor's first
 * touch of the form and sending (a person takes more than 3 seconds).
 */
export interface RobotSigns {
    readonly website: string;
    readonly writingMs: number;
}

/** Starts watching a form; the returned function reads its signs at sending. */
export function watchForm(form: HTMLFormElement): () => RobotSigns {
    let firstTouch: number | null = null;
    form.addEventListener("focusin", () => {
        firstTouch ??= performance.now();
    });
    return () => {
        const trap = form.elements.namedItem("website");
        return {
            website: trap instanceof HTMLInputElement ? trap.value : "",
            writingMs:
                firstTouch === null
                    ? 0
                    : Math.round(performance.now() - firstTouch),
        };
    };
}
