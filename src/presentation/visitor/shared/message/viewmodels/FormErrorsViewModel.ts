/**
 * A form's two error sentences, the same on the postcard and the letter slot:
 * the "Reply to" address is missing or wrong; the message did not go through
 * (before the email link, the link's words, after it).
 */
export interface FormErrorsViewModel {
    readonly replyTo: string;
    readonly failed: readonly [string, string, string];
}
