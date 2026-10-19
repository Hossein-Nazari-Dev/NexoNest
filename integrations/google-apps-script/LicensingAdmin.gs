// Owner-only editor operations; these functions are never routed by the web API.
function disableLicenseAccount(email, disabled) {
  licenseAdmin_();
  if (typeof disabled !== 'boolean') throw new Error('Use true or false.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const key = licenseHash_(licenseEmail_(email)), account = licenseGet_('Accounts', key);
    if (!account) throw new Error('Account not found.');
    account.disabled = disabled; licensePut_('Accounts', key, account);
    licenseEvent_(disabled ? 'account_disabled' : 'account_enabled', account.id, '', Date.now());
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

// Administrative functions are not routed through doPost.
function createLicenseVouchers(months, count, redeemByIso, campaign) {
  licenseAdmin_();
  const redeemBy = Date.parse(redeemByIso);
  if (![3, 6, 12].includes(months) || !Number.isInteger(count) || count < 1 || count > 100 || !(redeemBy > Date.now())) throw new Error('Use 3/6/12 months, 1-100 vouchers and a future redemption deadline.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = 'NX-' + licenseHash_(licenseRandom_()).slice(0, 32).toUpperCase();
      licensePut_('Vouchers', licenseHash_(code), { product: licenseProduct_(), months: months, redeemBy: redeemBy, campaign: String(campaign || '').slice(0, 120), account: '', revoked: false });
      codes.push(code);
    }
    return codes; // Save securely: only hashes are stored in the license tables.
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

function grantLicense(email, months, operationId) {
  licenseAdmin_();
  if (![3, 6, 12].includes(months)) throw new Error('Use 3, 6 or 12 months.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const account = licenseGet_('Accounts', licenseHash_(licenseEmail_(email)));
    if (!account || account.disabled || account.deletedAt) throw new Error('An enabled, verified account is required.');
    const now = Date.now();
    const requestId = operationId || Utilities.getUuid();
    if (!/^[a-zA-Z0-9_-]{20,100}$/.test(requestId)) throw new Error('Invalid activation operation.');
    const id = licenseHash_('grant:' + requestId);
    const previous = licenseGet_('Licenses', id);
    if (previous) {
      if (previous.account !== account.id || previous.months !== months) throw new Error('Activation operation does not match.');
      return id;
    }
    licensePut_('Licenses', id, { product: licenseProduct_(), account: account.id, months: months, startsAt: now, endsAt: licenseAddMonths_(licensePaidEnd_(account, now), months), revoked: false });
    licenseEvent_('manual_grant', account.id, id, now); return id;
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

// Logical deletion preserves the anti-abuse ledger and existing grants.
function resetLicenseAccount(email, deleteProfile) {
  licenseAdmin_();
  if (typeof deleteProfile !== 'boolean') throw new Error('Use true or false.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const key = licenseHash_(licenseEmail_(email)), account = licenseGet_('Accounts', key);
    if (!account) throw new Error('Account not found.');
    licenseRows_('Sessions').filter(row => row.value.account === key).forEach(row => {
      row.value.revoked = true; licensePut_('Sessions', row.key, row.value);
    });
    licenseRows_('LoginCodes').filter(row => row.value.email === account.email).forEach(row => {
      row.value.used = true; licensePut_('LoginCodes', row.key, row.value);
    });
    if (deleteProfile) {
      account.displayName = ''; account.deletedAt = Date.now();
      licensePut_('Accounts', key, account);
    }
    licenseEvent_(deleteProfile ? 'profile_deleted' : 'sessions_reset', account.id, '', Date.now());
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

function applyLicenseVoucher(email, voucher) {
  licenseAdmin_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const account = licenseGet_('Accounts', licenseHash_(licenseEmail_(email)));
    if (!account || account.disabled || account.deletedAt) throw new Error('An enabled, verified account is required.');
    licenseRedeem_({ voucher: voucher }, account, Date.now());
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

// Permanent product-only erasure. Never invoked by public API or automatic setup.
function deleteLicenseAccount(email) {
  licenseAdmin_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    licenseEraseAccount_(email);
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

// The caller holds the script lock and has checked owner identity.
function licenseEraseAccount_(email) {
    const normalized = licenseEmail_(email), key = licenseHash_(normalized);
    const account = licenseGet_('Accounts', key);
    if (!account) throw new Error('Account not found.');
    const sessions = licenseRows_('Sessions'), codes = licenseRows_('LoginCodes');
    const devices = new Set([account.device].concat(account.erasureDevices || [],
      sessions.filter(row => row.value.account === key).map(row => row.value.device),
      codes.filter(row => row.value.email === normalized).map(row => row.value.device),
      licenseRows_('Devices').filter(row => row.value.trialAccount === account.id).map(row => row.key)
    ).filter(Boolean));
    // Shared device history belongs to the remaining accounts as well.
    const otherAccounts = licenseRows_('Accounts').filter(row => row.key !== key);
    const sharedDevices = new Set([...devices].filter(device =>
      otherAccounts.some(row => row.value.device === device || (row.value.erasureDevices || []).includes(device)) ||
      sessions.some(row => row.value.account !== key && row.value.device === device) ||
      codes.some(row => row.value.email !== normalized && row.value.device === device)));
    // Retain the erasure plan until completion, so an interrupted deletion can be retried.
    account.erasureDevices = [...devices]; account.disabled = true; licensePut_('Accounts', key, account);
    // Delete credentials first. A partial failure remains fail-closed and can be retried.
    licenseDeleteRows_('Sessions', row => row.value.account === key);
    licenseDeleteRows_('LoginCodes', row => row.value.email === normalized);
    licenseDeleteRows_('Licenses', row => row.value.account === account.id && row.value.product === licenseProduct_());
    licenseDeleteRows_('Vouchers', row => row.value.product === licenseProduct_() && (row.value.account === account.id || row.value.assignedAccount === account.id));
    licenseDeleteRows_('Events', row => row.value.account === account.id);
    licenseDeleteRows_('Rates', row => row.key === 'email:' + key || row.key === 'voucher:' + account.id || [...devices].some(device => !sharedDevices.has(device) && row.key === 'device:' + device));
    sharedDevices.forEach(device => {
      const record = licenseGet_('Devices', device);
      if (record && record.trialAccount === account.id) {
        // Keep anti-abuse and offline-lease history, without retaining the erased account link.
        record.trialAccount = 'erased'; licensePut_('Devices', device, record);
      }
    });
    licenseDeleteRows_('Devices', row => devices.has(row.key) && !sharedDevices.has(row.key));
    const props = PropertiesService.getScriptProperties();
    [1, 3, 6, 12].forEach(months => props.deleteProperty(licensePendingGrantKey_(normalized, months)));
    const batches = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Admin_Batches');
    if (batches) adminDataRows_('Batches').filter(row => row.value.product === licenseProduct_() && row.value.account === account.id)
      .sort((a, b) => b.row - a.row).forEach(row => batches.deleteRow(row.row));
    licenseDeleteRows_('Accounts', row => row.key === key);
    // Do not recreate an identifying audit record after explicit erasure.
}

function licenseDeleteRows_(table, predicate) {
  const sheet = licenseTable_(table);
  licenseRows_(table).filter(predicate).sort((a, b) => b.row - a.row).forEach(row => sheet.deleteRow(row.row));
}

function createAssignedLicenseVouchers(months, count, email) {
  licenseAdmin_();
  const normalized = email ? licenseEmail_(email) : '';
  // Hold one lock across account validation and voucher creation/assignment.
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const account = normalized ? licenseGet_('Accounts', licenseHash_(normalized)) : null;
    if (normalized && (!account || account.disabled || account.deletedAt)) throw new Error('An enabled registered account is required.');
    if (![3, 6, 12].includes(months) || !Number.isInteger(count) || count < 1 || count > 100 || (normalized && count !== 1)) throw new Error('Use 3/6/12 months and 1-100 codes; one code for a selected account.');
    const codes = [], now = Date.now();
    for (let i = 0; i < count; i++) {
      const code = 'NX-' + licenseHash_(licenseRandom_()).slice(0, 32).toUpperCase();
      licensePut_('Vouchers', licenseHash_(code), { product: licenseProduct_(), months: months,
        redeemBy: licenseAddMonths_(now, 12), assignedAccount: account ? account.id : '',
        assignedEmail: normalized, account: '', revoked: false });
      codes.push(code);
    }
    return codes;
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

function revokeLicenseGrant(table, id) {
  licenseAdmin_();
  if (!['Licenses', 'Vouchers'].includes(table)) throw new Error('Unknown grant table.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const grant = licenseGet_(table, id); if (!grant) throw new Error('Grant not found.');
    grant.revoked = true; licensePut_(table, id, grant);
    licenseEvent_('grant_revoked', grant.account || '', id, Date.now());
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}

function releaseLicenseDevice(email) {
  licenseAdmin_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const key = licenseHash_(licenseEmail_(email)), account = licenseGet_('Accounts', key);
    if (!account) throw new Error('Account not found.');
    const old = licenseGet_('Devices', account.device);
    account.bindAfter = Math.max(account.bindAfter || 0, old ? old.lastLeaseUntil : Date.now()); account.device = '';
    licensePut_('Accounts', key, account);
    licenseRows_('Sessions').filter(row => row.value.account === key).forEach(row => { row.value.revoked = true; licensePut_('Sessions', row.key, row.value); });
    licenseEvent_('device_released', account.id, '', Date.now());
    return new Date(account.bindAfter).toISOString();
  } finally {
    try { licenseRefreshAdminSafely_(); } finally { lock.releaseLock(); }
  }
}


