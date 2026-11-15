import { describe, expect, it } from "vitest";

import { isReplyAddress } from "#/domain/message/incoming.ts";
import {
    onFront,
    post,
    sent,
    turn,
    writeAnother,
} from "#/presentation/visitor/shared/message/state/messageState.ts";

const turned = turn(onFront);
const sending = post(turned, "studio@agency.com");

describe("a message's states", () => {
    it("starts on its front and turns to the writing side", () => {
        expect(onFront.phase).toBe("front");
        expect(turned).toEqual({
            phase: "writing",
            replyInvalid: false,
        });
    });

    it("sends only with an email to reply to", () => {
        expect(sending.phase).toBe("sending");
        expect(post(turned, "")).toEqual({
            phase: "writing",
            replyInvalid: true,
        });
        expect(post(turned, "studio@agency").replyInvalid).toBe(true);
    });

    it("cannot post from the front or while sending", () => {
        expect(post(onFront, "studio@agency.com")).toBe(onFront);
        expect(post(sending, "studio@agency.com")).toBe(sending);
    });

    it("is posted only when the send went through", () => {
        expect(sent(sending, true).phase).toBe("posted");
        expect(sent(sending, false).phase).toBe("failed");
    });

    it("never plays posted without a send in flight", () => {
        expect(sent(turned, true)).toBe(turned);
        expect(sent(onFront, true)).toBe(onFront);
    });

    it("can try again after a failure", () => {
        expect(post(sent(sending, false), "studio@agency.com").phase).toBe(
            "sending",
        );
    });

    it("writes another from posted only", () => {
        expect(writeAnother(sent(sending, true))).toEqual(turned);
        expect(writeAnother(sending)).toBe(sending);
    });
});

describe("an address to reply to", () => {
    it.each(["studio@agency.com", "  a.b@c.co  "])("accepts %s", (value) => {
        expect(isReplyAddress(value)).toBe(true);
    });

    it.each(["", "studio", "studio@", "@agency.com", "a b@c.co"])(
        "refuses %j",
        (value) => {
            expect(isReplyAddress(value)).toBe(false);
        },
    );
});
