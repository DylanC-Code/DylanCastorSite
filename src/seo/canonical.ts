/**
 * The public URL of a page. With `build.format: "file"`, Astro hands pages
 * their file path (`/cro/flicker-free-ab-tests.html`, `/index.html`), but the
 * URL Google should index has no `.html` and no trailing slash.
 */
export function canonicalUrl(pathname: string, site: URL): URL {
    const clean = pathname
        .replace(/(^|\/)index\.html$/u, "$1")
        .replace(/\.html$/u, "")
        .replace(/(.)\/$/u, "$1");
    return new URL(clean, site);
}
