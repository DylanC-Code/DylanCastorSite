# interfaces/form_worker

The form Worker: the Cloudflare Worker on `dylancastor.com/api/message` that
both forms (the agencies postcard, the brands letter slot) post to. The only
part of the site that does not run in the cluster (launch decisions, section 2).

Accepts: a JSON POST from the site's own pages, `{ message, replyTo, from,
website, writingMs }`. It runs the robot checks (`domain/message/`), the
per-visitor limit (Cloudflare's rate limiter), then sends one mail through the
Gmail API (`infrastructure/message/gmail/`) as Dylan's Workspace inbox, to it
only, the visitor in Reply-To. Answers: 204 sent, 400 refused, 429 over the
limit, 502 not sent, its `x-send-failure` header naming the step ("token
401", "gmail 403", or "setup" for an unreadable key); the page shows its one
failure sentence for each refusal.

Refuses: posts from another site, storing or logging anything a visitor typed,
sending to any address but the binding's one inbox, any copy to the visitor,
and any DNS or mail record change (none is needed).

Config: `wrangler.jsonc` at the repo's root, and three secrets set in the
Worker's settings, never in the repo: `GOOGLE_CLIENT_EMAIL` and
`GOOGLE_PRIVATE_KEY` (a service account allowed, by domain-wide delegation,
the Gmail send scope only) and `INBOX` (Dylan's Workspace address). `bun run worker:bundle` builds it
without deploying (part of `bun run check`); `bun run worker:deploy` deploys
it, only with Dylan's OK.
