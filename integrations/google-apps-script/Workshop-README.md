# Workshop registration

## Request identity and recovery — local revision 2026-11-08

This local revision changes `Workshop.gs` and `js/workshop.js`; it is not a new
Apps Script deployment. The page's endpoint remains empty and registration stays
disabled. The site's existing `Code.gs` dispatcher continues to own
`service=workshop`; do not replace it with another checkout's dispatcher.

The existing script lock owns validation, duplicate lookup, receipt storage and
row append. A new row appends a SHA-256 fingerprint in hidden column 25, after
the original 24 columns. Their order, Persian headers and meanings are unchanged;
the owner console and existing review code continue to read the original columns.
The first new accepted submission adds the fingerprint header, inserting a column
if necessary. An unexpected existing column-25 header rejects the submission
instead of overwriting it. This is additive metadata, not a rewrite of old rows.

The versioned fingerprint includes the resolved cohort, validated and normalized
name/email/phone, education and experience, registration type, **server-calculated
effective fee**, applicable university or newsletter code, certificate, publication
consent, accepted rules version/consents, and the validated receipt MIME type and
content SHA-256. Trimming, email case, equivalent phone digits, receipt filename,
irrelevant conditional fields and a client-supplied fee do not change this identity.
The digest is computed on the server; a client hash is never trusted.

The same UUID and fingerprint return the original tracking/email status before
checking whether enrollment is now closed, without another receipt, row or email.
A different fingerprint returns `request_conflict`: the changed form has **not**
been accepted. Old rows without a fingerprint return
`request_identity_unverified` and require owner-assisted recovery of the original
tracking code. The server does not guess the old receipt or submission identity,
backfill fingerprints, modify the original row, or automatically enroll again.

After a transmission starts, the browser keeps an exact payload snapshot in memory.
While sending and after an uncertain outcome, form inputs are locked; retry sends
that same snapshot and UUID. A definitive pre-storage `request_rejected` unlocks
the original inputs only if there was no earlier uncertain attempt. A conflict or
unverifiable legacy identity shows an explicit unsaved-change/support message,
never the success panel. No UUID is silently rotated after uncertainty. Reloading
loses the in-memory snapshot and selected file; only the existing UUID is retained
in session storage, so changed reload submissions may require support rather than
being reported as an earlier success. No personal values or receipt are persisted
in browser storage.

`request_unknown` means storage may have started; the browser must retain its
snapshot. If append succeeded but its acknowledgement failed, retry returns the
stored row. A receipt created before a failed/uncertain append can remain an orphan
for owner reconciliation, as before. A pending or unknown email is not retried
automatically, and MailApp acceptance does not establish inbox delivery.

Current checks: `node scripts/test-workshop.cjs` passes 27 mocked backend checks,
including changed email/type/effective fee/receipt, normalized replay, closed
enrollment, unknown append/mail, legacy rows and overlapping lock admission.
`node scripts/test-workshop-browser.cjs` checks the disabled real endpoint and
mocked keyboard submission, uncertain snapshot recovery, repeat-click admission,
conflict feedback and input preservation after a definitive rejection. Neither
test sends real mail or verifies a deployed Google service.

## Management console integration - 2026-10-19

Deployed as version 17 on 2026-10-19 with explicit user approval. The source set contains LicensingProducts.gs, WorkshopCatalog.gs, AdminConsole.gs and AdminConsoleView.html, and update Licensing.gs, LicensingAdmin.gs, LicensingProfile.gs, LicensingSheet.gs and Workshop.gs together. Preserve Code.gs and all other service modules, properties and existing data. The unified NexoNest Admin menu opens the owner-only console. Shared-device deletion is scoped to selected accounts, with other users' limits retained. Separate product/cohort registries preserve the existing NexoSolve and workshop defaults. Course review in the console does not email or grant benefits. See [ADMIN.md](ADMIN.md) for configuration, exact contracts, tests and rollback. The older menu instructions below are historical; use the console for new administration.


