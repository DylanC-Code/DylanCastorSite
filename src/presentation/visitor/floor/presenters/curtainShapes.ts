import type { CurtainShape } from "#/presentation/visitor/floor/presenters/curtainPaths.ts";

/** A room's curtain on desktop (230 × 270); on a phone, enlarged 1.56 times. */
export const roomCurtain: CurtainShape = {
    width: 230,
    height: 270,
    folds: 15,
    swags: 3,
    drop: 20,
    hem: 261,
};

/** A room not published, on a phone: a short band (358 × 100). */
export const bandCurtain: CurtainShape = {
    width: 358,
    height: 100,
    folds: 29,
    swags: 5,
    drop: 16,
    hem: 90,
};

/**
 * A floor not written yet (closed floor handoff): one curtain across its one
 * room on desktop (950 × 270, from x 126 to 1076).
 */
export const closedFloorCurtain: CurtainShape = {
    width: 950,
    height: 270,
    folds: 61,
    swags: 12,
    drop: 20,
    hem: 261,
};
