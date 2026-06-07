import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Load test env vars
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env.test.local") });

// ─── Auth state file path ─────────────────────────────────────────────────────
export const STORAGE_STATE = path.resolve(__dirname, ".auth/user.json");

// ─── Base URL ─────────────────────────────────────────────────────────────────
const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";

/**
 * Playwright E2E configuration untuk ERP e-SMART.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // ── Test directory ──────────────────────────────────────────────────────────
    testDir: "./e2e",

    // ── Global settings ─────────────────────────────────────────────────────────
    // workers: 1 → test berjalan sekuensial, mencegah race condition saat
    // clearSession() di satu test mengganggu test lain yang berjalan bersamaan.
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,

    // ── Timeouts ────────────────────────────────────────────────────────────────
    timeout: 30_000,               // 30 detik per test
    expect: { timeout: 10_000 },   // 10 detik per assertion

    // ── Reporter ────────────────────────────────────────────────────────────────
    reporter: [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }],
    ],

    // ── Shared settings ─────────────────────────────────────────────────────────
    use: {
        baseURL: BASE_URL,
        trace: "on-first-retry",       // Ambil trace saat retry
        screenshot: "only-on-failure", // Screenshot hanya saat gagal
        video: "retain-on-failure",    // Video hanya saat gagal
        locale: "id-ID",
    },

    // ── Projects ─────────────────────────────────────────────────────────────────
    // Firefox diaktifkan hanya di CI (set env CI=true).
    // Untuk local dev, cukup Chromium agar tidak ada race condition.
    projects: [
        // 1. Setup — login sekali dan simpan auth state
        {
            name: "setup",
            testMatch: /auth\.setup\.ts/,
        },

        // 2. Chromium — browser utama untuk local dev
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                storageState: STORAGE_STATE,
            },
            dependencies: ["setup"],
        },

        // 3. Firefox — hanya aktif di CI
        ...(process.env.CI ? [{
            name: "firefox",
            use: {
                ...devices["Desktop Firefox"],
                storageState: STORAGE_STATE,
            },
            dependencies: ["setup"],
        }] : []),
    ],

    // ── Web server ───────────────────────────────────────────────────────────────
    // Reuse dev server yang sudah berjalan. Jika belum ada, start otomatis.
    webServer: {
        command: "npm run dev",
        url: BASE_URL,
        reuseExistingServer: true, // Reuse server yang sudah jalan di port 3000
        timeout: 120_000,
    },
});
