import type { FloorRoomViewModel } from "#/presentation/visitor/floor/viewmodels/FloorRoomViewModel.ts";

/**
 * A floor's hall: one line about the floor, then its rooms, one per topic, and
 * the question at the end. Floors II, IV and All reuse it with their data.
 */
export interface FloorHallViewModel {
    readonly head: {
        readonly title: readonly [string, string];
        readonly intro: string;
    };
    readonly sign: {
        readonly left: string;
        readonly middle: string;
        readonly right: string;
        /** The right word on a phone (shorter). */
        readonly rightShort: string;
    };
    readonly building: {
        readonly navLabel: string;
        readonly liftLabel: string;
        readonly hint: string;
        /** The phone's hint, over the sign. */
        readonly hintShort: string;
        readonly open: string;
        readonly later: string;
        readonly showing: string;
        readonly enter: string;
    };
    readonly rooms: readonly FloorRoomViewModel[];
    readonly ask: {
        readonly title: readonly [string, string];
        readonly link: string;
        /** Where "Write to me" goes for a visitor who came from neither home. */
        readonly href: string;
        /** By reading path (agencies, brands): that home's closing ask. */
        readonly byPath: Readonly<Record<string, string>>;
    };
}
