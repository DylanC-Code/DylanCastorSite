import metaJson from "#/content/meta.json";

/**
 * Each page's title and description and the image shown when a link is shared,
 * from the page meta handoff's `meta.json`, kept as delivered (its two error
 * sentences are in `formWords.ts`). Change words in that file only. A page that
 * is not designed yet has no entry here: it keeps its placeholder words.
 */
export interface PageMeta {
    readonly title: string;
    readonly description: string;
}

const { pages, shareImage: image } = metaJson;

export const pageMeta = pages;

export const siteName = metaJson.siteName;

/** The finished picture in `public/`, 1200 × 630. */
export const shareImage = {
    path: "/shareImage.png",
    width: 1200,
    height: 630,
    alt: image.alt,
} as const;

/** The reading paths' homes that are written, by book id. */
export const readerPathMeta: Readonly<Record<string, PageMeta>> = {
    agencies: pages.agencies,
    brands: pages.brands,
};

/** The floors with a hall, by floor id. */
export const floorMeta: Readonly<Record<string, PageMeta>> = {
    storefront: pages.floor1,
};

/** The written topic pages, by room id. */
export const topicMeta: Readonly<Record<string, PageMeta>> = {
    flicker_free_tests: pages.flicker,
    checking_a_test: pages.checkTest,
};

/** The legal notice, by language. */
export const legalMeta = { en: pages.legalEn, fr: pages.legalFr } as const;
