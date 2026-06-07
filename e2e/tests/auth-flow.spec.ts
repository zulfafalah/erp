import { test, expect, type Page } from "../fixtures/auth.fixture";

// ─── Credentials ───────────────────────────────────────────────────────────────
const VALID_USERNAME = process.env.TEST_USERNAME ?? "falah";
const VALID_PASSWORD = process.env.TEST_PASSWORD ?? "admin";

// ─── Lokasi yang tersedia di halaman select-location ─────────────────────────
const EXPECTED_LOCATIONS = [
    { value: "hq",     label: "Head Office — Jakarta" },
    { value: "br-bdg", label: "Cabang Bandung" },
    { value: "br-sby", label: "Cabang Surabaya" },
    { value: "br-mdn", label: "Cabang Medan" },
    { value: "wh-ckg", label: "Gudang Cikampek" },
] as const;

// ─── Helper: reset sesi ke state fresh ────────────────────────────────────────
async function clearSession(page: Page) {
    await page.goto("/login");
    await page.evaluate(() => {
        try { localStorage.clear(); } catch { /* ignore */ }
    });
    await page.context().clearCookies();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Auth Flow Test Suite
// Mencakup seluruh alur autentikasi: Login → Select Location → Dashboard
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("Auth Flow — Login & Select Location", () => {

    // ─────────────────────────────────────────────────────────────────────────
    // BAGIAN 1: Login Page
    // ─────────────────────────────────────────────────────────────────────────

    test.describe("Login Page", () => {

        test("1. Form kosong → tampil pesan validasi 'harus diisi'", async ({
            page,
            loginPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();

            // Klik Sign In tanpa isi apapun
            await loginPage.submit();

            await expect(loginPage.errorMsg).toBeVisible({ timeout: 5_000 });
            const errorText = await loginPage.getErrorText();
            expect(errorText).toContain("harus diisi");
            await expect(page).toHaveURL(/\/login/);
        });

        test("2. Credentials salah → tampil pesan error, tetap di /login", async ({
            page,
            loginPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();

            await loginPage.loginAs(VALID_USERNAME, "password_salah_123");

            await expect(loginPage.errorMsg).toBeVisible({ timeout: 10_000 });
            await expect(page).toHaveURL(/\/login/);

            const errorText = await loginPage.getErrorText();
            expect(errorText).not.toBeNull();
            expect(errorText!.trim().length).toBeGreaterThan(0);
        });

        test("3. Username tidak terdaftar → tampil pesan error", async ({
            page,
            loginPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();

            await loginPage.loginAs("user_tidak_ada_xyz", VALID_PASSWORD);

            await expect(loginPage.errorMsg).toBeVisible({ timeout: 10_000 });
            await expect(page).toHaveURL(/\/login/);
        });

        test("4. Toggle show/hide password berfungsi", async ({
            page,
            loginPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();
            await loginPage.fillPassword("rahasia123");

            // Default: tersembunyi
            expect(await loginPage.getPasswordInputType()).toBe("password");

            // Toggle on → terlihat
            await loginPage.togglePasswordVisibility();
            expect(await loginPage.getPasswordInputType()).toBe("text");

            // Toggle off → tersembunyi lagi
            await loginPage.togglePasswordVisibility();
            expect(await loginPage.getPasswordInputType()).toBe("password");
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // BAGIAN 2: Login berhasil → masuk ke Select Location
    // ─────────────────────────────────────────────────────────────────────────

    test.describe("Login Berhasil → Select Location", () => {

        test("5. Login valid → redirect ke /select-location → tampil greeting user", async ({
            page,
            loginPage,
            selectLocationPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();

            // Verifikasi elemen login ada
            await expect(loginPage.usernameInput).toBeVisible();
            await expect(loginPage.passwordInput).toBeVisible();
            await expect(loginPage.signinBtn).toBeEnabled();

            // Login
            await loginPage.loginAs(VALID_USERNAME, VALID_PASSWORD);

            // Redirect ke /select-location
            await page.waitForURL("**/select-location", { timeout: 15_000 });
            await expect(page).toHaveURL(/\/select-location/);

            // Halaman select-location tampil dengan benar
            await expect(selectLocationPage.form).toBeVisible();

            // Greeting menampilkan nama user
            const welcomeText = await selectLocationPage.getWelcomeText();
            expect(welcomeText).toMatch(/Hi\s+\S+/);
        });

        test("6. Submit tanpa pilih lokasi → tampil pesan error", async ({
            page,
            loginPage,
            selectLocationPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();
            await loginPage.loginAs(VALID_USERNAME, VALID_PASSWORD);
            await page.waitForURL("**/select-location", { timeout: 15_000 });

            // Dropdown masih kosong
            expect(await selectLocationPage.locationSelect.inputValue()).toBe("");

            // Klik Continue tanpa pilih lokasi
            await selectLocationPage.submit();

            await expect(selectLocationPage.errorMsg).toBeVisible({ timeout: 5_000 });
            const errorText = await selectLocationPage.getErrorText();
            expect(errorText).toContain("pilih lokasi");
            await expect(page).toHaveURL(/\/select-location/);
        });

        test("7. Semua 5 lokasi tersedia di dropdown", async ({
            page,
            loginPage,
            selectLocationPage,
        }) => {
            await clearSession(page);
            await loginPage.goto();
            await loginPage.loginAs(VALID_USERNAME, VALID_PASSWORD);
            await page.waitForURL("**/select-location", { timeout: 15_000 });

            const availableValues = await selectLocationPage.getAvailableLocationValues();
            const availableLabels = await selectLocationPage.getAvailableLocationLabels();

            expect(availableValues).toHaveLength(EXPECTED_LOCATIONS.length);
            for (const loc of EXPECTED_LOCATIONS) {
                expect(availableValues).toContain(loc.value);
                expect(availableLabels).toContain(loc.label);
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // BAGIAN 3: Full Flow — Login → Pilih Lokasi → Dashboard
    // ─────────────────────────────────────────────────────────────────────────

    test.describe("Full Auth Flow", () => {

        test("8. Login → pilih lokasi → Continue → masuk ke dashboard (/)", async ({
            page,
            loginPage,
            selectLocationPage,
        }) => {
            await clearSession(page);

            // Step 1: Login
            await loginPage.goto();
            await loginPage.loginAs(VALID_USERNAME, VALID_PASSWORD);
            await page.waitForURL("**/select-location", { timeout: 15_000 });

            // Step 2: Pilih lokasi "Head Office — Jakarta"
            await selectLocationPage.selectLocation("hq");
            expect(await selectLocationPage.locationSelect.inputValue()).toBe("hq");

            // Step 3: Klik Continue → redirect ke dashboard
            await selectLocationPage.submit();
            await page.waitForURL("**/", { timeout: 10_000 });
            await expect(page).toHaveURL(/localhost:3000\/$/);
        });

        test("9. Login → Logout dari select-location → kembali ke /login", async ({
            page,
            loginPage,
            selectLocationPage,
        }) => {
            await clearSession(page);

            // Login
            await loginPage.goto();
            await loginPage.loginAs(VALID_USERNAME, VALID_PASSWORD);
            await page.waitForURL("**/select-location", { timeout: 15_000 });

            // Klik Logout
            await expect(selectLocationPage.logoutBtn).toBeVisible();
            await selectLocationPage.logout();

            // Redirect ke /login
            await page.waitForURL("**/login", { timeout: 10_000 });
            await expect(page).toHaveURL(/\/login/);
            await expect(loginPage.form).toBeVisible();

            // Verifikasi localStorage dibersihkan
            const erpUser = await page.evaluate(() => localStorage.getItem("erp_user"));
            expect(erpUser).toBeNull();
        });
    });
});
