import type {
    MarkId,
    PlateState,
} from "#/presentation/visitor/check_test/state/plateState.ts";

/**
 * The street's rules, visitor by visitor (counted from 0): even ones go to door
 * A, odd ones to door B. Before the end, visitor 2, 6, 10… wears the copper
 * beanie (he comes from another page) and goes to door B; a visit through B is
 * counted twice; with the lever off visitors still go to B. After the end: no
 * beanie, one count each, and the lever really closes B.
 */
export interface Visit {
    readonly beanie: boolean;
    readonly door: "A" | "B";
    readonly counts: 1 | 2;
}

/** The faults the red pen marks as they happen, by the mark that tells them. */
type Fault = Extract<MarkId, "count" | "where" | "off">;

/** After the end, the off lever really closes door B. */
function closesB(plate: PlateState): boolean {
    return plate.done && plate.leverOff;
}

function doorOf(index: number, beanie: boolean, plate: PlateState): "A" | "B" {
    if (closesB(plate)) {
        return "A";
    }
    return index % 2 === 1 || beanie ? "B" : "A";
}

export function visitOf(index: number, plate: PlateState): Visit {
    const beanie = !plate.done && index % 4 === 2;
    const door = doorOf(index, beanie, plate);
    return { beanie, door, counts: door === "B" && !plate.done ? 2 : 1 };
}

/** The faults this visit shows, each until its ticket has been seen. */
export function faultsOf(visit: Visit, plate: PlateState): readonly Fault[] {
    const happening: readonly [boolean, Fault][] = [
        [visit.counts === 2, "count"],
        [visit.beanie, "where"],
        [visit.door === "B" && plate.leverOff, "off"],
    ];
    return plate.done
        ? []
        : happening
              .filter(
                  ([happens, fault]) => happens && !plate.seen.includes(fault),
              )
              .map(([, fault]) => fault);
}
