/**
 * The flicker demo: one 2600ms run, played once on arrival and again on Replay.
 * The run itself is CSS (flickerDemoRun.css); this only starts it.
 */
export function initFlickerDemo(demo: HTMLElement): void {
    const replay = demo.querySelector<HTMLElement>("[data-replay]");
    replay?.removeAttribute("hidden");
    replay?.addEventListener("click", () => {
        play(demo);
    });
    play(demo);
}

function play(demo: HTMLElement): void {
    const { dataset } = demo;
    dataset["run"] = "";
    for (const animation of demo.getAnimations({ subtree: true })) {
        animation.cancel();
        animation.play();
    }
}
