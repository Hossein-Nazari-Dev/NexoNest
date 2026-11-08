---
type: operations
project: nexosolve
status: deployment-pending
updated: 2026-10-31
---

# License Gateway

ADR-090: locally implemented and tested .NET 8 gateway for climora and nexosolve. No server, public hostname, DNS, certificate or live Script Property was configured. The current desktop endpoint is unchanged. The proposed owned hostname is not a working service.

## Hosting configuration

Publish src/Nexonest.NexoSolve.LicenseGateway with .NET 8. Run unprivileged, bind only loopback, and place an HTTPS reverse proxy/protected edge in front. Keep bodies, codes, sessions, vouchers, device hashes and keys out of logs. The source gateway introduces no new NuGet dependency, database or background worker.

| Environment setting | Value |
|---|---|
| ASPNETCORE_ENVIRONMENT | Production |
| ASPNETCORE_URLS | http://127.0.0.1:5080 (example loopback) |
| LicenseUpstreamUrl | Existing HTTPS script.google.com /macros/s/.../exec, no query |
| GatewaySigningKey | Base64 of 32 cryptographically random bytes; server only |
| TrustedProxyAddresses | Exact comma-separated proxy source IP addresses; no implicit trusted loopback |
| GatewayProducts | climora,nexosolve (default) |

The proxy must overwrite incoming X-Forwarded-For/X-Forwarded-Proto, supply the real client and HTTPS scheme, and pass POST /v1/licensing without redirects. Only the closest configured proxy is trusted. Production rejects non-loopback bindings, non-Google upstreams and requests without trusted HTTPS. Only Development allows a loopback HTTP mock upstream. /health is cheap local readiness: no backend call and no license-budget debit, not proof of mail/upstream health. Kestrel also bounds all connections (128), headers (24/8 KiB), request line (2 KiB), body (48 KiB), header time (10 s) and keepalive (30 s).

## Admission and failure handling

All counters are monotonic fixed windows, held in bounded maps. Active identities are never evicted to reset budgets; full maps reject new identities. IPv4-mapped addresses normalize; IPv6 is grouped by /64. Email-limit keys hash normalized mailboxes, including Gmail dot/plus aliases, without rewriting the actual forwarded payload. Product allowance prevents a product-operation cap from consuming the other product's operation allowance, but the global cap is shared and can reject both under attack.

Set a limit with GatewayLimits__NAME. Defaults:

| NAME | Default |
|---|---:|
| WindowSeconds | 60 |
| GlobalLimit | 240 |
| PerIpLimit | 30 |
| PerProductLimit | 100 |
| SendCodePerIp | 5 |
| SendCodePerEmail | 3 |
| MaxEntries | 4096 per map |
| ConcurrentRequests | 8, no queue |
| BodySeconds | 5 |
| UpstreamSeconds | 25 maximum |
| BreakerFailures | 3 consecutive |
| BreakerSeconds | 30 |

Budgets count admitted attempts, including invalid requests and locally busy attempts; they are not refunds or exact user quotas. These are conservative initial defaults, not production load-derived values. Shared/NAT users may need tuning. After the breaker opens, no upstream requests run until one recovery probe is allowed. Malformed/non-JSON/oversized upstream responses and transport failures count as failures. Backend busy/service_error JSON is relayed exactly and also counts. No automatic POST retry occurs. HTTP 429 includes Retry-After and retryable JSON; transport/breaker failures return retryable 503. Slow bodies get a bounded timeout and release their slot; a disconnected peer may observe connection closure instead of HTTP 408. Exact signed lease strings are never rewritten. Responses are no-store. Response body is capped at 32 KiB, strict UTF-8 and bounded JSON depth. Only Google 302/303 to HTTPS script.googleusercontent.com may be followed, as GET without payload or credentials.

## Origin proof and replay

Both shared projects must include LicensingGateway.gs before deploying the modified Licensing.gs. Do not replace the newer NexoNest Code.gs, PublicEmail.gs, GameClubEmail.gs or workshop modules with older copies.

