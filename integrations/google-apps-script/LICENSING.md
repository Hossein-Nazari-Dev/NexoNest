# Licensing deployment

Owner and sender: **nexonest.contact@gmail.com**. This is the account that must own/run the Apps Script deployment; `replyTo` does not change the actual sender.

## Current status

Google deployment version 6 is published on the existing URL; setup and owner key entry are complete. Live guest activation, RSA signature, unchanged trial end on retry and seven-day lease bounds passed. A configured portable package is built under `output/`; a complete installation ZIP is under `artifacts/Deployment/`. The user supplied screenshots of successful email sign-in and a running study in Rhino. New profile onboarding, live voucher/offline/expiry acceptance and public package release remain pending. Ordinary builds without service configuration disable Run/Resume. UI preview uses only a fake connector and remains available.

The desktop accepts a publisher-configured public HTTPS endpoint: either the existing Google `/exec` or an owned API facade. The thin gateway is implemented locally; the proposed `api.nexonest.com/v1/licensing` is not live. Keep the direct URL until hosting/TLS/DNS and acceptance are complete. See [[License Gateway]] and [[Developer Handbook]].

The website's `integrations/google-apps-script/` holds the deployment files. NexoSolve keeps a matching copy under `integrations/google-apps-script/` so server rules can run in local/CI tests. Keep both copies synchronized when changing the service.

Live inspection on 2026-10-09 found the actual backend uses `Users`, `ProductSubscriptions`, `Newsletter` and `NexoBreak`, rather than the older local `Subscribers` implementation. `Code.gs` was reconciled with that live source while preserving join/sync and newsletter consent routes. Do not deploy the old single-table source. The pre-change source snapshot is under ignored `artifacts/Deployment/Code.before.gs`.

Real keys were generated on this machine under ignored `.secrets/licensing/` during activation preparation. Reuse them; do not rerun generation or replace the signing identity. Server setup/key entry are complete; a secure key backup remains an owner task. See [[Live Activation]] for progress.

## Deploy using the existing newsletter service

1. Sign into Google as `nexonest.contact@gmail.com`. Open the existing newsletter spreadsheet and its bound Apps Script project. Preserve the spreadsheet and existing deployment URL.
2. Add `LicensingProfile.gs`, `Licensing.gs`, `LicensingAdmin.gs`, `LicensingSheet.gs` and `NewsletterDelivery.gs` to the same project first, then replace `Code.gs` with the reviewed integrated version. All six files belong to that project and are deployed together. `Code.gs` remains the only dispatcher; do not create another `doPost`.
3. In PowerShell 7, generate a signing key locally with `./scripts/New-LicenseKeys.ps1`. Keys are in ignored `.secrets/licensing/`; never upload them to GitHub or include the private key in application builds. Back up the private key securely. This command does not print the key.
4. In Apps Script Project Settings / Script properties, the owner sets `LICENSE_PRIVATE_KEY` to the contents of `private-property.txt` (single-line PEM with literal `\n`). This avoids line-break removal in single-line settings fields; the signing code restores the newlines. Raw multiline `private.pem` is also accepted. Run `setupLicensing` from the editor. It creates separate tables, a token secret and a newsletter reserve of 20. It sends no email.
5. Update the existing web-app deployment to the new version, executing as **Me**, with access **Anyone**. Verify the executing account is the owner above. The public API authenticates its own sessions; it does not require users to have Google accounts.
6. Set build variables in PowerShell, then publish:

```powershell
$env:NexoLicenseEndpoint = 'YOUR_EXISTING_APPS_SCRIPT_EXEC_URL'
$env:NexoLicensePublicKeyBase64 = [IO.File]::ReadAllText('.secrets/licensing/public-base64.txt').Trim()
./scripts/Publish-Study.ps1
```

Only the endpoint and public key are embedded in the desktop assembly. Changing the signing key requires a coordinated application update. Publishing refuses missing configuration. Preserve the current deployed key during routine server updates.

Transport has a 25-second request budget and 32-KiB response limit. Automatic redirects are disabled; the Google Content Service response redirect is followed only as a GET with no credential body. Other redirects fail.

## Access rules

