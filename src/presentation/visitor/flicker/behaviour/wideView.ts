/**
 * The plate's wide view (phone): the plate fills the screen, sideways, like a
 * video. Offered below 768px and on a touch screen held sideways with little
 * height. Real full screen and a landscape lock are attempts only: where the
 * browser refuses (an iPhone), the fixed layer and the "turn your phone" prompt
 * do the work. The lantern's state is kept throughout.
 */
const offered =
    "(max-width: 47.99rem), (pointer: coarse) and (max-height: 520px)";
const wideBox = "26 8 772 292";
const pageBox = "0 0 880 300";

interface Lockable {
    lock?: (orientation: "landscape") => Promise<void>;
    unlock?: () => void;
}

function sceneOf(plate: HTMLElement): Element | null {
    return plate.querySelector("[data-scene]");
}

function setWide(plate: HTMLElement, state: string | null): void {
    const { dataset } = plate;
    if (state === null) {
        delete dataset["wide"];
    } else {
        dataset["wide"] = state;
    }
    document.documentElement.classList.toggle("is-locked", state !== null);
}

/** Asks for full screen, then for the landscape lock; refusals are fine. */
async function askFullScreen(plate: HTMLElement): Promise<void> {
    try {
        await plate.requestFullscreen({ navigationUI: "hide" });
        const orientation: Lockable = screen.orientation;
        await orientation.lock?.("landscape");
    } catch {
        // Refused (an iPhone, a desktop): the fixed layer stays.
    }
}

function open(plate: HTMLElement): void {
    sceneOf(plate)?.setAttribute("viewBox", wideBox);
    setWide(plate, "on");
    void askFullScreen(plate);
}

function close(plate: HTMLElement): void {
    sceneOf(plate)?.setAttribute("viewBox", pageBox);
    setWide(plate, null);
    const orientation: Lockable = screen.orientation;
    orientation.unlock?.();
    if (document.fullscreenElement !== null) {
        void document.exitFullscreen().catch(() => null);
    }
}

export function initWideView(plate: HTMLElement): void {
    if (!matchMedia(offered).matches) {
        return;
    }
    const { dataset } = plate;
    dataset["wideOffered"] = "";
    wireButtons(plate);
    document.addEventListener("fullscreenchange", () => {
        if (
            document.fullscreenElement === null
            && plate.dataset["wide"] !== undefined
        ) {
            close(plate);
        }
    });
}

function wireButtons(plate: HTMLElement): void {
    plate.querySelector("[data-wide-open]")?.addEventListener("click", () => {
        open(plate);
    });
    plate.querySelector("[data-wide-close]")?.addEventListener("click", () => {
        close(plate);
    });
    plate.querySelector("[data-wide-manual]")?.addEventListener("click", () => {
        setWide(plate, "manual");
    });
}
