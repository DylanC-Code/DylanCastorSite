/** A level's top and bottom on screen, in px from the top of the screen. */
export interface LevelSpan {
    readonly top: number;
    readonly bottom: number;
}

/**
 * The level crossing the reading line (`line` px down the screen), or -1 when
 * the line falls above or below the house.
 */
export function currentLevel(
    spans: readonly LevelSpan[],
    line: number,
): number {
    return spans.findIndex((span) => span.top <= line && span.bottom > line);
}

/** Where something sits on screen. */
export interface ScreenBox {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}

/**
 * The belt's box inside the house, from the theme's and the cellar's scenes as
 * drawn: it runs at x 422 to 438 of their 440 units, from the theme's pulley (y
 * 80 of 200) down to the cellar's (y 64).
 */
export function beltBox(
    theme: ScreenBox,
    cellar: ScreenBox,
    inside: ScreenBox,
): { top: number; bottom: number; left: number; width: number } {
    return {
        top: theme.top - inside.top + theme.height * 0.4,
        bottom: cellar.top - inside.top + cellar.height * 0.32,
        left: theme.left - inside.left + (theme.width * 422) / 440,
        width: (theme.width * 16) / 440,
    };
}
