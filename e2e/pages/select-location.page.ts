import { type Page, type Locator, expect } from "@playwright/test";

// ─── Page Object Model: Select Location Page ─────────────────────────────────

/**
 * Encapsulates semua interaksi dengan halaman `/select-location`.
 */
export class SelectLocationPage {
    readonly page: Page;

    // ── Locators ──────────────────────────────────────────────────────────────
    readonly form: Locator;
    readonly locationSelect: Locator;
    readonly continueBtn: Locator;
    readonly logoutBtn: Locator;
    readonly errorMsg: Locator;
    readonly welcomeText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form           = page.locator("#select-location-form");
        this.locationSelect = page.locator("#select-location");
        this.continueBtn    = page.locator("#btn-continue");
        this.logoutBtn      = page.locator("#btn-logout");
        this.errorMsg       = page.locator("#select-location-error");
        // Greeting "Hi <nama>"
        this.welcomeText    = page.locator("p").filter({ hasText: /Hi\s/ }).first();
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    /** Navigasi ke halaman select-location */
    async goto() {
        await this.page.goto("/select-location");
        await expect(this.form).toBeVisible();
    }

    /**
     * Pilih lokasi berdasarkan value option.
     * @example await selectLocationPage.selectLocation("hq")
     */
    async selectLocation(value: string) {
        await this.locationSelect.selectOption(value);
    }

    /**
     * Pilih lokasi berdasarkan label yang tampil di dropdown.
     * @example await selectLocationPage.selectLocationByLabel("Head Office — Jakarta")
     */
    async selectLocationByLabel(label: string) {
        await this.locationSelect.selectOption({ label });
    }

    /** Klik tombol Continue */
    async submit() {
        await this.continueBtn.click();
    }

    /** Klik tombol Logout */
    async logout() {
        await this.logoutBtn.click();
    }

    /** Flow lengkap: pilih lokasi lalu submit */
    async selectAndContinue(locationValue: string) {
        await this.selectLocation(locationValue);
        await this.submit();
    }

    // ── Assertions / Getters ─────────────────────────────────────────────────

    /** Teks pesan error (atau null jika tidak tampil) */
    async getErrorText(): Promise<string | null> {
        if (await this.errorMsg.isVisible()) {
            return this.errorMsg.textContent();
        }
        return null;
    }

    /** Teks greeting (mis. "Hi falah, here are the available locations") */
    async getWelcomeText(): Promise<string | null> {
        return this.welcomeText.textContent();
    }

    /** Daftar semua option value yang tersedia di dropdown (kecuali placeholder) */
    async getAvailableLocationValues(): Promise<string[]> {
        const options = await this.locationSelect.locator("option").all();
        const values: string[] = [];
        for (const opt of options) {
            const val = await opt.getAttribute("value");
            if (val && val !== "") {
                values.push(val);
            }
        }
        return values;
    }

    /** Daftar semua label lokasi yang tersedia di dropdown */
    async getAvailableLocationLabels(): Promise<string[]> {
        const options = await this.locationSelect.locator("option:not([disabled])").all();
        const labels: string[] = [];
        for (const opt of options) {
            const text = await opt.textContent();
            if (text?.trim()) {
                labels.push(text.trim());
            }
        }
        return labels;
    }

    /** Tunggu sampai redirect selesai ke URL tertentu */
    async waitForRedirectTo(urlPath: string) {
        await this.page.waitForURL(`**${urlPath}`, { timeout: 10_000 });
    }
}
