/**
 * What a step does beyond its CSS: the demo loads on first view; the points run
 * on screen.
 */

/** The flicker demo loads and plays the first time its step is current. */
export function firstSeen(step: HTMLElement): void {
    const demo = step.querySelector<HTMLElement>("[data-flicker-demo]");
    if (demo !== null) {
        void playDemo(demo);
    }
}

async function playDemo(demo: HTMLElement): Promise<void> {
    const { initFlickerDemo } =
        await import("#/presentation/visitor/agencies/behaviour/flickerDemo.ts");
    initFlickerDemo(demo);
}

/** The launch points run only while their step is on screen. */
export function watchOnScreen(steps: readonly HTMLElement[]): void {
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            entry.target.toggleAttribute(
                "data-on-screen",
                entry.isIntersecting,
            );
        }
    });
    for (const step of steps) {
        observer.observe(step);
    }
}