- Guest: 14 days from first online registration of the device hash. Reinstalling the application does not reset the server record.
- Account trial: ends 90 days after that device's initial registration. Guest time is included. Signing in later does not create a new 90-day window.
- Email is verified using a six-digit code, valid for 10 minutes, with at most five guesses. Requests are limited to five per email and device per rolling day, with 60 seconds between requests. Gmail dot/plus aliases are normalized to the same mailbox.
- An email and device can each claim one trial. A different account on a used device can sign in and redeem a valid voucher, but receives no new trial.
- One active device per account. Logout does not reset trial history or release the binding.
- Account sessions last 180 days and can be revoked. No email is sent for normal license refreshes.
- Six-month/year grants use calendar months with month-end clamping. Vouchers start a license immediately during trial; new grants extend an existing license's end.
- Signed offline leases last at most seven days and never exceed the entitlement's end. Online refresh occurs at startup and every five minutes. Run/Resume can reuse a successful check from the last five minutes while access remains valid; otherwise it refreshes. A failed network check with valid offline access is reused for one minute so Resume does not repeat a just-failed startup request. Explicit Check license always refreshes. Network failures preserve a valid lease; explicit server denials clear it.
- Expiration saves the current case and pauses before the next case; rest intervals check access each second. Results and backups remain accessible.

## Account flow

Email → six-digit code → display name and unchecked optional newsletter choice → account overview. Returning sessions skip the email/code form. Existing accounts without a profile see the name/consent step once. Display names are not unique login names; email remains identity. Vouchers appear only after signed-in profile completion. The header updates from the signed name and clears on sign-out.

`profile` requires the existing device-bound session and accepts `displayName` (2–80 characters) and boolean `newsletterOptIn`. It returns the normal signed lease with additive `displayName`, `profileComplete`, `newsletterOptIn` fields, keeping schema 1 and trial history. Old clients remain compatible. Client account mutations are serialized and persist verified session/lease together. A valid offline lease shows a neutral notice separately from study errors; online recovery removes that notice.

Newsletter consent is recorded only on first profile completion. Opt-in uses the already-verified email, sends no second confirmation email, and preserves existing demographics. Retrying or editing a name cannot resubscribe an opted-out reader. An unchecked choice does not remove an existing website subscription. The signed flag is the initial choice, not current delivery status. Contact support to change preferences; a dedicated unsubscribe flow is not implemented.

Keep OTP for now: the saved 180-day session survives application restarts, and normal checks use no email. Passwords would need secure adaptive hashing, recovery and additional abuse controls; do not store a fast SHA/HMAC password digest in Sheets.

## Administration

Use private editor functions or wrappers run manually as the owner; no administrative operation is exposed by the web API. Example wrappers:

```javascript
function issueCourseVouchers() {
  const codes = createLicenseVouchers(6, 20, '2027-01-01T00:00:00Z', 'Course A');
  // Copy these codes securely for distribution. Only their hashes are stored.
  console.log(codes.join('\n'));
}
function grantParticipant() { grantLicense('participant@example.com', 12); }
function disableParticipant() { disableLicenseAccount('participant@example.com', true); }
function transferParticipant() { console.log(releaseLicenseDevice('participant@example.com')); }
```

For revocation, call `revokeLicenseGrant('Licenses', grantId)` or `revokeLicenseGrant('Vouchers', voucherHash)` using the relevant table's Key. Disabling an account blocks all its grants online. Offline revocation takes effect when the device checks online or its lease expires.

Device release revokes sessions and returns the earliest reactivation date. A new device cannot bind before the last issued offline lease expires, preventing two simultaneously valid device activations. Trial history and purchased/voucher expiry are preserved. Transfers can therefore require up to seven days.

## Newsletter capacity

The existing `sendNexoBreakAnnouncement` editor entry point now processes a resumable batch. It checks `MailApp.getRemainingDailyQuota()` before each send and leaves `NEWSLETTER_EMAIL_RESERVE` (default 20) for sign-in/confirmation emails. Each batch runs for approximately five seconds, excluding the final in-flight send. Run the entry point again on a suitable day to continue; no automatic schedule is installed.

`License_NewsletterDeliveries` stores campaign/email hashes with `sending`, `sent` or `review`. A reserved or ambiguous delivery is never automatically retried. Inspect it manually before deciding to retry. Exactly-once delivery cannot be guaranteed across Google email and Sheets operations, so ambiguous sends favor avoiding duplicates. A future campaign needs a new campaign identifier.

Newsletter membership remains opt-in and independent of software accounts. Guest activation, license refresh and voucher redemption send no emails.

