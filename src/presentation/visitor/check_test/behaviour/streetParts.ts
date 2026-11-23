/**
 * The street's parts in one sheet, and the small things they do: the counter
 * turns its digits, a board moves, a door opens, the red pen draws a mark. Each
 * motion is a class put back after its time.
 */
export interface StreetParts {
    readonly sheet: SVGSVGElement;
    readonly walk: Element;
    readonly gent: Element;
    readonly beanie: Element;
    readonly dial: Element;
}

/** Waits `ms`, then does `then`; cleared when the street stops. */
export type Later = (ms: number, then: () => void) => void;

function partOf(sheet: SVGSVGElement, selector: string): Element {
    const part = sheet.querySelector(selector);
    if (part === null) {
        throw new Error(`The check sheet has no ${selector}`);
    }
    return part;
}

export function streetPartsOf(sheet: SVGSVGElement): StreetParts {
    return {
        sheet,
        walk: partOf(sheet, "[data-walk]"),
        gent: partOf(sheet, 'defs [data-walker="gent"]'),
        beanie: partOf(sheet, 'defs [data-walker="beanie"]'),
        dial: partOf(sheet, "[data-dial]"),
    };
}

/** Plays a class's animation again from its start. */
function replay(element: Element, name: string): void {
    element.classList.remove(name);
    element.getBoundingClientRect();
    element.classList.add(name);
}

/** The counter shows `count` (three digits); a changed digit rises in. */
export function showCount(parts: StreetParts, count: number): void {
    const digits = String(count % 1000).padStart(3, "0");
    replay(parts.dial, "is-knocked");
    parts.dial.querySelectorAll("[data-digit]").forEach((digit, index) => {
        const next = digits.charAt(index);
        if (digit.textContent !== next) {
            digit.replaceChildren(next);
            replay(digit, "is-turned");
        }
    });
}

/** A class on `element` for a while, then gone. */
export function forAWhile(
    element: Element | null,
    motion: { readonly name: string; readonly ms: number },
    later: Later,
): void {
    if (element === null) {
        return;
    }
    replay(element, motion.name);
    later(motion.ms, () => {
        element.classList.remove(motion.name);
    });
}

/** A new visitor, cloned from the sheet's figures; a still one stands at x. */
export function visitorFigure(
    parts: StreetParts,
    beanie: boolean,
    x?: number,
): Element {
    const figure = (beanie ? parts.beanie : parts.gent).cloneNode(true);
    const visitor =
        figure instanceof Element ? figure : document.createElement("g");
    if (x !== undefined) {
        visitor.classList.add("is-still");
        visitor.setAttribute("transform", `translate(${x} 0)`);
    }
    parts.walk.append(visitor);
    return visitor;
}
