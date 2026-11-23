/**
 * The engravings that play once (`[data-plays-once]`): armed at load, they
 * wait, then play when half of the engraving is in view, and stay still at
 * their end. With reduced motion they are never armed: the end state shows.
 */
export function playOnceInView(page: HTMLElement): void {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }
    const watcher = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-playing");
                    watcher.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.5 },
    );
    for (const engraving of page.querySelectorAll("[data-plays-once]")) {
        engraving.classList.add("is-armed");
        watcher.observe(engraving);
    }
}
