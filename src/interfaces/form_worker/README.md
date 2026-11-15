# interfaces/form_worker

The form Worker: the Cloudflare Worker on `dylancastor.com/api/message` that
both forms (the agencies postcard, the brands letter slot) post to. The only
part of the site that does not run in the cluster (launch decisions, section 2).

Accepts: a JSON POST from the site's own pages, `{ message, replyTo, from,
website, writingMs }`. It runs the robot checks (`domain/message/`), the
per-visitor limit (Cloudflare's rate limiter), then sends one mail through the
send binding (`infrastructure/message/cloudflare_email/`) to Dylan's inbox
only, the visitor in Reply-To. Answers: 204 sent, 400 refused, 429 over the
limit, 502 not sent; the page shows its one failure sentence for each refusal.

Refuses: posts from another site, storing or logging anything a visitor typed,
sending to any address but the binding's one inbox, any copy to the visitor,
and any DNS or mail record change (none is needed).

Config: `wrangler.jsonc` at the repo's root. `bun run worker:bundle` builds it
without deploying (part of `bun run check`); `bun run worker:deploy` deploys
it, only with Dylan's OK.
