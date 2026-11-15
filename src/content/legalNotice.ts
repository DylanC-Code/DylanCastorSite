import legalJson from "#/content/legal.json";
import { legalRuns } from "#/presentation/visitor/legal/presenters/legalRuns.ts";
import type {
    LegalNoticeViewModel,
    LegalSectionViewModel,
} from "#/presentation/visitor/legal/viewmodels/LegalNoticeViewModel.ts";

/**
 * The legal notice in English and in French, from the legal handoff's
 * `legal.json`, kept as delivered (its two routes added). Never reword a legal
 * sentence here: change words in that file only.
 */
type Lang = "en" | "fr";

const { identity, routes } = legalJson;

function pair(words: readonly string[]): readonly [string, string] {
    const [first = "", second = ""] = words;
    return [first, second];
}

function sectionOf(
    section: (typeof legalJson.sections)[number],
    lang: Lang,
): LegalSectionViewModel {
    return {
        id: section.id,
        title: pair(section.title[lang]),
        blocks: section.blocks[lang].map((block) =>
            block === "{identity}" ? "identity" : legalRuns(block),
        ),
    };
}

function noticeIn(lang: Lang): LegalNoticeViewModel {
    const other: Lang = lang === "en" ? "fr" : "en";
    return {
        lang,
        href: routes[lang],
        other: {
            lang: other,
            href: routes[other],
            label:
                lang === "en"
                    ? legalJson.switch.onEnglishPage
                    : legalJson.switch.onFrenchPage,
        },
        title: legalJson.title[lang],
        updated: legalJson.updated[lang],
        identity: {
            ...identity,
            phone: identity.phone[lang],
            phoneHref: `tel:${identity.phone.en.replaceAll(" ", "")}`,
        },
        sections: legalJson.sections.map((section) => sectionOf(section, lang)),
        footerLink: legalJson.footerLink[lang],
    };
}

export const legalNotices: readonly LegalNoticeViewModel[] = [
    noticeIn("en"),
    noticeIn("fr"),
];
