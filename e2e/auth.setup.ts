import { test as setup, expect } from "@playwright/test";
import path from "path";

// ─── Auth State File ──────────────────────────────────────────────────────────
// File ini menyimpan cookies + localStorage setelah login berhasil.
// Semua test lain akan me-load state ini sehingga tidak perlu login ulang.
const authFile = path.resolve(__dirname, "../.auth/user.json");

// ─── Credentials dari environment ─────────────────────────────────────────────
const USERNAME = process.env.TEST_USERNAME ?? "falah";
const PASSWORD = process.env.TEST_PASSWORD ?? "admin";

// ─── Setup: Login dan simpan auth state ───────────────────────────────────────

setup("authenticate", async ({ page }) => {
    // 1. Buka halaman login
    await page.goto("/login");
    await expect(page.locator("#login-form")).toBeVisible();

    // 2. Isi credentials
    await page.locator("#input-username").fill(USERNAME);
    await page.locator("#input-password").fill(PASSWORD);

    // 3. Klik Sign In
    await page.locator("#btn-signin").click();

    // 4. Tunggu redirect ke /select-location setelah login berhasil
    await page.waitForURL("**/select-location", { timeout: 15_000 });

    // 5. Pastikan halaman select-location berhasil dimuat
    await expect(page.locator("#select-location-form")).toBeVisible();

    // 6. Simpan auth state (cookies + localStorage) ke file
    //    Test lain akan meng-load state ini via storageState di playwright.config.ts
    await page.context().storageState({ path: authFile });

    console.log(`✅ Auth setup selesai. State disimpan ke: ${authFile}`);
});
