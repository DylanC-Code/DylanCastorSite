import {
    type KeyRun,
    keyRuns,
} from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";
import type { Versioned } from "#/presentation/visitor/shared/topic/viewmodels/Versioned.ts";

/**
 * The words of a topic page's data, as its parts take them: a title's two
 * parts, and a text with its **key phrases**, in the agency and brand versions
 * (one text serves both when the data has one).
 */
export function pair(words: readonly string[]): readonly [string, string] {
    const [first = "", second = ""] = words;
    return [first, second];
}

export function both(
    text: string | { agency: string; brand: string },
): Versioned<readonly KeyRun[]> {
    return typeof text === "string"
        ? { agency: keyRuns(text), brand: keyRuns(text) }
        : { agency: keyRuns(text.agency), brand: keyRuns(text.brand) };
}
