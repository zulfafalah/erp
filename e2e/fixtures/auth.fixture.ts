import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { SelectLocationPage } from "../pages/select-location.page";

// ─── Custom Fixture Types ─────────────────────────────────────────────────────

type Fixtures = {
    /** Page Object untuk halaman /login */
    loginPage: LoginPage;
    /** Page Object untuk halaman /select-location */
    selectLocationPage: SelectLocationPage;
    /** Helper: login dan tunggu redirect ke /select-location */
    loginAndGoToSelectLocation: (username?: string, password?: string) => Promise<void>;
};

// ─── Extended Test dengan Custom Fixtures ─────────────────────────────────────

export const test = base.extend<Fixtures>({
    /**
     * Fixture: LoginPage POM — otomatis navigate ke /login saat dipakai
     */
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    /**
     * Fixture: SelectLocationPage POM — otomatis navigate ke /select-location saat dipakai
     */
    selectLocationPage: async ({ page }, use) => {
        const selectLocationPage = new SelectLocationPage(page);
        await use(selectLocationPage);
    },

    /**
     * Fixture: Helper untuk login lengkap dan tunggu redirect ke select-location.
     * Berguna untuk test yang perlu setup cepat sebelum menguji halaman lain.
     */
    loginAndGoToSelectLocation: async ({ page }, use) => {
        const helper = async (
            username = process.env.TEST_USERNAME ?? "falah",
            password = process.env.TEST_PASSWORD ?? "admin",
        ) => {
            await page.goto("/login");
            await page.locator("#input-username").fill(username);
            await page.locator("#input-password").fill(password);
            await page.locator("#btn-signin").click();
            await page.waitForURL("**/select-location", { timeout: 15_000 });
            await expect(page.locator("#select-location-form")).toBeVisible();
        };
        await use(helper);
    },
});

// Re-export expect dan Page agar test file tidak perlu import terpisah
export { expect };
export type { Page } from "@playwright/test";
