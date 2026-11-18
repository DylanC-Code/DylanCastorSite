/**
 * Why a mail was not sent, without anything the visitor wrote: the step that
 * failed (Google's sign-in, or Gmail's send) and Google's answer status. The
 * form Worker puts it in its 502 answer, so DevTools tells the cause.
 */
export class SendFailure extends Error {
    readonly step: "token" | "gmail";
    readonly status: number;

    constructor(step: "token" | "gmail", status: number) {
        super(`${step} ${status}`);
        this.name = "SendFailure";
        this.step = step;
        this.status = status;
    }
}
