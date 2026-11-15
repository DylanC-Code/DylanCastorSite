/** A run of a legal text: plain, a key phrase (**), or in italic (*). */
export interface LegalRun {
    readonly text: string;
    readonly mark: "plain" | "key" | "italic";
}

/** The marks, longest first so "**" is not read as two "*". */
const marks = [
    { open: "**", mark: "key" },
    { open: "*", mark: "italic" },
] as const;

function isWrapped(part: string, open: string): boolean {
    return (
        part.length > open.length * 2
        && part.startsWith(open)
        && part.endsWith(open)
    );
}

function runOf(part: string): LegalRun {
    const found = marks.find((candidate) => isWrapped(part, candidate.open));
    return found === undefined
        ? { text: part, mark: "plain" }
        : {
              text: part.slice(found.open.length, -found.open.length),
              mark: found.mark,
          };
}

/**
 * A paragraph of the legal notice, split into runs: **double stars** mark a key
 * phrase, _single stars_ an italic one; the stars are dropped.
 */
export function legalRuns(text: string): LegalRun[] {
    return text
        .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/u)
        .filter((part) => part !== "")
        .map((part) => runOf(part));
}
