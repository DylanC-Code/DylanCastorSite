import flickerJson from "#/content/flicker.json";
import { floorHalls } from "#/content/floorHalls.ts";
import type { FlickerPageViewModel } from "#/presentation/visitor/flicker/viewmodels/FlickerPageViewModel.ts";
import type { CaptionRun } from "#/presentation/visitor/flicker/viewmodels/LanternPlateViewModel.ts";
import {
    type KeyRun,
    keyRuns,
} from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";
import type { Versioned } from "#/presentation/visitor/shared/topic/viewmodels/Versioned.ts";

/**
 * The topic page "Flicker-free A/B tests" (floor I), from the flicker handoff's
 * `flicker.json`, kept as delivered (confirmed by Dylan, 15 Nov).
 */
const { head, plate, signpost, shop, workshop, details, ask, phone, marks } =
    flickerJson;
const storefront = floorHalls["storefront"];

function pair(words: readonly string[]): readonly [string, string] {
    const [first = "", second = ""] = words;
    return [first, second];
}

function both(
    text: string | { agency: string; brand: string },
): Versioned<readonly KeyRun[]> {
    return typeof text === "string"
        ? { agency: keyRuns(text), brand: keyRuns(text) }
        : { agency: keyRuns(text.agency), brand: keyRuns(text.brand) };
}

/**
 * Flick: its second part in copper; cleanEnd: "No flicker" copper, "at a price"
 * the note's link.
 */
function captionOf(
    key: string,
    words: string | readonly string[],
): readonly CaptionRun[] {
    if (typeof words === "string") {
        return [{ text: words, tone: "plain" }];
    }
    const tones: readonly CaptionRun["tone"][] =
        key === "cleanEnd"
            ? ["plain", "copper", "copper", "link", "plain"]
            : ["plain", "copper"];
    return words.map((text, index) => ({
        text: index === 1 ? ` ${text}` : text,
        tone: tones[index] ?? "plain",
    }));
}

const captionKeys = [
    "hello",
    "openA",
    "openB",
    "flick",
    "slideDarkA",
    "slideDarkB",
    "close",
    "cleanEnd",
] as const;

export const flickerPage: FlickerPageViewModel = {
    head: {
        back: { label: head.back, href: "/shopify-cro" },
        title: pair(head.title),
        intro: head.intro,
    },
    plate: {
        title: plate.title,
        ways: { usual: plate.ways.usual.name, clean: plate.ways.clean.name },
        captions: Object.fromEntries(
            captionKeys.map((key) => [
                key,
                captionOf(key, plate.captions[key]),
            ]),
        ),
        left: plate.captions.left,
        pen: plate.pen,
        priceNote: plate.priceNote,
        labels: {
            ...plate.labels,
            slideLetters: pair(plate.labels.slideLetters),
        },
        marks: { done: marks.tabDone, left: marks.tabLeft },
        wide: {
            open: phone.wideView,
            close: phone.closeWideView,
            turn: phone.turn,
            noTurn: phone.noTurn,
        },
    },
    cue: plate.cue,
    signpost: {
        title: pair(signpost.title),
        boards: pair(signpost.boards),
        captions: pair(signpost.captions),
        label: signpost.label,
    },
    shop: {
        title: pair(shop.title),
        text: both(shop.text),
        sign: shop.sign,
        label: shop.label,
    },
    workshop: {
        title: pair(workshop.title),
        text: both(workshop.text),
        plaque: pair(workshop.plaque),
        hangingSign: pair(workshop.hangingSign),
        label: workshop.label,
    },
    details: {
        title: pair(details.title),
        hint: details.hint,
        drawers: details.drawers.map(({ label, question, answer }) => ({
            label,
            question,
            answer: both(answer),
        })),
    },
    ask: {
        title: { agency: pair(ask.title.agency), brand: pair(ask.title.brand) },
        link: ask.link,
        href: storefront?.ask.href ?? "/cro#slot-title",
        byPath: storefront?.ask.byPath ?? {},
        label: ask.label,
    },
};
