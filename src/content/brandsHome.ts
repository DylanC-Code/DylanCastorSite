import brandsJson from "#/content/brands.json";
import { dataLine, formErrorWords } from "#/content/formWords.ts";
import { home } from "#/content/home.ts";
import { letterRuns } from "#/presentation/visitor/brands/presenters/letterRuns.ts";
import type { BrandsPageViewModel } from "#/presentation/visitor/brands/viewmodels/BrandsPageViewModel.ts";

/**
 * The brands home (`/cro`), from the brands handoff's `brands.json`, kept as
 * delivered. Every word there is a draft: change words only in that file. The
 * form's two error sentences are the agencies postcard's.
 */
const { hero, house, guarantee, start, ask } = brandsJson;
const emailHref = home.header.action.href;

function word(words: readonly string[], index: number, what: string): string {
    const found = words[index];
    if (found === undefined) {
        throw new Error(`brands.json has no ${what} ${index + 1}`);
    }
    return found;
}

const [plainBefore = "", plainLabel = ""] = ask.plain;

export const brandsPage: BrandsPageViewModel = {
    hero: {
        eyebrow: hero.eyebrow,
        title: [hero.title, hero.titleItalic],
        lead: hero.lead,
        button: { label: hero.button, href: emailHref },
        down: { label: hero.link, href: "#house" },
        stackedActions: true,
    },
    house: {
        ...house,
        levels: house.levels.map(({ name, caption, sentence, points }) => ({
            name,
            caption,
            sentence,
            points,
        })),
    },
    guarantee: {
        title: guarantee.title,
        titleItalic: guarantee.titleItalic,
        lead: guarantee.lead,
        over: guarantee.over,
        heading: guarantee.heading,
        letter: letterRuns(guarantee.letter),
        signedLabel: guarantee.signedLabel,
        signed: guarantee.signed,
        seal: guarantee.seal,
    },
    start: {
        title: start.title,
        titleItalic: start.titleItalic,
        sentence: start.sentence,
        emphasis: start.emphasis,
        text: start.text,
        sign: [
            word(start.sign, 0, "sign line"),
            word(start.sign, 1, "sign line"),
        ],
        plate: [
            word(start.plate, 0, "plate line"),
            word(start.plate, 1, "plate line"),
            word(start.plate, 2, "plate line"),
        ],
    },
    ask: {
        title: ask.title,
        titleItalic: ask.titleItalic,
        text: ask.text,
        plain: { before: plainBefore, label: plainLabel },
        dataLine,
        emailHref,
        fields: {
            messageLabel: ask.messageLabel,
            messagePlaceholder: ask.messagePlaceholder,
            replyLabel: ask.replyLabel,
            replyPlaceholder: ask.replyPlaceholder,
            fromLabel: ask.fromLabel,
            fromPlaceholder: ask.fromPlaceholder,
            send: ask.send,
        },
        flap: ask.flap,
        letter: ask.letter,
        sent: [
            word(ask.sent, 0, "sent line"),
            word(ask.sent, 1, "sent line"),
            word(ask.sent, 2, "sent line"),
        ],
        again: ask.again,
        errors: formErrorWords,
    },
};
