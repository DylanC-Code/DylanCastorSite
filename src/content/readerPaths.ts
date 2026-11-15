import { agenciesPage } from "#/content/agencySections.ts";
import { brandsPage } from "#/content/brandsHome.ts";
import { closedEngineering } from "#/content/closedFloors.ts";

/**
 * The reading-path homes, as `ReaderPathHome` takes them: the two written ones,
 * and the engineering home, closed until written.
 */
export const readerPathPages = {
    agencies: agenciesPage,
    brands: brandsPage,
    closed: closedEngineering,
} as const;
