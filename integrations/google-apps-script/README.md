# NexoNest license service

Deploy these seven core files together in the existing bound **NexoNest Subscriber Backend** project:

| File | Responsibility |
|---|---|
| `Code.gs` | Existing newsletter/Game Club routes and minimal license dispatch |
| `Licensing.gs` | License API, storage helpers, trial/session rules and signed leases |
| `LicensingProfile.gs` | Verified display-name onboarding and explicit optional newsletter consent |
| `LicensingAdmin.gs` | Owner-only editor operations for vouchers, grants, revocation and transfer |
| `LicensingSheet.gs` | Readable owner-only account view and spreadsheet administration menu |
| `PublicEmail.gs` | Public mail limits, verified Game Club join/restore and signed newsletter unsubscribe |
| `NewsletterDelivery.gs` | Quota reserve, campaign ledger and resumable delivery |

There is one `doPost` and one `doGet`, both in `Code.gs`. Apps Script files share project scope; this is a responsibility split, not ES module loading. Private helpers end in `_`; administrative entry points are not API actions and check active/effective owner identity.

All email paths use send-only `MailApp`; this integration needs no inbox access. Google may require the owner to authorize the project before setup or deployment.

Add companion files before replacing `Code.gs`, then update the existing deployment version without changing its URL/account/access. Preserve the original newsletter/Game Club tables. Never create a new competing dispatcher or paste a signing key into code.

Set `LICENSE_PRIVATE_KEY` from ignored `.secrets/licensing/private-property.txt` (single-line PEM with escaped newlines) using the owner's private settings. Raw multiline PEM is also accepted. Do not rotate existing keys during updates. Run `setupLicensing` to initialize separate tables/token secret without sending email. See `Documents/05 Operations/Licensing.md` and `Live Activation.md` in NexoSolve for deployment state and controlled acceptance.

Run `node tests/licensing/service.test.cjs` from NexoSolve. The external test loader must include PublicEmail.gs and exercise the new verified Game Club contract; this local change does not update that external checkout. From NexoNest run node scripts/test-public-email.cjs and node scripts/test-workshop.cjs. These use mocked services and send no real email. Keep the NexoNest repository's deployment copies synchronized.

Run `setupLicenseAdminSheet` once from the bound editor, then reopen the spreadsheet. Use the **NexoSolve Admin** menu; select one account row in `AS_nexosolve`. This view is regenerated, so direct edits do not change the ledger. See the licensing runbook for recovery semantics.


Setup renames only the old generated License_Admin view; existing License_* storage contracts remain stable and technical tables are hidden. Voucher menus create course batches with only a count or one account-bound code; erasure is owner-only and product-specific. No real account deletion is included in setup.


## Sign-in mail recovery (2026-10-09)

Sign-in mail has an HTML card, embedded NexoSolve logo, selectable six-digit code and plain-text fallback. No JavaScript copy button, remote tracking images or Gmail mailbox-read scope is added. MailApp acceptance is not proof of inbox delivery.

The desktop sends a random challenge before waiting for a response and retries transport/temporary service failure once with the same challenge. The server binds that challenge to mailbox/device and returns the existing status without consuming another quota or sending again. LoginCodes stores only the code digest, createdAt and accepted/unknown delivery status. Unknown provider/write outcomes never trigger automatic resend. The code view remains available if a response is lost; the user can enter an arrived code, or request a fresh one after the 60-second countdown. Daily five-code limit and minute cooldown are distinct errors. New server fields are additive; old clients still work. Deploy the new server before distributing the new recovery client.

Fresh requests require capacity and both mailbox/device rate checks before either counter advances. Unknown sends conservatively consume an attempt to avoid duplicate mail/abuse. Same-request retries bypass the send limits. No Sent-folder polling: it requires broader mailbox access and does not establish recipient delivery.

Local tests use fake mail and simulate accepted/lost/ambiguous outcomes. Live rendering, real inbox delivery and a user-observed slow-response retry remain acceptance tasks.

