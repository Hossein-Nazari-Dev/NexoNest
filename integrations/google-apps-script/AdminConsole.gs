// Bound-spreadsheet administration only. Never add these entry points to doGet/doPost.
function openAdminConsole() {
    licenseAdmin_();
    SpreadsheetApp.getUi().showModalDialog(
        HtmlService.createHtmlOutputFromFile("AdminConsoleView")
            .setWidth(1240)
            .setHeight(820),
        "NexoNest Management",
    );
}

function adminSnapshot(productId, courseId) {
    licenseAdmin_();
    return licenseWithProduct_(productId || "nexosolve", () => {
        const now = Date.now(),
            accounts = licenseRows_("Accounts"),
            grants = licenseRows_("Licenses"),
            vouchers = licenseRows_("Vouchers");
        const paid = {};
        grants.concat(vouchers).forEach((row) => {
            const value = row.value;
            if (
                value.product === licenseProduct_() &&
                !value.revoked &&
                value.startsAt <= now &&
                value.endsAt > (paid[value.account] || 0)
            )
                paid[value.account] = value.endsAt;
        });
        const safeAccounts = accounts.map((row) => {
            const a = row.value,
                endsAt = Math.max(a.trialEnd || 0, paid[a.id] || 0);
            return {
                email: a.email,
                name: a.displayName || "",
                status: a.disabled
                    ? "Disabled"
                    : a.deletedAt
                      ? "Needs sign-in"
                      : "Enabled",
                access:
                    endsAt <= now
                        ? "Expired"
                        : paid[a.id] >= endsAt
                          ? "License"
                          : "Account trial",
                endsAt,
                device: a.device
                    ? "Activated"
                    : a.bindAfter > now
                      ? "Transfer pending"
                      : "Not activated",
            };
        });
        const emails = {};
        accounts.forEach((row) => {
            emails[row.value.id] = row.value.email;
        });
        const safeGrant = (row, table) => ({
            id: row.key,
            table,
            email: emails[row.value.account || row.value.assignedAccount] || "",
            months: row.value.months,
            endsAt: row.value.endsAt || 0,
            redeemBy: row.value.redeemBy || 0,
            courseId: row.value.courseId || "",
            campaign: row.value.campaign || "",
            state: row.value.revoked
                ? "Revoked"
                : row.value.account
                  ? row.value.endsAt > now
                      ? "Active"
                      : "Expired"
                  : row.value.redeemBy <= now
                    ? "Expired"
                    : "Available",
        });
        const courses =
            typeof workshopCourses_ === "function" ? workshopCourses_().map(course => {
              const sheet = SpreadsheetApp.openById(WORKSHOP_BOOK).getSheetByName(course.sheet);
              return Object.assign({}, course, { registrationCount: sheet ? Math.max(0, sheet.getLastRow() - 1) : 0,
                registrationEnabled: course.state === 'open' && (course.id !== 'workshop-2026-10' || PropertiesService.getScriptProperties().getProperty('WORKSHOP_ENABLED') === 'true') });
            }) : [];
        const selectedCourse =
            courses.find((course) => course.id === courseId) || courses[0];
        const registrations = selectedCourse
            ? adminRegistrationRows_(selectedCourse).map((row) => ({
                  id: String(row.values[0]),
                  name: String(row.values[2]),
                  email: String(row.values[3]),
                  type: String(row.values[8]),
                  fee: row.values[9],
                  receipt: adminReceiptUrl_(row.values[16]),
                  status: String(row.values[17]),
                  note: String(row.values[20]),
                  confirmation: String(row.values[22]),
                  revision: licenseHash_(JSON.stringify(row.values)),
              }))
            : [];
        return {
            products: licenseProducts_(),
            productId: licenseProduct_(),
            accounts: safeAccounts,
            licenses: grants
                .filter((row) => row.value.product === licenseProduct_())
                .map((row) => safeGrant(row, "Licenses")),
            vouchers: vouchers
                .filter((row) => row.value.product === licenseProduct_())
                .map((row) => safeGrant(row, "Vouchers")),
            courses,
            courseId: selectedCourse ? selectedCourse.id : "",
            registrations,
            generatedAt: now,
            stats: {
                accounts: accounts.length,
                active: safeAccounts.filter(
                    (a) => a.status === "Enabled" && a.endsAt > now,
                ).length,
                vouchers: vouchers.filter(
                    (row) =>
                        row.value.product === licenseProduct_() &&
                        !row.value.revoked &&
                        !row.value.account &&
                        row.value.redeemBy > now,
                ).length,
                pending: registrations.filter(
                    (row) => row.status === "در انتظار بررسی",
                ).length,
            },
        };
    });
}

