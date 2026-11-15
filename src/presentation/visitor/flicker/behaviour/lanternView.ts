/**
 * Draws the lantern's parts from three numbers: the shutter (0 closed, 1 open),
 * the slide (0 on A, 1 on B) and the dial (quarter turns). A move eases between
 * two drawings in 750ms (x²(3 − 2x)), or at once.
 */
export interface Pose {
    readonly open: number;
    readonly slide: number;
    readonly dial: number;
}

export interface Scene {
    /** The carriage and its letters (outside the button, moving with it). */
    readonly carriage: readonly Element[];
    readonly shutter: Element;
    readonly beam: Element;
    readonly picture: Element;
    readonly dark: Element;
    readonly hand: Element;
}

function need(svg: Element, mark: string): Element {
    const found = svg.querySelector(`[data-${mark}]`);
    if (found === null) {
        throw new Error(`The lantern has no ${mark}`);
    }
    return found;
}

export function sceneOf(svg: Element): Scene {
    return {
        carriage: [...svg.querySelectorAll("[data-carriage]")],
        shutter: need(svg, "shutter"),
        beam: need(svg, "beam"),
        picture: need(svg, "picture"),
        dark: need(svg, "dark"),
        hand: need(svg, "dial-hand"),
    };
}

export function draw(scene: Scene, pose: Pose): void {
    for (const part of scene.carriage) {
        part.setAttribute("transform", `translate(0 ${-60 * pose.slide})`);
    }
    scene.shutter.setAttribute(
        "transform",
        `rotate(${-84 * pose.open} 324 162)`,
    );
    scene.beam.setAttribute("opacity", String(pose.open));
    scene.picture.setAttribute(
        "transform",
        `translate(0 ${-196 * pose.slide})`,
    );
    scene.dark.setAttribute("opacity", String(0.9 * (1 - pose.open)));
    scene.hand.setAttribute("transform", `rotate(${pose.dial * 90})`);
}

function ease(x: number): number {
    return x * x * (3 - 2 * x);
}

function between(from: Pose, to: Pose, x: number): Pose {
    const k = ease(x);
    return {
        open: from.open + (to.open - from.open) * k,
        slide: from.slide + (to.slide - from.slide) * k,
        dial: from.dial + (to.dial - from.dial) * k,
    };
}

/** Moves the drawing from one pose to the next; resolves when it is there. */
export function tween(scene: Scene, from: Pose, to: Pose): Promise<void> {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        draw(scene, to);
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const start = performance.now();
        function frame(now: number): void {
            const x = Math.min(1, (now - start) / 750);
            draw(scene, between(from, to, x));
            if (x < 1) {
                requestAnimationFrame(frame);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(frame);
    });
}
