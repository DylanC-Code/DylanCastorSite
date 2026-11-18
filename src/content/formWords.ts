import { home } from "#/content/home.ts";
import legalJson from "#/content/legal.json";
import metaJson from "#/content/meta.json";
import type { NoScriptEmailViewModel } from "#/presentation/visitor/shared/message/viewmodels/NoScriptEmailViewModel.ts";

/**
 * What both forms (the agencies postcard, the brands letter slot) say the same:
 * the link to "Your data" under them, from `legal.json`, and their two error
 * sentences and the line shown instead of them without script, from
 * `meta.json`.
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

/** Without script, in place of a form: "Email me at" and the address. */
const emailHref = home.header.action.href;

export const noScriptEmail: NoScriptEmailViewModel = {
    before: metaJson.formErrors.noScript,
    label: emailHref.replace(/^mailto:/u, ""),
    href: emailHref,
};