## Verification

```powershell
node tests/licensing/service.test.cjs
./scripts/Test-Study.ps1 -UiPreview
```

Before distributing a licensed build, verify with controlled email addresses: guest activation, code delivery/expiry, login, second email on a used device, second-device rejection, voucher redemption/retry, offline startup, expiry during a study, results access and newsletter confirmation. Live tests and real email sends are separate from local mock tests.

## Limits

Windows MachineGuid is hashed with a product prefix; raw identifiers are not transmitted. It is an installation identity, not an immutable hardware fingerprint. Windows reinstall, cloned machines, registry changes or a modified client can bypass or collide with it. Local session/lease files use Windows user-bound DPAPI and atomic replacement. Hashing is pseudonymization, not anonymity; explain email/device/history collection to users.

Apps Script/Sheets is intentionally an early-stage service. Table lookups are linear, quotas are shared by the executing Google account, and public requests can exhaust execution capacity. Per-email/device limits are basic abuse controls, not a replacement for an edge rate limiter. There is no payment integration. Sheets operations across multiple rows are not transactional; consumed vouchers are the authoritative grant in one row, and retrying the same voucher does not extend it again.

Google references: [Quotas](https://developers.google.com/apps-script/guides/services/quotas), [Mail quota](https://developers.google.com/apps-script/reference/mail/mail-app#getRemainingDailyQuota()), [RSA signing](https://developers.google.com/apps-script/reference/utilities/utilities#computeRsaSha256Signature(String,String,Charset)), [web-app deployment](https://developers.google.com/apps-script/guides/web).

## Spreadsheet administration (2026-10-09)

Run `setupLicenseAdminSheet` from the existing bound editor as `nexonest.contact@gmail.com`. Reopen the spreadsheet. **AS_nexosolve** replaces the generated License_Admin tab in place; it shows six columns: Name, Email, Status, Access, Expires (UTC), Device. The **NexoSolve Admin** menu operates on one selected account row. View edits never mutate licenses and Refresh accounts overwrites them.

Technical `License_*` ledgers retain their existing names/contracts and are hidden by setup. The menu can show/hide them for maintenance. They currently belong exclusively to NexoSolve; the shared newsletter campaign ledger is independent. Future products need their own AS_<product> view and separate authority/storage namespace; they are not already supported by this API. Newsletter/Game Club sheets remain intact.

- **Activate license now / 6 or 12 months:** immediately grants access to the selected enabled account without a code or email. A trial does not delay the paid start; an existing paid period is extended.
- **Vouchers / Selected account / 6 or 12 months:** creates one code bound to the selected registered email/account. Copy the code from the dialog and give it to that participant. Another account cannot redeem it. Creation alone does not activate a license.
- **Vouchers / Course codes / 6 or 12 months:** enter only the count (1–100). Each generated code is single-use and redeemable by one signed-in participant. No campaign or date entry is required. Both voucher types must be redeemed within one calendar year; their 6/12-month license starts on redemption. Raw codes are shown once and cannot be recovered from the hash ledger. No automatic email is sent.
- **Repair sign-in:** invalidates all sessions and outstanding codes; keeps profile/trial/grants/binding. Ask for a fresh email code afterward. Existing resend/day limits remain.
- **Disable/enable:** changes online account access; does not reset its trial.
- **Transfer to another device:** revokes sessions and waits for the previously issued offline lease to expire. Repeating transfer never shortens that wait.
- **Delete all NexoSolve account records:** owner-only permanent erasure. Type the exact email and confirm the irreversible operation. Removes the account, its product grants, consumed/assigned vouchers, sessions/codes, related rates/events and device-trial records. This permits a fresh trial/account. Independent newsletter and other product records remain. If the device has another account's history, deletion stops before removing anything. An interrupted deletion disables the account and retains the device deletion plan for retry; Sheets is not transactional. No identifying audit row is recreated after erasure. This supersedes logical profile deletion as the user-facing delete operation; the old helper is retained for compatibility only.

Existing signed offline leases cannot be recalled; a deleted/disabled account's previous local lease may last up to seven days. A local cache is not remotely deleted by this command. Do not manually delete ledger rows or distribute the private backing spreadsheet as a participant portal. Actions require both active and effective owner identity; there are no public administrative API routes.

## Activation and offline access

User voucher entry requires an online server check. Assignment restricts who can redeem; redemption stores the product entitlement end in the server ledger and returns a signed lease containing the same end to the desktop. The local lease is DPAPI-protected and RSA-verified, so changing its expiration invalidates the signature immediately. It permits offline use for at most seven days, capped by license expiration. Connect at least once within that window to renew it. The desktop checks at startup/every five minutes when running; failed networking preserves valid offline access. The sheet displays the authoritative expiration in UTC; the desktop displays local time.

The account dialog shows an animated progress bar and action-specific connection status above the form. Connection/timeout errors use bold red text in a contrasting panel and give a retry step. A failed save keeps the entered name/consent for retry. The transport has a 25-second total request budget. Progress is hidden when the operation ends.

Local mocks cover assignment, erasure/retry/isolation, admin rename, credential invalidation, owner guards and no implicit mail. Desktop preview tests cover pending and timeout/retry states. Live setup and controlled acceptance evidence are recorded in [[Live Activation]].

## Sign-in mail recovery (2026-10-09)

Sign-in mail has an HTML card, embedded NexoSolve logo, selectable six-digit code and plain-text fallback. No JavaScript copy button, remote tracking images or Gmail mailbox-read scope is added. MailApp acceptance is not proof of inbox delivery.

The desktop sends a random challenge before waiting for a response and retries transport/temporary service failure once with the same challenge. The server binds that challenge to mailbox/device and returns the existing status without consuming another quota or sending again. LoginCodes stores only the code digest, createdAt and accepted/unknown delivery status. Unknown provider/write outcomes never trigger automatic resend. The code view remains available if a response is lost; the user can enter an arrived code, or request a fresh one after the 60-second countdown. Daily five-code limit and minute cooldown are distinct errors. New server fields are additive; old clients still work. Deploy the new server before distributing the new recovery client.

Fresh requests require capacity and both mailbox/device rate checks before either counter advances. Unknown sends conservatively consume an attempt to avoid duplicate mail/abuse. Same-request retries bypass the send limits. No Sent-folder polling: it requires broader mailbox access and does not establish recipient delivery.

Local tests use fake mail and simulate accepted/lost/ambiguous outcomes. Live rendering, real inbox delivery and a user-observed slow-response retry remain acceptance tasks.

Automatic admin view refresh (2026-10-10): successful email verification, profile save and voucher redemption rebuild AS_nexosolve under the existing script lock. Owner mutations also refresh it before releasing the lock, including partial failures. The internal renderer is not a public API action and does not bypass owner checks on menu commands. Guest/check/send-code requests do not rebuild the view. Rendering failures log a generic diagnostic and preserve authoritative activation success; Refresh accounts remains the repair command. Normalized email keys retain one account. Full-view rebuild is intentional for the current small ledger; revisit if account volume causes latency. Server-only change; no desktop rebuild required. Local mock tests cover anonymous registration, profile updates, duplicate email, voucher access, deletion, disable and view-write failure recovery. No live email or account mutation was performed.

Trial-denial clarity and progress presentation (2026-10-10): server schema 1 adds an optional signed reason. device_trial_used identifies a denied account trial when the device trial belongs to another account; no other mailbox is exposed. Allowed paid/voucher access clears the reason. Old leases remain readable and old clients ignore it. Desktop access messages are separate from operation notices: profile-save success cannot replace the persistent trial denial in the account license card or main footer. Denied trials omit the misleading immediate expiry date. Busy feedback uses a full-width rounded card and indeterminate progress bar. OTP email uses the light-blue product palette without changing send quotas or permissions. Local mock acceptance covers denial/profile/voucher transitions; live mail and authenticated acceptance remain separate.

## Short-duration licenses and proposed Iran prices (2026-10-10)


Local Apps Script source and owner menu now support 1/3/6/12-month grants, assigned vouchers and course codes. Paid renewal accumulates the latest unrevoked paid end independently of a longer trial; access still uses the later trial/paid end. Calendar clamping, idempotent redemption, one-year menu redemption deadline and trial dates are unchanged. Local server regressions pass. No live grants/codes, service deployment, mail, app rebuild or version change. Iran list/Beta price proposals and manual course/academic rules are in the NexoSolve licensing runbook and the existing Sheet's NexoSolve_Pricing catalog; they do not configure checkout or server pricing. Live menu/service acceptance is pending. See NexoSolve ADR-049.

