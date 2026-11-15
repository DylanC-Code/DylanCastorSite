/**
 * Which reading path's home the visitor came through, carried in the address
 * (`?via=agencies`), never stored on the device: the legal notice promises the
 * site stores nothing. A home adds it to its internal links; floors and topics
 * read it and pass it on. Canonical URLs leave it out.
 */
const key = "via";

/** The path in this page's address, if any (a plain word only). */
export function pathFromAddress(): string | null {
    const via = new URLSearchParams(location.search).get(key);
    return via !== null && /^[a-z]+$/u.test(via) ? via : null;
}

function isInternal(link: HTMLAnchorElement): boolean {
    const written = link.getAttribute("href") ?? "";
    return link.origin === location.origin && !written.startsWith("#");
}

/** Adds the path to every internal link under `root`. */
export function carryPath(root: ParentNode, path: string): void {
    for (const link of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        if (isInternal(link)) {
            const target = new URL(link.href);
            target.searchParams.set(key, path);
            link.setAttribute(
                "href",
                `${target.pathname}${target.search}${target.hash}`,
            );
        }
    }
}

/** On a floor or a topic: passes the visitor's path on to the next page. */
export function passPathOn(root: ParentNode): string | null {
    const path = pathFromAddress();
    if (path !== null) {
        carryPath(root, path);
    }
    return path;
}
