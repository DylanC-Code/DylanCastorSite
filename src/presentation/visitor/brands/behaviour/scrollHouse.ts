import {
    beltBox,
    currentLevel,
} from "#/presentation/visitor/brands/state/scrollLevels.ts";

/** The line, from the top of the screen, that makes a level current. */
const readingLine = 380;

interface ScrollHouse {
    root: HTMLElement;
    inside: HTMLElement;
    levels: HTMLElement[];
}

/** Draws the level crossing the reading line on paper, and plays its scene. */
function markCurrent(house: ScrollHouse): void {
    const spans = house.levels.map((level) => {
        const { top, bottom } = level.getBoundingClientRect();
        return { top, bottom };
    });
    const current = currentLevel(spans, readingLine);
    house.levels.forEach((level, index) => {
        level.toggleAttribute("data-current", index === current);
    });
}

/**
 * Lays the belt where the theme's and the cellar's pulleys really are (x 422 to
 * 438, y 80 and 64 of each scene's 440 × 200), whatever the screen width.
 */
function layBelt(house: ScrollHouse): void {
    const theme = sceneBox(house, 1);
    const cellar = sceneBox(house, 3);
    if (theme === null || cellar === null) {
        return;
    }
    setBelt(
        house.inside,
        beltBox(theme, cellar, house.inside.getBoundingClientRect()),
    );
}

function sceneBox(house: ScrollHouse, index: number): DOMRect | null {
    const scene = house.levels[index]?.querySelector(".scene");
    return scene?.getBoundingClientRect() ?? null;
}

function setBelt(inside: HTMLElement, box: Record<string, number>): void {
    const { style } = inside;
    for (const [name, px] of Object.entries(box)) {
        style.setProperty(`--belt-${name}`, `${px}px`);
    }
}

/** Runs `work` at most once a frame. */
function oncePerFrame(work: () => void): () => void {
    let queued = false;
    return function ask(): void {
        if (!queued) {
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                work();
            });
        }
    };
}

/** Pauses the scenes and the belt while the house is off screen. */
function watchOnScreen(root: HTMLElement): void {
    const observer = new IntersectionObserver(([entry]) => {
        const { dataset } = root;
        dataset["onscreen"] = String(entry?.isIntersecting ?? true);
    });
    observer.observe(root);
}

/**
 * The house you scroll through (below 1000px): the current level follows the
 * scroll; the belt follows the layout. Without this script every level stays
 * dark and still, all its words readable.
 */
export function initScrollHouse(section: HTMLElement): void {
    const root = section.querySelector<HTMLElement>("[data-scroll-house]");
    const inside = root?.querySelector<HTMLElement>("[data-scroll-inside]");
    if (!root || !inside) {
        return;
    }
    const house = {
        root,
        inside,
        levels: [...root.querySelectorAll<HTMLElement>("[data-scroll-level]")],
    };
    const onScroll = oncePerFrame(() => {
        markCurrent(house);
    });
    addEventListener("scroll", onScroll, { passive: true });
    new ResizeObserver(() => {
        layBelt(house);
        markCurrent(house);
    }).observe(inside);
    watchOnScreen(root);
}
