import type { MarkId } from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * The check plate's sheet in its two layouts (HANDOFF.md, PHONE.md): side by
 * side on a wide screen (880 × 380), one under the other on a phone (358 ×
 * 572). The store side and the street keep their own measures and are placed by
 * an origin and a scale; the marks and the red ovals are found from them.
 */
interface Placed {
    readonly x: number;
    readonly y: number;
    readonly scale: number;
}

interface Box {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface SheetLayout {
    readonly name: "desk" | "stack";
    readonly width: number;
    readonly height: number;
    readonly storeBox: Box;
    readonly testBox: Box;
    /** The sample page (300 × 200) and the phone (96 × 190). */
    readonly page: Placed;
    readonly phone: Placed;
    /** The store side's ground line. */
    readonly groundY: number;
    readonly groundFrom: number;
    readonly groundTo: number;
    /** The street, 312 wide, its ground at y 236. */
    readonly street: Placed;
    readonly markRadius: number;
}

export const streetWidth = 312;
/** Where the shop front starts in the street: it is 196 wide, at the right. */
export const shopX = streetWidth - 196;
/** Where the counter sits on the shop front. */
export const dialAt = { x: 84, y: 70 } as const;

export const deskLayout: SheetLayout = {
    name: "desk",
    width: 880,
    height: 380,
    storeBox: { x: 20, y: 40, width: 450, height: 304 },
    testBox: { x: 490, y: 40, width: 370, height: 304 },
    page: { x: 44, y: 72, scale: 1 },
    phone: { x: 368, y: 106, scale: 1 },
    groundY: 328,
    groundFrom: 24,
    groundTo: 466,
    street: { x: 495, y: 52, scale: 1.17 },
    markRadius: 9,
};

export const stackLayout: SheetLayout = {
    name: "stack",
    width: 358,
    height: 572,
    storeBox: { x: 6, y: 22, width: 346, height: 222 },
    testBox: { x: 6, y: 272, width: 346, height: 292 },
    page: { x: 22, y: 54, scale: 0.68 },
    phone: { x: 258, y: 80, scale: 0.68 },
    groundY: 229,
    groundFrom: 12,
    groundTo: 346,
    street: { x: 15, y: 286, scale: 1.05 },
    markRadius: 10,
};

interface Point {
    readonly x: number;
    readonly y: number;
}

export interface Ring extends Point {
    readonly rx: number;
    readonly ry: number;
}

function at(place: Placed, x: number, y: number): Point {
    return { x: place.x + place.scale * x, y: place.y + place.scale * y };
}

function ringAt(
    place: Placed,
    [x, y, rx, ry]: readonly [number, number, number, number],
): Ring {
    return { ...at(place, x, y), rx: place.scale * rx, ry: place.scale * ry };
}

/** Where each mark sits on the sheet. */
export function markSpots(layout: SheetLayout): Record<MarkId, Point> {
    const { page, phone, street } = layout;
    return {
        phone: at(phone, -10, 152),
        cart: at(page, 290, 12),
        count: at(street, shopX + dialAt.x + 34, dialAt.y - 24),
        flick: at(page, 150, 184),
        where: at(street, 31, 106),
        off: at(street, shopX + 196, 150),
    };
}

/** The red oval left around the faulty spot once its ticket is seen. */
export function seenRings(layout: SheetLayout): Record<MarkId, Ring> {
    const { page, phone, street } = layout;
    return {
        phone: ringAt(phone, [78, 152, 20, 13]),
        cart: ringAt(page, [270, 27, 18, 11]),
        count: ringAt(street, [shopX + dialAt.x, dialAt.y, 34, 30]),
        flick: ringAt(page, [176, 153, 34, 17]),
        where: ringAt(street, [31, 80, 40, 18]),
        off: ringAt(street, [shopX + 176, 164, 20, 42]),
    };
}

/** Short strokes every `step` units from `from`, `count` of them. */
export function ticks(
    from: Point,
    { step, stroke, count }: { step: number; stroke: string; count: number },
): string {
    return Array.from(
        { length: Math.max(0, count) },
        (_, index) => `M${from.x + index * step} ${from.y}${stroke}`,
    ).join("");
}
