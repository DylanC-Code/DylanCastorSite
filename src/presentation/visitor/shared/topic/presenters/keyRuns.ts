/** A run of a text; `key` runs are the key phrases (medium weight, in ink). */
export interface KeyRun {
    readonly text: string;
    readonly key: boolean;
}

/**
 * A text split into runs: the phrases written between double stars are key
 * phrases; the stars are dropped.
 */
export function keyRuns(text: string): KeyRun[] {
    return text
        .split(/(\*\*[^*]+\*\*)/u)
        .filter((run) => run !== "")
        .map((run) =>
            run.startsWith("**") && run.endsWith("**")
                ? { text: run.slice(2, -2), key: true }
                : { text: run, key: false },
        );
}
