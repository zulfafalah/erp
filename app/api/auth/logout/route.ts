import { NextResponse } from "next/server";
import { buildClearCookieHeaders } from "@/app/lib/auth";

export async function POST() {
    const response = NextResponse.json({ ok: true });

    for (const { name, options } of buildClearCookieHeaders()) {
        response.cookies.set(name, "", options as Parameters<typeof response.cookies.set>[2]);
    }

    return response;
}
