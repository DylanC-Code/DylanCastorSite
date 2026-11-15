import legalJson from "#/content/legal.json";

/**
 * What both forms (the agencies postcard, the brands letter slot) say the same:
 * the link to "Your data" under them, from `legal.json`.
 */

/** "How your data is used": the English notice's "Your data". */
export const dataLine = {
    label: legalJson.forms.dataLine,
    href: `${legalJson.routes.en}#your_data`,
};
