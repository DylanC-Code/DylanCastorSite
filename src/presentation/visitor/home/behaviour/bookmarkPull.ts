/**
 * The bookmark taken (19 Nov 2026, Dylan's choice: a real pull). It gives a
 * little, then slides up out of the book (bookmark.css); the page leaves as a
 * floor pick does (pageTransition.css), then the link is followed. Back from
 * the path, the shelf is as it was left. With reduced motion the link is simply
 * followed.
 */
const leaveAt = 300;
const navigateAt = 650;

export function takeBookmark(event: MouseEvent): void {
    const link =
        event.target instanceof Element
            ? event.target.closest("a[data-bookmark]")
            : null;
    if (
        !(link instanceof HTMLAnchorElement)
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }
    event.preventDefault();
    link.classList.add("is-taken");
    document.documentElement.dataset["leaving"] = "deeper";
    window.setTimeout(() => {
        document.querySelector("main")?.classList.add("is-leaving");
    }, leaveAt);
    window.setTimeout(() => {
        window.location.assign(link.href);
    }, navigateAt);
}

/** Back to a page the browser kept as it was left: undo the leaving. */
export function restoreOnReturn(root: HTMLElement): void {
    window.addEventListener("pageshow", (event) => {
        if (!event.persisted) {
            return;
        }
        for (const taken of root.querySelectorAll(".is-taken")) {
            taken.classList.remove("is-taken");
        }
        document.querySelector("main")?.classList.remove("is-leaving");
        delete document.documentElement.dataset["leaving"];
    });
}
