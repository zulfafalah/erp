import { NextResponse } from "next/server";
import { apiFetch } from "@/app/lib/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurrencyItem {
    currencyid: string;
    currencyname: string;
}

// Fallback list jika backend tidak memiliki endpoint currencies
const FALLBACK_CURRENCIES: CurrencyItem[] = [
    { currencyid: "RP",  currencyname: "Rupiah (IDR)" },
    { currencyid: "USD", currencyname: "US Dollar" },
    { currencyid: "EUR", currencyname: "Euro" },
    { currencyid: "SGD", currencyname: "Singapore Dollar" },
    { currencyid: "MYR", currencyname: "Malaysian Ringgit" },
];

// ─── GET — List Currencies ────────────────────────────────────────────────────

export async function GET() {
    try {
        // Coba fetch dari backend Django jika ada endpoint currencies
        const raw = await apiFetch<{ results?: CurrencyItem[]; data?: CurrencyItem[] } | CurrencyItem[]>(
            "/api/v1/currencies/?limit=100",
            { method: "GET" },
        );

        let data: CurrencyItem[] = [];
        if (Array.isArray(raw)) {
            data = raw;
        } else if (raw && "results" in raw && Array.isArray(raw.results)) {
            data = raw.results;
        } else if (raw && "data" in raw && Array.isArray(raw.data)) {
            data = raw.data;
        }

        if (data.length > 0) {
            return NextResponse.json({ ok: true, data }, { status: 200 });
        }
        // Fallback jika kosong atau tidak ada
        return NextResponse.json({ ok: true, data: FALLBACK_CURRENCIES }, { status: 200 });
    } catch {
        // Endpoint belum ada di backend — gunakan fallback hardcode
        return NextResponse.json({ ok: true, data: FALLBACK_CURRENCIES }, { status: 200 });
    }
}
