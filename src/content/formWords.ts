import legalJson from "#/content/legal.json";
import metaJson from "#/content/meta.json";

/**
 * What both forms (the agencies postcard, the brands letter slot) say the same:
 * the link to "Your data" under them, from `legal.json`, and their two error
 * sentences, from `meta.json`.
 */
const { replyTo, failed } = metaJson.formErrors;
const [before = "", link = "", after = ""] = failed;

/** "How your data is used": the English notice's "Your data". */
export const dataLine = {
    label: legalJson.forms.dataLine,
    href: `${legalJson.routes.en}#your_data`,
};

/** The failed sentence wraps the email link: before, the link's words, after. */
export const formErrorWords = {
    replyTo,
    failed: [before, link, after],
} as const;
