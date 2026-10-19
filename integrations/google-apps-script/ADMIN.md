# NexoNest management console

## Scope and access

Open the bound spreadsheet as `nexonest.contact@gmail.com`, reload it and choose
**NexoNest Admin > Open management console**. The console is a large HTML dialog,
not a public admin URL. Every server entry checks both the active and effective
owner. No administration function is dispatched by `doGet` or `doPost`.

Sections: Overview, Accounts, Licenses, Vouchers, Courses, Registrations and
Products. Product selection scopes license operations; course selection scopes
registration review. Search, status filtering and pagination operate on the
owner snapshot. The current implementation targets modest spreadsheet datasets;
it is not a database-backed SaaS admin service.

## Product isolation

`LicensingProducts.gs` is required by the existing licensing files. NexoSolve
keeps its `License_*` tables, `AS_nexosolve` support view, `LICENSE_PRIVATE_KEY`
and `LICENSE_TOKEN_SECRET`. Its API product ID, schemas, GUIDs and existing
signatures remain unchanged. Its current 14/90-day trials, seven-day offline
lease and 3/6/12-month grants remain the shared licensing policy.

`Admin_Products` stores stable IDs, names and draft/active/paused status. New
products use `License_<id_with_underscores>_*`, `AS_<id>` and private Script
properties `LICENSE_<UPPERCASE_ID_WITH_UNDERSCORES>_PRIVATE_KEY` and
`LICENSE_<UPPERCASE_ID_WITH_UNDERSCORES>_TOKEN_SECRET`. Never put key material in
the console, source, logs or documentation. Configure an independently trusted
key and matching product-aware client before activating a new product. Adding a
catalog entry does not install or integrate a client. Pausing a product blocks
new server access requests; previously signed offline access can outlive it.

Catalog reads fall back to the existing NexoSolve product without migrating its
records. Selecting an empty product can initialize empty technical tables. A
product context is execution-local and always restored after calls or failures.
Unknown/draft/paused products cannot request public leases. Global admission
counters continue bounding the entire shared licensing service.

## Accounts and deletion

Account actions: grant access, disable/enable, repair sign-in, or release the
device after outstanding offline leases expire. Grant operations have a stable
ID: retry an unchanged form after uncertain delivery to avoid double extension.

Select up to 100 explicit accounts, then preview deletion. The preview lists
the selected emails and shared/exclusive device counts. Enter its exact typed
phrase to confirm. The server recomputes a fingerprint under the script lock;
changed relevant records reject the stale preview before any deletion.

Deleting one account removes its credentials, product grants, assigned/redeemed
vouchers, account events, account rate entries and pending owner operations.
Shared device/rate history and other accounts' sessions are retained. If the
deleted account owned the device trial marker, replace its reference with the
non-identifying `erased` marker, retaining the original trial/lease limits.
Exclusive device history is removed and can permit a fresh trial. Deleting all
selected accounts on a device removes its history only when no other account
or credential history still needs it. Newsletter, other product ledgers and
workshop registrations are outside account erasure scope.

Deletion is permanent, not transactional across Sheets rows. Credentials are
removed first; a disabled account retains its device plan until completion.
After an interrupted batch, refresh, review the remaining/disabled accounts and
preview again. Never auto-retry a permanent deletion using an obsolete preview.
Do not recreate an identifying audit event after erasure. Offline leases already
issued can remain valid until expiry. No real account is deleted by setup,
opening the console, publishing source or running the local tests.

## Vouchers

Issue 3, 6 or 12 months, 1â€“100 one-use codes, a UTC redemption deadline within
two years and optional course/campaign metadata. An account-bound issue requires
one verified enabled account and exactly one code. Codes activate on redemption;
renewals extend existing paid access. Revocation never revives a consumed code.

`Admin_Batches` retains immutable batch parameters and an opaque operation
fingerprint. Codes are derived with a product-scoped secret and operation ID;
only voucher hashes are stored. Retrying the unchanged open form reconstructs
the same batch after an uncertain write, without duplicating or reactivating
grants. A changed operation payload or token-secret version is rejected. Copy
codes securely before closing. Neither console snapshots nor audit logs return
raw codes. Account erasure also removes its bound batch metadata. Issuance and
review do not email codes or auto-grant course benefits.

## Courses and registrations

`WorkshopCatalog.gs` adds `Admin_Courses`; the current cohort is
`workshop-2026-10`, using the existing `Workshop_Registrations` table and
`2026-10-v3` consent. Requests omitting `courseId` retain this cohort. Preserve
the existing `WORKSHOP_ENABLED` switch; the console reports its separate gate
without enabling it automatically.

Each additional cohort receives `Workshop_<course-id>` with the original 24
headers, separate prices, rules version, request limits, schedule and optional
product/voucher benefit. Public forms must send the registered `courseId` and
matching `rulesVersion`; creating a cohort does not publish a landing page.
Unknown IDs fail without falling back to another course. Duplicate email and
request recovery are scoped to that cohort. Limits are total submitted requests
(1â€“150) and daily submissions (1â€“30), not a seat reservation/payment system.
Prices are server-calculated in toman; zero-priced enrollment needs no receipt.
Paid receipts retain the existing private Drive folder and file checks.

After a cohort receives registrations, its prices and consent version are
immutable; create a new cohort to change them. Review by tracking code and
revision, not a stale row number. Verify receipts and eligibility, then record
approve/reject with a note. **Save decision sends no email, certificate or
license.** Provider-accepted mail is distinct from delivered mail. The retained
legacy editor approval function sends an email and remains outside the new menu
and console; do not execute it during no-send work.

## Deployment and validation

Add `LicensingProducts.gs`, `WorkshopCatalog.gs`, `AdminConsole.gs` and
`AdminConsoleView.html`; update `Licensing.gs`, `LicensingAdmin.gs`,
`LicensingProfile.gs`, `LicensingSheet.gs` and `Workshop.gs` together. Preserve
the live `Code.gs`, PublicEmail, GameClubEmail, NewsletterDelivery, all private
properties, existing tables, endpoint, owner and access permissions. There is
still one `onOpen`, in LicensingSheet, and one public dispatcher, in Code.

The bound spreadsheet uses the saved project head for the console. Updating the
public licensing/workshop service additionally requires a new version on the
existing deployment. Version 16 is the pre-console rollback. Restoring public
version 16 does not restore the saved head/menu: restore the affected original
sources too if rolling back the bound console. No setup or live test mutation is
needed just to save/deploy these files.

Run `node tests/licensing/admin.test.cjs` (includes the licensing regression suite)
and `node tests/licensing/workshop.test.cjs` from NexoSolve. Run NexoNest's public
email/workshop tests after syncing companions. These use only mock Google/mail
services. `node scripts/Preview-AdminConsole.cjs` opens a loopback-only preview on
port 8768 using the actual console and real admin functions against synthetic
Sheets; it cannot access a Google account. Browser preview does not establish
production owner permissions, OAuth, mail delivery, private receipt access,
deployment success, client integration for another product or large-data scale.

### Verified rollout - 2026-10-19

User-authorized source save and existing deployment update completed as version
17 (Google displayed 7:08 PM). The endpoint and owner/access settings stayed
unchanged. The real bound console loaded owner aggregate data and the legacy
course; no production mutation or email test was run. Version 16 is the rollback
baseline; restore saved source separately to roll back the bound menu. The HTML
file is `AdminConsoleView.html`: Apps Script forbids the same basename for a
Script and HTML file. Local mutation mocks do not prove live deletion or mail
delivery.