Local implementation; not deployed or live-tested. All participant-facing copy
and the workshop admin menu are Persian. No enrollment/payment should be solicited
until the checks below pass.

Verified on 2026-10-15: the business-account private receipt folder exists, and
the existing main workbook now has `Workshop_Registrations` (sheet ID 31006),
24 Persian headers, a frozen header, RTL layout, a filter, and owner-only edit
protection. Header values and formats were read back through the connector.
No participant records or live emails were created. Browser visual verification
was blocked by the browser tool's local-URL policy; layout remains unverified.
Twenty mocked backend checks passed, including retries, fees, receipt validation,
owner authorization, approval/rejection and uncertain email outcomes.

1. Sign in as `nexonest.contact@gmail.com`. Open the existing bound Apps Script
   project from the confirmed Subscribers workbook.
2. Upload `Workshop.gs`, the updated `Code.gs` dispatcher and `LicensingSheet.gs`
   menu integration. Preserve all other service modules. There must be one
   `doPost` and one `onOpen`.
3. Run `setupWorkshop` as the business account. This only creates the dedicated
   `Workshop_Registrations` tab when absent, with Persian headers. Reopen the
   spreadsheet to see the Persian workshop menu.
4. Set script property `WORKSHOP_VIDEO_URL` to the approved HTTPS preparation video
   when ready. An absent value produces a truthful pending-guide message.
5. Deploy a new version of the existing web app, executing as the business owner.
   Keep `WORKSHOP_ENABLED` absent/false until ready for authorized acceptance.
6. For an explicitly authorized test, set `WORKSHOP_ENABLED=true`, configure the
   page's `workshop-endpoint`, and test one controlled registration, retry with the
   same request id, receipt privacy, and approval. Verify email sender/delivery
   with a consenting test address. Local mocked tests do not verify Google OAuth,
   scopes, browser CORS, redirects, execution quotas, or delivery.
7. Enable registration and add the sitemap entry only after acceptance.
   The checkout leaves the endpoint empty and the page noindexed. The NexoNest catalogue links to the workshop information page; submission remains disabled.

## Current cohort content (2026-10-16)

Deploy browser and backend consent version `2026-10-v3` together; older requests
are rejected and must reload. Workshop: 7–8 Aban 1405, 17:00–21:00 Tehran;
critique: 12 Aban, 17:00–21:00; final project: 15 Aban, exact hour/channel pending.
Approval email includes these dates. Attendance certificates are electronic
without online verification. Completion requires a submitted project scoring
strictly above 70/100 plus at least 10/20 in each of five stages and supports online verification; otherwise attendees
receive attendance certification only. Certificate issuance and verification
are not implemented by this registration module. No live deployment is implied.

## Administration

Select exactly one populated row in `Workshop_Registrations`. The Persian menu
provides approve/reject actions. Check receipt, amount, student eligibility, and
newsletter code before approving. A review note is required. Admin functions
reject all active users except the business account and are not API routes.
Changing a status cell manually does not send an email; use the menu. Do not sort
or edit the table during a review operation. Protect this sheet from other editors.

Email cells `pending`, `unknown`, and `accepted` are operational states. `accepted`
means MailApp returned; it does not prove delivery. Inspect Sent mail and the
recipient before manually recovering an `unknown` outcome. No automatic retries
are provided. A rejected request is retained and receives no automatic email.

No new newsletter subscription, account creation, license grant, or public receipt
sharing occurs. A single email can submit once in this cohort. Use a fresh cohort
identifier/table and rules version before reusing the workflow for another course.
The hard limits (30 new requests/day, 150 total) bound abuse but are not CAPTCHA;
verify anti-bot protection before broad promotion. Payment receipts are not scanned
for malicious content; open only in a safe viewer. Retention/refund policy requires
an owner decision before launch.
