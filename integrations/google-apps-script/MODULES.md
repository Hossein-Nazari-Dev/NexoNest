# NexoNest license service

Deploy these six files together in the existing bound **NexoNest Subscriber Backend** project:

| File | Responsibility |
|---|---|
| `Code.gs` | Existing newsletter/Game Club routes and minimal license dispatch |
| `Licensing.gs` | License API, storage helpers, trial/session rules and signed leases |
| `LicensingProfile.gs` | Verified display-name onboarding and explicit optional newsletter consent |
| `LicensingAdmin.gs` | Owner-only editor operations for vouchers, grants, revocation and transfer |
| `LicensingSheet.gs` | Readable owner-only account view and spreadsheet administration menu |
| `NewsletterDelivery.gs` | Quota reserve, campaign ledger and resumable delivery |

There is one `doPost` and one `doGet`, both in `Code.gs`. Apps Script files share project scope; this is a responsibility split, not ES module loading. Private helpers end in `_`; administrative entry points are not API actions and check active/effective owner identity.

All email paths use send-only `MailApp`; this integration needs no inbox access. Google may require the owner to authorize the project before setup or deployment.

Add companion files before replacing `Code.gs`, then update the existing deployment version without changing its URL/account/access. Preserve the original newsletter/Game Club tables. Never create a new competing dispatcher or paste a signing key into code.

Set `LICENSE_PRIVATE_KEY` from ignored `.secrets/licensing/private-property.txt` (single-line PEM with escaped newlines) using the owner's private settings. Raw multiline PEM is also accepted. Do not rotate existing keys during updates. Run `setupLicensing` to initialize separate tables/token secret without sending email. See `Documents/05 Operations/Licensing.md` and `Live Activation.md` in NexoSolve for deployment state and controlled acceptance.

Run `node tests/licensing/service.test.cjs` from NexoSolve. The test loads all six files together with mocked Google services, including existing join/sync/signup and signed-profile/consent regressions; it sends no real email. Keep the NexoNest repository's deployment copies synchronized.

Run `setupLicenseAdminSheet` once from the bound editor, then reopen the spreadsheet. Use the **NexoSolve Admin** menu; select one account row in `AS_nexosolve`. This view is regenerated, so direct edits do not change the ledger. See the licensing runbook for recovery semantics.


Setup renames only the old generated License_Admin view; existing License_* storage contracts remain stable and technical tables are hidden. Voucher menus create course batches with only a count or one account-bound code; erasure is owner-only and product-specific. No real account deletion is included in setup.


## Sign-in mail recovery (2026-10-09)

Sign-in mail has an HTML card, embedded NexoSolve logo, selectable six-digit code and plain-text fallback. No JavaScript copy button, remote tracking images or Gmail mailbox-read scope is added. MailApp acceptance is not proof of inbox delivery.

The desktop sends a random challenge before waiting for a response and retries transport/temporary service failure once with the same challenge. The server binds that challenge to mailbox/device and returns the existing status without consuming another quota or sending again. LoginCodes stores only the code digest, createdAt and accepted/unknown delivery status. Unknown provider/write outcomes never trigger automatic resend. The code view remains available if a response is lost; the user can enter an arrived code, or request a fresh one after the 60-second countdown. Daily five-code limit and minute cooldown are distinct errors. New server fields are additive; old clients still work. Deploy the new server before distributing the new recovery client.

Fresh requests require capacity and both mailbox/device rate checks before either counter advances. Unknown sends conservatively consume an attempt to avoid duplicate mail/abuse. Same-request retries bypass the send limits. No Sent-folder polling: it requires broader mailbox access and does not establish recipient delivery.

Local tests use fake mail and simulate accepted/lost/ambiguous outcomes. Live rendering, real inbox delivery and a user-observed slow-response retry remain acceptance tasks.
