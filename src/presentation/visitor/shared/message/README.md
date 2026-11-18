# presentation/visitor/shared/message

A message written on the page and sent from it: the agencies postcard and the
brands letter slot share its states and its one sending function.

Accepts: `messageState.ts` (front, writing, sending, posted or failed, with
"Reply to" checked), `sendMessage()`, `NoScriptEmail.astro`, and `DataLine.astro`: the one small
"How your data is used" link every form shows under it.

Refuses: any other markup or motion (each page draws its own paper), and any way of
sending other than `sendMessage()`, which posts to the form Worker
(`/api/message`). Without script a form cannot send: `NoScriptEmail.astro`
shows "Email me at" the address in its place.
