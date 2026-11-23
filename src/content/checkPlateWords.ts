import checkTestJson from "#/content/checkTest.json";
import { pair } from "#/content/topicWords.ts";
import {
    type MarkId,
    markIds,
} from "#/presentation/visitor/check_test/state/plateState.ts";
import type {
    CheckPlateViewModel,
    PlateMarkViewModel,
} from "#/presentation/visitor/check_test/viewmodels/CheckPlateViewModel.ts";
import { keyRuns } from "#/presentation/visitor/shared/topic/presenters/keyRuns.ts";

/** The plate's words, from `checkTest.json` (plate), as delivered. */
const { plate } = checkTestJson;
const { store, street } = plate;

function markIdOf(id: string): MarkId {
    const known = markIds.find((one) => one === id);
    if (known === undefined) {
        throw new Error(`checkTest.json has an unknown mark ${id}`);
    }
    return known;
}

const marks: readonly PlateMarkViewModel[] = plate.marks.map((mark) => ({
    number: mark.number,
    id: markIdOf(mark.id),
    check: mark.check,
    markLabel: mark.markLabel,
    fault: keyRuns(mark.fault),
    howICheck: keyRuns(mark.howICheck),
}));

const [doorA = { letter: "A", word: "" }, doorB = { letter: "B", word: "" }] =
    street.doors;

export const checkPlate: CheckPlateViewModel = {
    instruction: plate.instruction,
    counter: plate.counter,
    startAgain: plate.startAgain,
    sheet: {
        label: plate.label,
        sides: plate.sides,
        store: {
            desktop: store.desktop,
            phone: store.phone,
            storeName: store.sample.storeName,
            product: store.sample.product,
            price: store.sample.price,
            stock: store.sample.stock,
            button: store.sample.button,
            cartCount: store.sample.cartCount,
        },
        street: {
            entrance: pair(street.entrance),
            storeName: street.storeName,
            doors: [doorA, doorB],
            signpost: pair(street.signpost),
            counter: street.counter,
            lever: street.switch,
            countedTwice: street.penCountedTwice,
        },
        stamp: plate.stamp,
        marks,
    },
    sentence: {
        start: plate.sentence.start,
        end: keyRuns(plate.sentence.end),
    },
    ticket: {
        checkLabel: plate.ticket.checkLabel,
        close: plate.ticket.close,
        seeCorrected: plate.ticket.seeCorrected,
    },
};
