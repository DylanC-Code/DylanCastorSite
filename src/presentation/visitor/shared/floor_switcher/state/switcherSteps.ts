/** Which way the content leaves: deeper is a floor further down the list. */
type Direction = "deeper" | "higher";

export type PickPlan =
    | { readonly kind: "close" }
    | {
          readonly kind: "go";
          readonly href: string;
          readonly direction: Direction;
      };

/**
 * What picking a floor does. The floor you are on only closes the panel;
 * another leaves towards it. `order` is every floor's href, top to bottom.
 */
export function planPick(
    order: readonly string[],
    currentHref: string | null,
    chosenHref: string,
): PickPlan {
    if (chosenHref === currentHref) {
        return { kind: "close" };
    }
    const from = currentHref === null ? -1 : order.indexOf(currentHref);
    const direction = order.indexOf(chosenHref) > from ? "deeper" : "higher";
    return { kind: "go", href: chosenHref, direction };
}

/** Where focus lands when the panel opens: the current floor, else the first. */
export function openingFocus(
    available: readonly string[],
    currentHref: string | null,
): string | undefined {
    const current = available.find((href) => href === currentHref);
    return current ?? available[0];
}
