import { NextRequest, NextResponse } from "next/server";
import { buildAuthCookieHeaders } from "@/app/lib/auth";
import { API_BASE_URL } from "@/app/lib/apiClient";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json() as {
            username?: string;
            password?: string;
        };

        if (!username || !password) {
            return NextResponse.json(
                { ok: false, message: "Username dan password harus diisi." },
                { status: 400 },
            );
        }

        // ── Forward to backend ────────────────────────────────────────────────
        const backendRes = await fetch(`${API_BASE_URL}/api/auth/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!backendRes.ok) {
            const errBody = await backendRes.json().catch(() => ({})) as Record<string, unknown>;
            const message =
                typeof errBody.detail === "string"
                    ? errBody.detail
                    : "Username atau password salah.";

            return NextResponse.json(
                { ok: false, message },
                { status: backendRes.status },
            );
        }

        const { access, refresh } = await backendRes.json() as {
            access: string;
            refresh: string;
        };

        // ── Build response with httpOnly cookies ───────────────────────────────
        const response = NextResponse.json({ ok: true, username });

        for (const { name, value, options } of buildAuthCookieHeaders(access, refresh)) {
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
        }

        return response;
    } catch (err) {
        console.error("[/api/auth/login]", err);
        return NextResponse.json(
            { ok: false, message: "Terjadi kesalahan pada server. Coba lagi." },
            { status: 500 },
        );
    }
}
