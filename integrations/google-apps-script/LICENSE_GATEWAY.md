---
type: operations
project: nexosolve
status: deployment-pending
updated: 2026-10-09
---

# License Gateway

The gateway is locally implemented and tested. No server, hostname, DNS record or TLS certificate has been configured by this work. `api.nexonest.com` is a proposed address. The existing Google deployment can still be used directly until an owned facade is available.

## Deployment contract

Build/publish `src/Nexonest.NexoSolve.LicenseGateway` with .NET 8. Run as an unprivileged service. Put a TLS reverse proxy in front of its loopback HTTP listener; do not expose the plain HTTP listener publicly. Use a service manager to restart it on failure and retain bounded operational logs without request bodies or credentials.

```powershell
dotnet publish src/Nexonest.NexoSolve.LicenseGateway -c Release -o artifacts/LicenseGateway
```

Configure these environment values in the hosting service, not in committed files:

| Setting | Value |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | Example local listener `http://127.0.0.1:5080` |
| `LicenseUpstreamUrl` | Existing `https://script.google.com/macros/s/.../exec`; no query |
| `TrustedProxyAddresses` | Exact reverse-proxy source IP(s), comma-separated; loopback only when the proxy actually uses loopback |

Production rejects requests whose trusted scheme is not HTTPS. The reverse proxy must overwrite forwarding headers, preserve POST form bodies and route `/v1/licensing` without a redirect. Terminate TLS for the owned hostname, forward to the listener and pass the actual client IP/HTTPS scheme. Do not trust arbitrary incoming forwarded headers or configure all addresses as trusted. Choose the host/provider before writing provider-specific deployment automation.

DNS maps the chosen hostname to the proxy host, not directly to Apps Script. `/health` reports only gateway readiness; it does not activate a device or prove upstream/mail health. Health requests currently share the 30-request/minute per-IP limiter, so poll conservatively.

## Cutover

1. Deploy the updated Google project as described in [[Licensing]], preserving the existing spreadsheet/deployment and owner.
2. Configure/publish the gateway and TLS/DNS. Test an actual HTTPS request through the proxy; verify the recorded client IP cannot be spoofed.
3. Test controlled guest activation, email login and signed responses through the owned endpoint. Confirm malformed upstream responses return retryable 503; the desktop can retain a valid offline lease.
4. Build the desktop with `NexoLicenseEndpoint=https://YOUR_OWNED_HOST/v1/licensing` and the **same** public signing key. Publish only after the endpoint is usable.
5. Keep the old direct endpoint working for older configured clients. Distribute the new desktop deliberately; changing DNS cannot change an already embedded Google URL.

The gateway relays exact signed payload strings and has no independent account/license store. It uses a 25-second upstream budget, bounded request/response bodies, no automatic credential-bearing redirects and in-memory IP throttling. Multiple instances each have their own limits; use an edge/distributed limiter if scale requires it. It is not an email provider and does not increase MailApp quota.

## Future independent backend

Before paid production migration: provision durable transactional storage, backups/restore checks, monitored delivery and server operations. Preserve the existing action/response contract, signing key, account/device IDs, registration dates, entitlement ends, voucher consumption and revoked sessions. Migrate one authoritative store, compare records and tested flows, then change routing behind the owned URL. Avoid dual independent writes. Rotate signing keys only with explicit client compatibility support.

## Local checks

`tests/licensing/gateway.test.cjs` launches the built gateway against a local mock upstream. It checks forwarding, exact signed strings, invalid input/upstream and spoofed forwarding headers. Only `Development` allows this loopback HTTP upstream. It sends no emails and makes no Google calls. Production proxy/TLS and real Google acceptance remain separate.
