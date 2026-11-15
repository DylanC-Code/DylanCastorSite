import { agenciesPage } from "#/content/agencySections.ts";
import { brandsPage } from "#/content/brandsHome.ts";

/** The two written reading-path homes, as `ReaderPathHome` takes them. */
export const readerPathPages = {
    agencies: agenciesPage,
    brands: brandsPage,
} as const;