function adminRegistrationRows_(course) {
    const sheet = SpreadsheetApp.openById(WORKSHOP_BOOK).getSheetByName(
        course.sheet,
    );
    if (!sheet || sheet.getLastRow() < 2) return [];
    workshopSheet_(course); // Validate the schema before interpreting a registration.
    return sheet
        .getRange(2, 1, sheet.getLastRow() - 1, WORKSHOP_HEADERS.length)
        .getValues()
        .map((values, i) => ({ row: i + 2, values }));
}

function adminReceiptUrl_(value) {
    const url = String(value || "");
    return /^https:\/\/drive\.google\.com\/[^\s<>"']+$/.test(url) ? url : "";
}

function adminLicenseAction(request) {
    licenseAdmin_();
    return licenseWithProduct_(request.product, () => {
        const email = licenseEmail_(request.email);
        if (request.action === "grant") {
            licenseResolveProduct_(request.product, true);
            if (!request.operationId)
                throw new Error("An activation operation ID is required.");
            grantLicense(email, request.months, request.operationId);
        } else if (request.action === "disable")
            disableLicenseAccount(email, true);
        else if (request.action === "enable")
            disableLicenseAccount(email, false);
        else if (request.action === "signout")
            resetLicenseAccount(email, false);
        else if (request.action === "release")
            return {
                message:
                    "Device transfer is available after " +
                    releaseLicenseDevice(email) +
                    ". Existing offline leases are preserved until expiry.",
            };
        else throw new Error("Unknown account action.");
        return {
            message:
                "Account updated. Existing offline access may remain valid for up to seven days. No email was sent.",
        };
    });
}

function adminRevokeGrant(request) {
    licenseAdmin_();
    return licenseWithProduct_(request.product, () => {
        if (!["Licenses", "Vouchers"].includes(request.table))
            throw new Error("Unknown grant table.");
        const grant = licenseGet_(request.table, request.id);
        if (!grant || grant.product !== licenseProduct_())
            throw new Error("Grant not found in this product.");
        revokeLicenseGrant(request.table, request.id);
        return {
            message:
                "Grant revoked. Existing offline access may remain valid until expiry.",
        };
    });
}

function adminDeletePlan_(emails) {
    if (!Array.isArray(emails) || emails.length < 1 || emails.length > 100)
        throw new Error("Select 1–100 accounts.");
    const normalized = [...new Set(emails.map(licenseEmail_))].sort();
    const accounts = licenseRows_("Accounts"),
        sessions = licenseRows_("Sessions"),
        codes = licenseRows_("LoginCodes"),
        devices = licenseRows_("Devices");
    const selected = accounts.filter((row) =>
        normalized.includes(row.value.email),
    );
    if (selected.length !== normalized.length)
        throw new Error(
            "The account list changed. Refresh and select the remaining accounts.",
        );
    const keys = new Set(selected.map((row) => row.key)),
        ids = new Set(selected.map((row) => row.value.id));
    const affected = new Set();
    selected.forEach((row) =>
        [row.value.device]
            .concat(row.value.erasureDevices || [])
            .filter(Boolean)
            .forEach((device) => affected.add(device)),
    );
    sessions
        .filter((row) => keys.has(row.value.account))
        .forEach((row) => affected.add(row.value.device));
    codes
        .filter((row) => normalized.includes(row.value.email))
        .forEach((row) => affected.add(row.value.device));
    devices
        .filter((row) => ids.has(row.value.trialAccount))
        .forEach((row) => affected.add(row.key));
    const shared = [...affected].filter(
        (device) =>
            accounts.some(
                (row) =>
                    !keys.has(row.key) &&
                    (row.value.device === device ||
                        (row.value.erasureDevices || []).includes(device)),
            ) ||
            sessions.some(
                (row) =>
                    !keys.has(row.value.account) && row.value.device === device,
            ) ||
            codes.some(
                (row) =>
                    !normalized.includes(row.value.email) &&
                    row.value.device === device,
            ),
    );
    // Revalidate all involved ledgers at commit, not just the account checkbox selection.
    const relevant = {
        Accounts: (row) =>
            keys.has(row.key) ||
            affected.has(row.value.device) ||
            (row.value.erasureDevices || []).some((device) =>
                affected.has(device),
            ),
        Sessions: (row) =>
            keys.has(row.value.account) || affected.has(row.value.device),
        LoginCodes: (row) =>
            normalized.includes(row.value.email) ||
            affected.has(row.value.device),
        Devices: (row) => affected.has(row.key),
        Licenses: (row) => ids.has(row.value.account),
        Vouchers: (row) =>
            ids.has(row.value.account) || ids.has(row.value.assignedAccount),
        Events: (row) => ids.has(row.value.account),
        Rates: (row) =>
            normalized.some(
                (email) => row.key === "email:" + licenseHash_(email),
            ) ||
            [...ids].some((id) => row.key === "voucher:" + id) ||
            [...affected].some((device) => row.key === "device:" + device),
    };
    const fingerprint = LICENSE_TABLES.map((table) => [
        table,
        licenseRows_(table)
            .filter(relevant[table])
            .map((row) => [row.key, row.value]),
    ]);
    return {
        emails: normalized,
        accounts: normalized.length,
        sharedDevices: shared.length,
        exclusiveDevices: affected.size - shared.length,
        revision: licenseHash_(
            JSON.stringify([licenseProduct_(), normalized, fingerprint]),
        ),
        phrase:
            "DELETE " +
            normalized.length +
            (normalized.length === 1 ? " ACCOUNT" : " ACCOUNTS"),
    };
}

function adminPreviewDeletion(productId, emails) {
    licenseAdmin_();
    return licenseWithProduct_(productId, () => {
        const lock = LockService.getScriptLock();
        lock.waitLock(10000);
        try {
            return adminDeletePlan_(emails);
        } finally {
            lock.releaseLock();
        }
    });
}

function adminDeleteAccounts(request) {
    licenseAdmin_();
    return licenseWithProduct_(request.product, () => {
        const lock = LockService.getScriptLock();
        lock.waitLock(10000);
        try {
            const plan = adminDeletePlan_(request.emails);
            if (
                request.revision !== plan.revision ||
                request.phrase !== plan.phrase
            )
                throw new Error(
                    "Deletion confirmation is stale or does not match. Preview again. No accounts were removed.",
                );
            plan.emails.forEach(licenseEraseAccount_);
            return {
                message:
                    plan.accounts +
                    " account(s) deleted. Shared device limits, remaining accounts, other products and workshop registrations were preserved. Existing offline access may continue until expiry.",
            };
        } finally {
            try {
                licenseRefreshAdminSafely_();
            } finally {
                lock.releaseLock();
            }
        }
    });
}

function adminIssueVouchers(request) {
    licenseAdmin_();
    return licenseWithProduct_(request.product, () => {
        licenseResolveProduct_(request.product, true);
        if (!/^[a-zA-Z0-9_-]{20,100}$/.test(String(request.operationId || "")))
            throw new Error("A voucher operation ID is required.");
        if (
            ![3, 6, 12].includes(request.months) ||
            !Number.isInteger(request.count) ||
            request.count < 1 ||
            request.count > 100
        )
            throw new Error("Select 3/6/12 months and 1–100 codes.");
        const email = request.email ? licenseEmail_(request.email) : "";
        if (email && request.count !== 1)
            throw new Error("An account-bound batch contains one code.");
        const redeemBy = Date.parse(request.redeemBy);
        if (!Number.isFinite(redeemBy))
            throw new Error("Enter a redemption deadline.");
        const courseId = request.courseId
            ? workshopResolveCourse_(request.courseId).id
            : "";
        const campaign = String(request.campaign || "").trim();
        if (campaign.length > 120) throw new Error("Campaign is too long.");
        const lock = LockService.getScriptLock();
        lock.waitLock(10000);
        try {
            const account = email
                ? licenseGet_("Accounts", licenseHash_(email))
                : null;
            if (email && (!account || account.disabled || account.deletedAt))
                throw new Error("Select an enabled verified account.");
            const key = licenseHash_(
                licenseProduct_() + ":" + request.operationId,
            );
            const secret = PropertiesService.getScriptProperties().getProperty(
                licenseProperty_("TOKEN_SECRET"),
            );
            if (!secret)
                throw new Error("Product token secret is not configured.");
            const plan = {
                tokenVersion: licenseHash_(secret),
                product: licenseProduct_(),
                account: account ? account.id : "",
                months: request.months,
                count: request.count,
                redeemBy,
                courseId,
                campaign,
            };
            const fingerprint = licenseHash_(JSON.stringify(plan)),
                previous = adminDataRows_("Batches").find(
                    (row) => row.key === key,
                );
            if (previous && previous.value.fingerprint !== fingerprint)
                throw new Error(
                    "The operation ID belongs to a different voucher batch.",
                );
            if (!previous) {
                if (
                    redeemBy <= Date.now() ||
                    redeemBy > licenseAddMonths_(Date.now(), 24)
                )
                    throw new Error("Use a future deadline within two years.");
                adminDataPut_(
                    "Batches",
                    key,
                    Object.assign({}, plan, {
                        fingerprint,
                        createdAt: Date.now(),
                    }),
                );
            }
            const codes = [];
            for (let i = 0; i < request.count; i++) {
                const proof = Utilities.base64EncodeWebSafe(
                    Utilities.computeHmacSha256Signature(
                        "admin-voucher:" +
                            licenseProduct_() +
                            ":" +
                            request.operationId +
                            ":" +
                            i,
                        secret,
                    ),
                );
                const code =
                        "NX-" + licenseHash_(proof).slice(0, 32).toUpperCase(),
                    voucherKey = licenseHash_(code);
                if (!licenseGet_("Vouchers", voucherKey))
                    licensePut_("Vouchers", voucherKey, {
                        product: plan.product,
                        months: plan.months,
                        redeemBy,
                        assignedAccount: plan.account,
                        account: "",
                        revoked: false,
                        courseId,
                        campaign,
                        batch: key,
                    });
                codes.push(code);
            }
            return {
                codes,
                message:
                    "Copy these codes securely. No email was sent. Retrying this exact operation recovers the same batch.",
            };
        } finally {
            try {
                licenseRefreshAdminSafely_();
            } finally {
                lock.releaseLock();
            }
        }
    });
}

function adminReviewRegistration(request) {
    licenseAdmin_();
    if (!["approve", "reject"].includes(request.decision))
        throw new Error("Select a review decision.");
    const note = workshopText_(request.note, 500),
        course = workshopResolveCourse_(request.courseId);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const item = adminRegistrationRows_(course).find(
            (row) => String(row.values[0]) === request.id,
        );
        if (
            !item ||
            item.values[17] !== "در انتظار بررسی" ||
            licenseHash_(JSON.stringify(item.values)) !== request.revision
        )
            throw new Error(
                "This registration changed or was already reviewed. Refresh before continuing.",
            );
        workshopSheet_(course)
            .getRange(item.row, 18, 1, 4)
            .setValues([
                [
                    request.decision === "approve" ? "تأیید شده" : "رد شده",
                    LICENSE_OWNER,
                    new Date().toISOString(),
                    workshopSafe_(note),
                ],
            ]);
        return {
            message:
                "Review decision saved. No confirmation email, certificate or license was issued.",
        };
    } finally {
        lock.releaseLock();
    }
}
