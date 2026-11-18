import type { Mail } from "#/infrastructure/message/gmail/gmailMail.ts";
import {
    accessTokenFor,
    type GoogleAccount,
} from "#/infrastructure/message/gmail/googleAccess.ts";
import { rawOf } from "#/infrastructure/message/gmail/rawMessage.ts";
import { SendFailure } from "#/infrastructure/message/gmail/sendFailure.ts";

const sendUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

/**
 * Sends one mail through the Gmail API as Dylan's inbox: sign in, then one
 * send. Throws a SendFailure naming the step when Google says no.
 */
export async function sendWithGmail(
    mail: Mail,
    account: GoogleAccount,
    nowSeconds: number,
): Promise<void> {
    const token = await accessTokenFor(account, nowSeconds);
    const response = await fetch(sendUrl, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({ raw: rawOf(mail) }),
    });
    if (!response.ok) {
        throw new SendFailure("gmail", response.status);
    }
}
