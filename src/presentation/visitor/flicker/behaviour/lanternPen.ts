import {
    type Part,
    type Way,
    ways,
} from "#/presentation/visitor/flicker/state/lanternState.ts";
import {
    loop,
    oval,
} from "#/presentation/visitor/shared/topic/presenters/penPaths.ts";

/** Where each part's handle is, in the scene's units. */
const handles: Readonly<Record<Part, readonly [number, number]>> = {
    open: [324, 220],
    slide: [249, 139],
};
const svgNs = "http://www.w3.org/2000/svg";

function shape(
    tag: string,
    attributes: Readonly<Record<string, string>>,
): SVGElement {
    const element = document.createElementNS(svgNs, tag);
    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
    return element;
}

function stroke(d: string, order: number, extra = ""): SVGElement {
    return shape("path", {
        class: `pen-line ${extra}`,
        d,
        pathLength: "1",
        style: `--d: ${order}`,
    });
}

function word(
    text: string,
    at: readonly [number, number],
    order: number,
): SVGElement {
    const element = shape("text", {
        class: "pen-word",
        x: String(at[0]),
        y: String(at[1]),
        style: `--d: ${order}`,
    });
    element.textContent = text;
    return element;
}

/** The pen loops each move of the way and numbers it: 1, then 2. */
export function penWay(layer: Element, way: Way): void {
    layer.classList.remove("is-leaving");
    layer.replaceChildren(
        ...ways[way].map((part, index) => {
            const [x, y] = handles[part];
            const number: readonly [number, number] = [
                x + 25,
                y + (part === "open" ? 15 : -7),
            ];
            const step = shape("g", { "data-step": String(index) });
            const tick = `M${number[0] - 7} ${number[1] - 8}l5 7l10 -15`;
            step.append(
                stroke(loop(x, y, 13), index * 2),
                word(String(index + 1), number, index * 2 + 1),
                stroke(tick, 0, "pen-tick"),
            );
            return step;
        }),
    );
}

/** A move of the way is made: its number becomes a tick, then fades. */
export function penTick(layer: Element, steps: number): void {
    for (const step of layer.querySelectorAll<SVGElement>("[data-step]")) {
        step.toggleAttribute(
            "data-done-step",
            Number(step.dataset["step"]) < steps,
        );
    }
}

/** The way was left: all the ink fades. */
export function penLeave(layer: Element): void {
    layer.classList.add("is-leaving");
}

/** "it moved", under an oval round the button that moved. */
function moved(layer: Element, slideB: boolean, text: string): void {
    const y = slideB ? 179 : 158;
    layer.replaceChildren(
        stroke(oval({ x: 707, y }, 62, 17), 1),
        word(text, [707, y + 43], 3),
    );
}

/** "nothing moved", 15px, never wider than the button (104), underlined. */
function stayed(layer: Element, text: string): void {
    const note = word(text, [707, 219], 1);
    note.classList.add("is-small");
    layer.replaceChildren(note, stroke("M657 228q26 -3 50 -1t50 -2", 2.4));
    if (note instanceof SVGTextElement && note.getComputedTextLength() > 104) {
        note.setAttribute("textLength", "104");
        note.setAttribute("lengthAdjust", "spacingAndGlyphs");
    }
}

/** The pen writes the ending on the screen, once. */
export function penEnding(
    layer: Element,
    ending: {
        readonly flicker: boolean;
        readonly slideB: boolean;
        readonly text: string;
    },
): void {
    if (ending.flicker) {
        moved(layer, ending.slideB, ending.text);
    } else {
        stayed(layer, ending.text);
    }
}
