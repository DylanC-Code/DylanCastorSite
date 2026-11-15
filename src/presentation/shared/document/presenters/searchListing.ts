/**
 * Whether search engines may list a page: only the pages named open are. Every
 * other page, a new one included, is hidden (`noindex`, out of the sitemap)
 * until it is added to the open list.
 */
export function isListed(
    page: URL,
    open: readonly string[],
    site: URL,
): boolean {
    return open.some((path) => new URL(path, site).href === page.href);
}
