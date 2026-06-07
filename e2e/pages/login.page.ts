import { type Page, type Locator, expect } from "@playwright/test";

// ─── Page Object Model: Login Page ───────────────────────────────────────────

/**
 * Encapsulates semua interaksi dengan halaman `/login`.
 *
 * Gunakan class ini di test untuk menghindari selector hardcoded
 * dan memudahkan maintenance saat UI berubah.
 */
export class LoginPage {
    readonly page: Page;

    // ── Locators ──────────────────────────────────────────────────────────────
    readonly form: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly togglePasswordBtn: Locator;
    readonly signinBtn: Locator;
    readonly errorMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form             = page.locator("#login-form");
        this.usernameInput    = page.locator("#input-username");
        this.passwordInput    = page.locator("#input-password");
        this.togglePasswordBtn = page.locator("#btn-toggle-password");
        this.signinBtn        = page.locator("#btn-signin");
        this.errorMsg         = page.locator("#login-error");
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    /** Navigasi ke halaman login */
    async goto() {
        await this.page.goto("/login");
        await expect(this.form).toBeVisible();
    }

    /** Isi field username */
    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    /** Isi field password */
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    /** Klik tombol Sign In */
    async submit() {
        await this.signinBtn.click();
    }

    /**
     * Flow login lengkap: isi form dan submit.
     * Tidak menunggu redirect — caller yang verifikasi hasil.
     */
    async loginAs(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit();
    }

    /** Toggle show/hide password */
    async togglePasswordVisibility() {
        await this.togglePasswordBtn.click();
    }

    // ── Assertions / Getters ─────────────────────────────────────────────────

    /** Kembalikan teks pesan error (atau null jika tidak tampil) */
    async getErrorText(): Promise<string | null> {
        if (await this.errorMsg.isVisible()) {
            return this.errorMsg.textContent();
        }
        return null;
    }

    /** Kembalikan tipe input password saat ini ('password' atau 'text') */
    async getPasswordInputType(): Promise<string | null> {
        return this.passwordInput.getAttribute("type");
    }

    /** Tunggu sampai redirect selesai ke URL tertentu */
    async waitForRedirectTo(urlPath: string) {
        await this.page.waitForURL(`**${urlPath}`, { timeout: 10_000 });
    }
}
