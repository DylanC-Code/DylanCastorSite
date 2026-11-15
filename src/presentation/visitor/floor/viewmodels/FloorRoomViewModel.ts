/** What every room shows: its name and its one line. */
interface RoomWords {
    readonly id: string;
    readonly name: string;
    /** One line; shown only in a published room. */
    readonly line: string;
}

/** A published topic: a lit room, a link to its page, with its scene. */
export interface OpenRoomViewModel extends RoomWords {
    readonly state: "open";
    /** The scene component drawn in the room (e.g. "magicLantern"). */
    readonly scene: string;
    readonly href: string;
}

/** A topic not published yet: a curtained room with its title card. */
export interface LaterRoomViewModel extends RoomWords {
    readonly state: "later";
}

export type FloorRoomViewModel = OpenRoomViewModel | LaterRoomViewModel;
