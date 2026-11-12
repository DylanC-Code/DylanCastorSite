import type { LetterRunViewModel } from "#/presentation/visitor/brands/viewmodels/GuaranteeViewModel.ts";

/**
 * The guarantee's letter, split into runs: the phrases written between `[` and
 * `]` are marked (underlined in copper); the brackets are dropped.
 */
export function letterRuns(letter: string): LetterRunViewModel[] {
    return letter
        .split(/(\[[^\]]*\])/u)
        .filter((run) => run !== "")
        .map((run) =>
            run.startsWith("[") && run.endsWith("]")
                ? { text: run.slice(1, -1), marked: true }
                : { text: run, marked: false },
        );
}
