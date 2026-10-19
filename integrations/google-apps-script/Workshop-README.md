# Workshop registration

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
