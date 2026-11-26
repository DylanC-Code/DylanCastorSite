import { checkTestPage } from "#/content/checkTestTopic.ts";
import { flickerPage } from "#/content/flickerTopic.ts";
import { floorHalls } from "#/content/floorHalls.ts";
import { floorsContent } from "#/content/floors.ts";
import { home } from "#/content/home.ts";
import { type PageMeta, topicMeta } from "#/content/pageMeta.ts";
import type { CheckTestPageViewModel } from "#/presentation/visitor/check_test/viewmodels/CheckTestPageViewModel.ts";
import type { FlickerPageViewModel } from "#/presentation/visitor/flicker/viewmodels/FlickerPageViewModel.ts";

/**
 * A floor's topic pages: one per published room, at its floor's href and the
 * room's slug (floor I: /shopify-cro/flicker-free-ab-tests and
 * /shopify-cro/checking-a-test-before-launch). Each room shows its written
 * page, or the placeholder until it is written.
 */
export interface TopicPath {
    readonly params: { floor: string; topic: string };
    readonly props: {
        floorId: string;
        area: string;
        name: string;
        roomId: string;
    };
}

interface Room {
    readonly floorId: string;
    readonly roomId: string;
    readonly name: string;
    readonly slug: string;
}

function pathOf(room: Room): TopicPath[] {
    const floor = floorsContent.floors.find((one) => one.id === room.floorId);
    return floor === undefined
        ? []
        : [
              {
                  params: { floor: floor.href.slice(1), topic: room.slug },
                  props: {
                      floorId: room.floorId,
                      area: floor.area,
                      name: room.name,
                      roomId: room.roomId,
                  },
              },
          ];
}

export function topicPaths(): TopicPath[] {
    return floorsContent.floors.flatMap((floor) =>
        (floorHalls[floor.id]?.rooms ?? []).flatMap((room) =>
            room.state === "open"
                ? pathOf({
                      floorId: floor.id,
                      roomId: room.id,
                      name: room.name,
                      slug: room.href.slice(floor.href.length + 1),
                  })
                : [],
        ),
    );
}

export type TopicPage =
    | { readonly kind: "flicker"; readonly page: FlickerPageViewModel }
    | { readonly kind: "check"; readonly page: CheckTestPageViewModel }
    | { readonly kind: "placeholder" };

export function topicPageOf(roomId: string): TopicPage {
    if (roomId === "flicker_free_tests") {
        return { kind: "flicker", page: flickerPage };
    }
    return roomId === "checking_a_test"
        ? { kind: "check", page: checkTestPage }
        : { kind: "placeholder" };
}

/** A written page's own words, or the room's name until it is written. */
export function topicMetaOf(roomId: string, name: string): PageMeta {
    return (
        topicMeta[roomId] ?? {
            title: `${name} · ${home.header.brand}`,
            description: name,
        }
    );
}
