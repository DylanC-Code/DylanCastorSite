# presentation/visitor/shared/message

A message written on the page and sent from it: the agencies postcard and the
brands letter slot share its states and its one sending function.

Accepts: `messageState.ts` (front, writing, sending, posted or failed, with
"Reply to" checked), `sendMessage()`, and `DataLine.astro`: the one small
"How your data is used" link every form shows under it.

Refuses: any other markup or motion (each page draws its own paper), and any way of
sending other than `sendMessage()`. Sending is not wired yet: it always
answers "failed", so nothing ever claims a message was sent.
