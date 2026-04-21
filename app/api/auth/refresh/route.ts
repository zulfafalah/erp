import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/app/lib/auth";
import { API_BASE_URL } from "@/app/lib/apiClient";

export async function POST(req: NextRequest) {
    try {
        const refresh = req.cookies.get(REFRESH_COOKIE)?.value;

        if (!refresh) {
            return NextResponse.json(
                { ok: false, message: "Refresh token tidak ditemukan." },
                { status: 401 },
            );
        }

        const backendRes = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });

        if (!backendRes.ok) {
            return NextResponse.json(
                { ok: false, message: "Sesi sudah berakhir. Silakan login kembali." },
                { status: 401 },
            );
        }

        const { access } = await backendRes.json() as { access: string };

        const response = NextResponse.json({ ok: true });
        response.cookies.set(ACCESS_COOKIE, access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });

        return response;
    } catch (err) {
        console.error("[/api/auth/refresh]", err);
        return NextResponse.json(
            { ok: false, message: "Terjadi kesalahan pada server." },
            { status: 500 },
        );
    }
}
