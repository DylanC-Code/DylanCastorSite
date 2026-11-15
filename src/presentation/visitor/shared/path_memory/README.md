# presentation/visitor/shared/path_memory

Remembers, for the visit, which reading path's home the visitor came through
(agencies or brands), so a floor's "Write to me" leads to that home's own
closing ask and a topic speaks in that home's wording.

It is carried in the address (`?via=agencies`): a home adds it to its
internal links; floors and topics read it and pass it on.

Accepts: `carryPath(root, id)` on a reading path's home, `passPathOn(root)`
on a floor or a topic, `pointAsk(container)` and `cameFromAgencies()` where a
link or a wording depends on it.

Refuses: any storage on the device (no cookie, no local or session storage:
the legal notice promises none), and anything about the visitor beyond the
path's id. Without it, links keep their own target (the brands letter slot).
