// Optional per-product origin enforcement. No secret is ever supplied by a desktop client.
// Enable only after clients use the owned gateway. Default-off preserves existing deployments.
function licenseGatewayGuard_(parameters, product, payload, now) {
  if (typeof product !== 'string' || !/^[a-z][a-z0-9-]{2,39}$/.test(product)) licenseFail_('invalid_product', 'Unknown product.');
  const props = PropertiesService.getScriptProperties();
  const prefix = product === 'nexosolve' ? 'LICENSE_' : 'LICENSE_' + product.replace(/-/g, '_').toUpperCase() + '_';
  const required = props.getProperty(prefix + 'REQUIRE_GATEWAY');
  if (required == null || required === '' || required === 'false') return;
  if (required !== 'true') licenseFail_('service_error', 'License service is temporarily unavailable.', true);
  const key = props.getProperty('LICENSE_GATEWAY_HMAC_KEY');
  if (!key || !/^[A-Za-z0-9+/]{43}=$/.test(key)) licenseFail_('gateway_required', 'Use the current app to connect to the license service.');
  const timestamp = parameters.gatewayTimestamp, nonce = parameters.gatewayNonce, signature = parameters.gatewaySignature;
  const seconds = Math.floor(now / 1000);
  if (typeof timestamp !== 'string' || !/^[0-9]{10}$/.test(timestamp) || Math.abs(seconds - Number(timestamp)) > 60 ||
      typeof nonce !== 'string' || !/^[A-Za-z0-9_-]{32}$/.test(nonce) || typeof signature !== 'string' || !/^[a-f0-9]{64}$/.test(signature))
    licenseFail_('gateway_required', 'Use the current app to connect to the license service.');
  const bytes = Utilities.base64Decode(key);
  if (bytes.length !== 32) licenseFail_('gateway_required', 'Use the current app to connect to the license service.');
  const canonical = 'v1\n' + timestamp + '\n' + nonce + '\n' + licenseHash_(payload);
  const expected = Utilities.computeHmacSha256Signature(Utilities.newBlob(canonical).getBytes(), bytes)
    .map(value => ('0' + ((value + 256) % 256).toString(16)).slice(-2)).join('');
  let different = 0;
  for (let i = 0; i < 64; i++) different |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (different) licenseFail_('gateway_required', 'Use the current app to connect to the license service.');
  // Durable, bounded anti-replay state under licensingPost_'s Script lock.
  // Do not use CacheService: cache eviction must not make a consumed nonce valid again.
  const hash = licenseHash_(nonce), shard = 'LICENSE_GATEWAY_REPLAY_' + hash[0];
  const records = JSON.parse(props.getProperty(shard) || '{}');
  Object.keys(records).forEach(id => { if (records[id] < seconds) delete records[id]; });
  if (records[hash] !== undefined) licenseFail_('gateway_replay', 'Retry the request through the current app.');
  if (Object.keys(records).length >= 64) licenseFail_('busy', 'License service is temporarily busy.', true);
  records[hash] = Number(timestamp) + 60;
  props.setProperty(shard, JSON.stringify(records));
}
