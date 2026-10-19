// Cohorts use separate tables. Existing registrations are never moved or reinterpreted.
function workshopDefaultCourse_() {
    return {
        id: "workshop-2026-10",
        name: "From Computational Thinking to Design Decisions",
        sheet: WORKSHOP_TAB,
        rulesVersion: "2026-10-v3",
        state: "open",
        capacity: 150,
        dailyLimit: 30,
        fees: { standard: 2900000, student: 2610000, newsletter: 2320000 },
        schedule: "7–8 Aban 1405, 17:00–21:00 Tehran",
        product: "",
        voucherMonths: 3,
    };
}

function workshopCourses_() {
    const courses = adminDataRows_("Courses").map((row) => row.value);
    if (!courses.some((course) => course.id === "workshop-2026-10"))
        courses.unshift(workshopDefaultCourse_());
    return courses;
}

function workshopResolveCourse_(id) {
    const key = id === undefined ? "workshop-2026-10" : String(id);
    if (!/^[a-z][a-z0-9-]{2,39}$/.test(key))
        throw new Error("دوره معتبر نیست.");
    const course = workshopCourses_().find((item) => item.id === key);
    if (!course) throw new Error("دوره یافت نشد.");
    return course;
}

function adminSaveCourse(input) {
    licenseAdmin_();
    const id = String(input.id || "").trim(),
        name = String(input.name || "").trim();
    const rulesVersion = String(input.rulesVersion || "").trim(),
        schedule = String(input.schedule || "").trim();
    if (
        !/^[a-z][a-z0-9-]{2,39}$/.test(id) ||
        name.length < 2 ||
        name.length > 160 ||
        /[<>\x00-\x1f]/.test(name + schedule) ||
        schedule.length > 500 ||
        !/^[a-zA-Z0-9._-]{3,60}$/.test(rulesVersion)
    )
        throw new Error(
            "Enter a stable course ID, title, rules version and schedule.",
        );
    if (
        !["draft", "open", "closed"].includes(input.state) ||
        !Number.isInteger(input.capacity) ||
        input.capacity < 1 ||
        input.capacity > 150 ||
        !Number.isInteger(input.dailyLimit) ||
        input.dailyLimit < 1 ||
        input.dailyLimit > 30
    )
        throw new Error("Capacity must be 1–150 and the daily limit 1–30.");
    const fees = {};
    ["standard", "student", "newsletter"].forEach((type) => {
        const fee = input.fees && input.fees[type];
        if (!Number.isSafeInteger(fee) || fee < 0 || fee > 1000000000)
            throw new Error("Enter non-negative prices in toman.");
        fees[type] = fee;
    });
    const product = input.product
        ? licenseResolveProduct_(input.product, false).id
        : "";
    if (![3, 6, 12].includes(input.voucherMonths))
        throw new Error("Select 3, 6 or 12 months.");
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
        const courses = workshopCourses_(),
            previous = courses.find((course) => course.id === id);
        if (!previous && courses.length >= 50)
            throw new Error("Course limit reached.");
        // Never change a configured cohort's pricing/consent contract after it receives a registration.
        if (previous) {
            const sheet = SpreadsheetApp.openById(WORKSHOP_BOOK).getSheetByName(
                previous.sheet,
            );
            if (
                sheet &&
                sheet.getLastRow() > 1 &&
                (JSON.stringify(previous.fees) !== JSON.stringify(fees) ||
                    previous.rulesVersion !== rulesVersion)
            )
                throw new Error(
                    "This cohort already has registrations. Create a new cohort to change prices or consent rules.",
                );
        }
        const sheetName = previous ? previous.sheet : "Workshop_" + id;
        if (
            !previous &&
            SpreadsheetApp.openById(WORKSHOP_BOOK).getSheetByName(sheetName)
        )
            throw new Error(
                "This table already exists; choose a different course ID.",
            );
        let sheet =
            SpreadsheetApp.openById(WORKSHOP_BOOK).getSheetByName(sheetName);
        if (!sheet) {
            sheet =
                SpreadsheetApp.openById(WORKSHOP_BOOK).insertSheet(sheetName);
            sheet
                .getRange(1, 1, 1, WORKSHOP_HEADERS.length)
                .setValues([WORKSHOP_HEADERS]);
            sheet.setFrozenRows(1);
        }
        const course = {
            id,
            name,
            sheet: sheetName,
            rulesVersion,
            state: input.state,
            capacity: input.capacity,
            dailyLimit: input.dailyLimit,
            fees,
            schedule,
            product,
            voucherMonths: input.voucherMonths,
            updatedAt: Date.now(),
        };
        adminDataPut_("Courses", id, course);
        return {
            message:
                "Course saved. No registration, email or license was created. Public forms must send this course ID and rules version.",
        };
    } finally {
        lock.releaseLock();
    }
}
