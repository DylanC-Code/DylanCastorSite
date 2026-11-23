import {
    type SheetLayout,
    ticks,
} from "#/presentation/visitor/check_test/presenters/sheetGeometry.ts";

/**
 * The store side's frame in a layout: the sample page shown on the screen of
 * the lantern plate (a top bar, a frame 6 units around the page, a fringe of
 * short ticks under it, a stand with three feet), the phone on a small stand,
 * and a hatched ground line under both.
 */
export interface StoreShapes {
    readonly desktopLabel: { readonly x: number; readonly y: number };
    readonly phoneLabel: { readonly x: number; readonly y: number };
    readonly screen: string;
    readonly fringe: string;
    readonly stand: string;
    readonly phoneStand: string;
    readonly ground: string;
    readonly hatch: string;
}

function round(value: number): number {
    return Math.round(value * 100) / 100;
}

export function storeShapes(layout: SheetLayout): StoreShapes {
    const { page, phone, groundY: g, groundFrom, groundTo } = layout;
    const width = round(300 * page.scale);
    const height = round(200 * page.scale);
    const { x, y } = page;
    const middle = round(x + width / 2);
    const phoneMiddle = round(phone.x + 48 * phone.scale);
    const phoneFoot = round(phone.y + 190 * phone.scale);
    return {
        desktopLabel: { x: x - 6, y: round(y - 12 - 6 * page.scale) },
        phoneLabel: { x: phone.x, y: phone.y - 10 },
        screen: `M${x - 12} ${y - 10}h${width + 24}M${x - 6} ${y - 6}h${width + 12}v${height + 12}h${-(width + 12)}z`,
        fringe: ticks(
            { x: x + 6, y: round(y + height + 6) },
            { step: 12, stroke: "v7", count: Math.floor(width / 12) },
        ),
        stand: `M${middle} ${round(y + height + 6)}V${g - 12}M${middle - 32} ${g}l32 -12 32 12`,
        phoneStand: `M${phoneMiddle} ${phoneFoot}V${g - 12}M${phoneMiddle - 18} ${g}l18 -12 18 12`,
        ground: `M${groundFrom} ${g}H${groundTo}`,
        hatch: ticks(
            { x: groundFrom + 10, y: g + 4.5 },
            {
                step: 14,
                stroke: "l-6 8",
                count: Math.floor((groundTo - groundFrom - 10) / 14),
            },
        ),
    };
}
