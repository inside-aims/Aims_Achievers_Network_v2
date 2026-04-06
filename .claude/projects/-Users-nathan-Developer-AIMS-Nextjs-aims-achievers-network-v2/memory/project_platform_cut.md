---
name: platformCutPercent is admin-only
description: The platform commission rate is set by platform admins, never by organizers
type: project
---

`platformCutPercent` on events is set automatically from a platform-level default when an event is created. Organizers cannot view or modify it. Only platform admins can change the default rate.

**Why:** Revenue split is a business-level decision (e.g. 10% to platform, 90% to organizer). Organizers should not be able to set their own rate.

**How to apply:** Never expose `platformCutPercent` in organizer-facing mutations (create event, update event). Read it from a platform config singleton on event creation. Provide an admin-only mutation to change the platform default.
