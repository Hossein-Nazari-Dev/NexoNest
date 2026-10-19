// Shared product registry. The existing NexoSolve ledger and signing identity stay intact.
let licenseContext_ = null;

function adminDataRows_(name) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        "Admin_" + name,
    );
    if (!sheet || sheet.getLastRow() < 2) return [];
    return sheet
        .getRange(2, 1, sheet.getLastRow() - 1, 2)
        .getValues()
        .map((row, index) => ({
            key: String(row[0]),
            value: JSON.parse(row[1]),
            row: index + 2,
        }));
}

function adminDataPut_(name, key, value) {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = book.getSheetByName("Admin_" + name);
    if (!sheet) {
        sheet = book.insertSheet("Admin_" + name);
        sheet.appendRow(["Key", "JSON"]);
        sheet.setFrozenRows(1);
    }
    const previous = adminDataRows_(name).find((row) => row.key === key);
    sheet
        .getRange(previous ? previous.row : sheet.getLastRow() + 1, 1, 1, 2)
        .setValues([[key, JSON.stringify(value)]]);
}

function licenseProducts_() {
    const products = adminDataRows_("Products").map((row) => row.value);
    if (!products.some((product) => product.id === "nexosolve"))
        products.unshift({
            id: "nexosolve",
            name: "NexoSolve",
            state: "active",
        });
    return products;
}

function licenseResolveProduct_(id, requireActive) {
    if (typeof id !== "string" || !/^[a-z][a-z0-9-]{2,39}$/.test(id))
        throw new Error("Unknown product.");
    const product = licenseProducts_().find((item) => item.id === id);
    if (!product || (requireActive && product.state !== "active"))
        throw new Error("This product is not accepting license requests.");
    return product;
}

function licenseWithProduct_(id, operation) {
    const previous = licenseContext_;
    licenseContext_ = licenseResolveProduct_(id, false);
    try {
        return operation();
    } finally {
        licenseContext_ = previous;
    }
}

function licenseProduct_() {
    return licenseContext_ ? licenseContext_.id : LICENSE_PRODUCT;
}
function licenseProductName_() {
    return licenseContext_ ? licenseContext_.name : "NexoSolve";
}
function licensePrefix_() {
    return licenseProduct_() === "nexosolve"
        ? LICENSE_STORAGE_PREFIX
        : "License_" + licenseProduct_().replace(/-/g, "_") + "_";
}
function licenseProperty_(suffix) {
    return licenseProduct_() === "nexosolve"
        ? "LICENSE_" + suffix
        : "LICENSE_" +
              licenseProduct_().replace(/-/g, "_").toUpperCase() +
              "_" +
              suffix;
}
function licensePendingGrantKey_(email, months) {
    return (
        licenseProperty_("PENDING_GRANT_") + licenseHash_(email + ":" + months)
    );
}

function adminSaveProduct(input) {
    licenseAdmin_();
    const id = String(input.id || "").trim(),
        name = String(input.name || "").trim(),
        state = input.state;
    if (
        !/^[a-z][a-z0-9-]{2,39}$/.test(id) ||
        name.length < 2 ||
        name.length > 80 ||
        /[<>\x00-\x1f]/.test(name) ||
        !["draft", "active", "paused"].includes(state)
    )
        throw new Error("Enter a stable product ID, name and valid status.");
    // Hyphen/underscore variants must never share storage or signing properties.
    if (id.includes("--") || id.endsWith("-"))
        throw new Error("Use single hyphens inside the product ID.");
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const products = licenseProducts_();
        if (!products.some((item) => item.id === id) && products.length >= 50)
            throw new Error("Product limit reached.");
        if (state === "active")
            licenseWithCandidateProduct_({ id, name, state }, () => {
                const props = PropertiesService.getScriptProperties();
                const tokenSecret = props.getProperty(licenseProperty_("TOKEN_SECRET"));
                const signingKey = props.getProperty(licenseProperty_("PRIVATE_KEY"));
                if (!tokenSecret || tokenSecret.length < 32 || !signingKey)
                    throw new Error(
                        "Configure the product signing key and token secret in private Script properties before activating it. The matching client must trust this product key.",
                    );
                try {
                    Utilities.computeRsaSha256Signature('product-configuration:' + id, signingKey.replace(/\\n/g, '\n'), Utilities.Charset.UTF_8);
                } catch (_) { throw new Error('The private product signing configuration is invalid.'); }
            });
        adminDataPut_("Products", id, {
            id,
            name,
            state,
            updatedAt: Date.now(),
        });
        return {
            message:
                "Product saved. Existing accounts and keys were not moved.",
        };
    } finally {
        lock.releaseLock();
    }
}

function licenseWithCandidateProduct_(product, operation) {
    const previous = licenseContext_;
    licenseContext_ = product;
    try {
        return operation();
    } finally {
        licenseContext_ = previous;
    }
}
