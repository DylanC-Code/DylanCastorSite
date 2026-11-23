# presentation/visitor/shared/topic

The parts every topic page of a floor shares (the flicker page, the check
page): the head with its way back, a street stop (a title, a text with its key
phrases, a scene slot, left or right), the text in two versions, the details
cabinet, the ask with the gentleman posting a letter, and the visitor's path
(the agency wording, the ask's link).

Accepts: a `TopicHeadViewModel`, a `StreetTextViewModel`, a
`DetailsCabinetViewModel` with any number of drawers (the cabinet is as wide
as they need, each drawer keeping its size), a `TopicAskViewModel` with the
page's own question.

Refuses: a page's plate and its scenes, which stay in the page's own folder.