Use Script Property LICENSE_GATEWAY_HMAC_KEY matching GatewaySigningKey. Flags are product-specific: LICENSE_CLIMORA_REQUIRE_GATEWAY for climora, LICENSE_REQUIRE_GATEWAY for nexosolve. Absent/empty/false means default-off compatibility; true enforces; an invalid value fails closed. Missing/malformed keys fail closed when enabled.

The gateway alone adds gatewayTimestamp (Unix seconds), gatewayNonce (24 random bytes, base64url) and gatewaySignature (lowercase HMAC-SHA256 hex). The canonical UTF-8 text is v1, timestamp, nonce and SHA256 hex of the exact raw payload, joined by newline. Requests must be within 60 seconds of server time. No secret reaches a client; synchronize gateway/server clocks. A constant-work hex comparison checks the MAC. Replay hashes are stored under the licensing ScriptLock in sixteen LICENSE_GATEWAY_REPLAY_0..f properties, max 64 active records each, expiration timestamp+60 s. Full shards reject without eviction; expired entries are pruned. CacheService is intentionally not used because eviction must not revive a consumed proof. Do not clear active replay state during routine operations. A compromised HMAC key can authorize upstream calls but does not reveal/replace the separate RSA signing authority; revoke/rotate deliberately with compatible gateway settings.

## Future cutover (not performed)

1. Prepare an edge-protected host and the same 32-byte server key in private host settings and Script Properties. Preserve current Google deployment, owner, signing keys, ledgers, trial dates, sessions and voucher history.
2. Add LicensingGateway.gs and the reviewed Licensing.gs, preserving newer website companions. Initially leave per-product flags off. Test actual Google integration only under separate authorization.
3. Configure TLS/proxy, ensure only the edge can reach the origin host, verify header overwriting and observed client IP. Exercise mail/lease/voucher behavior with authorized synthetic accounts; health alone is insufficient.
4. Ship compatible clients pointed at the working owned /v1/licensing endpoint using the same RSA public key. The desktop contains no HMAC key. DNS cannot replace an embedded Google URL.
5. Only after the affected clients have migrated, set that product's REQUIRE_GATEWAY=true. This rejects legacy direct clients for the selected product. Products whose flags remain off still allow direct calls and are not origin-protected. This supersedes ADR-025's earlier keep-old-direct-clients-working cutover instruction for an enforced product.
6. Verify direct unsigned, stale and replayed proofs are rejected; retain rollback and offline-lease recovery. Disabling enforcement restores direct exposure and is a security trade-off, not a transparent rollback. Never run independent writable license ledgers.

## Protection boundary

Provider URLs and the RSA public verification key are discoverable client configuration, not secrets. Security must withstand discovery. RSA private keys, token secrets and this server HMAC key must stay server-side. The desktop still independently verifies RSA product/device/expiry.

The gateway reduces application abuse and bounds upstream work; it cannot prevent saturation of network bandwidth or protect itself without an upstream edge/firewall. Counters are local to one process and reset on restart; horizontal scale requires shared/edge budgets. Apps Script with Anyone access remains publicly invocable: HMAC rejects license operations before Sheets, but rejected invocations can still consume Google execution/lock quota. It does not hide or privatize that Google origin, and website/public-email routes are outside this gateway. A truly private/authenticated origin behind an edge is needed for stronger volumetric isolation; migrating requires a separate approved plan preserving the existing ledger. MailApp quota is unchanged.

## Local checks

Build Release first. Run node tests/licensing/gateway.test.cjs and node tests/licensing/gateway-origin.test.cjs, then the shared service/admin and website public-email/workshop regressions. Test keys are ephemeral in memory; fake Sheets/mail and loopback servers only. Tests cover exact RSA leases through the actual C# relay and Apps Script guard, admission limits, body/response bounds, forged proxy IPs, IPv6, mailbox aliases, memory saturation/recovery, concurrency, partial bodies, timeout/breaker recovery, replay/tampering and startup/production configuration. These checks do not establish live Google, real proxy/TLS, multiple-instance behavior or network DDoS capacity.