Automatic admin view refresh (2026-10-10): successful email verification, profile save and voucher redemption rebuild AS_nexosolve under the existing script lock. Owner mutations also refresh it before releasing the lock, including partial failures. The internal renderer is not a public API action and does not bypass owner checks on menu commands. Guest/check/send-code requests do not rebuild the view. Rendering failures log a generic diagnostic and preserve authoritative activation success; Refresh accounts remains the repair command. Normalized email keys retain one account. Full-view rebuild is intentional for the current small ledger; revisit if account volume causes latency. Server-only change; no desktop rebuild required. Local mock tests cover anonymous registration, profile updates, duplicate email, voucher access, deletion, disable and view-write failure recovery. No live email or account mutation was performed.

Trial-denial clarity and progress presentation (2026-10-10): server schema 1 adds an optional signed reason. device_trial_used identifies a denied account trial when the device trial belongs to another account; no other mailbox is exposed. Allowed paid/voucher access clears the reason. Old leases remain readable and old clients ignore it. Desktop access messages are separate from operation notices: profile-save success cannot replace the persistent trial denial in the account license card or main footer. Denied trials omit the misleading immediate expiry date. Busy feedback uses a full-width rounded card and indeterminate progress bar. OTP email uses the light-blue product palette without changing send quotas or permissions. Local mock acceptance covers denial/profile/voucher transitions; live mail and authenticated acceptance remain separate.

## Short-duration licenses and proposed Iran prices (2026-10-10)


Local Apps Script source and owner menu now support 1/3/6/12-month grants, assigned vouchers and course codes. Paid renewal accumulates the latest unrevoked paid end independently of a longer trial; access still uses the later trial/paid end. Calendar clamping, idempotent redemption, one-year menu redemption deadline and trial dates are unchanged. Local server regressions pass. No live grants/codes, service deployment, mail, app rebuild or version change. Iran list/Beta price proposals and manual course/academic rules are in the NexoSolve licensing runbook and the existing Sheet's NexoSolve_Pricing catalog; they do not configure checkout or server pricing. Live menu/service acceptance is pending. See NexoSolve ADR-049.


## Public email security update (2026-10-18, local source only)

PublicEmail.gs must be added before deploying Code.gs. Workshop.gs remains an
additional companion for the workshop route. Preserve the existing URL/owner and
all tables. PublicEmailState is created lazily; it stores hashed mailbox counters
and hashed Game Club codes. Defaults: three mail requests per mailbox/purpose per
rolling day, at least 60 seconds apart, 30 total public sends per rolling day via
PUBLIC_EMAIL_DAILY_LIMIT, and NEWSLETTER_EMAIL_RESERVE=20. These limits do not
replace edge protection. Unknown sends consume an attempt. No auto resend.

NexoBreak clients must implement nexobreak_request_code (email), then
nexobreak_join (email, displayName, consent=true, code). Codes last ten minutes,
allow five guesses and are single-use. Existing sync tokens/score fields remain
compatible. Old join/restore fails closed; coordinate the external client before
server rollout. Lost join responses may require a new code.

NexoNest Newsletter keeps newsletter.html. Pending retries preserve the original
confirmation link; expired requests renew in place. The frontend requires readable
JSON success and retains inputs on rejection/uncertainty. Verify deployed CORS and
redirect behavior separately; never interpret an opaque response as success.

Future confirmation/campaign emails include signed unsubscribe links. GET shows
a confirmation form; POST cancels pending/subscribed records and clears the
confirmation token. Preserve/back up NEWSLETTER_TOKEN_SECRET (created lazily).
Never rotate it casually. Campaign filtering and desktop consent respect opt-out.
Previously sent mail cannot be amended. Product/registration emails are separate.
No deployment, real email or live acceptance is claimed by this update.


## NexoBreak HTML verification email (2026-10-19)

GameClubEmail.gs is a required companion for Game Club code requests. It builds
transactional HTML with embedded CID logos derived from NexoNest assets/logo.svg
and NexoBreak artwork, six selectable digits, expiry/security copy and plain text.
New mail contains no scripts, tracking assets or copy link. Select the digits and
paste into any plug-in code box. The old stateless ?view=nexobreak-code helper
remains for already-delivered links only; it reads a URL fragment and cannot send
mail, access records, extend codes or sign in.

Authorized rollout advanced the existing service from version 12 to 13, then 14
using nexonest.contact@gmail.com with URL/account/access preserved. The owner
confirmed both test emails and HTML rendering. At the owner's request, version 15
removes the redirecting copy link. Source readback matched and deployment success
was verified. No third email or newsletter campaign was sent.
