"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

// ─── Mock Locations ────────────────────────────────────────────────────────────

const LOCATIONS = [
    { value: "hq", label: "Head Office — Jakarta" },
    { value: "br-bdg", label: "Cabang Bandung" },
    { value: "br-sby", label: "Cabang Surabaya" },
    { value: "br-mdn", label: "Cabang Medan" },
    { value: "wh-ckg", label: "Gudang Cikampek" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SelectLocationPage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const [selectedLocation, setSelectedLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedLocation) {
            setError("Silakan pilih lokasi terlebih dahulu.");
            return;
        }

        setIsLoading(true);
        // TODO: call API to persist selected location/branch in session
        // For now, just navigate to the dashboard
        await new Promise((r) => setTimeout(r, 400));
        router.push("/");
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center px-4">

            {/* ── Card ──────────────────────────────────────────────────────────── */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg shadow-slate-200/80 border border-slate-100 overflow-hidden">

                {/* Card top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-[#137fec] to-[#29b6f6]" />

                <div className="px-8 pt-10 pb-8 flex flex-col items-center">

                    {/* Logo */}
                    <div className="mb-5 flex items-center justify-center">
                        <Image
                            src="/icon.png"
                            alt="e-SMART Logo"
                            width={72}
                            height={72}
                            priority
                            className="drop-shadow-sm"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">
                        Select Location
                    </h1>
                    <p className="text-[13px] text-slate-500 mb-6 text-center leading-snug">
                        Hi <span className="font-semibold text-slate-700">{user?.full_name || user?.username || "Administrator"}</span>,
                        here are the available locations
                    </p>

                    {/* Form */}
                    <form onSubmit={handleContinue} className="w-full space-y-4" id="select-location-form">

                        {/* Location Dropdown */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none select-none">
                                location_on
                            </span>
                            <select
                                id="select-location"
                                value={selectedLocation}
                                onChange={(e) => {
                                    setSelectedLocation(e.target.value);
                                    setError(null);
                                }}
                                className="w-full h-10 pl-9 pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/15 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>
                                    :: Select Location ::
                                </option>
                                {LOCATIONS.map((loc) => (
                                    <option key={loc.value} value={loc.value}>
                                        {loc.label}
                                    </option>
                                ))}
                            </select>
                            {/* Chevron icon */}
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none select-none">
                                expand_more
                            </span>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p
                                id="select-location-error"
                                className="text-[12px] text-red-500 font-medium text-center pt-0.5"
                            >
                                {error}
                            </p>
                        )}

                        {/* Continue button */}
                        <button
                            id="btn-continue"
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-10 mt-1 bg-[#137fec] hover:bg-[#1170d0] disabled:bg-[#137fec]/70 text-white text-sm font-semibold rounded-lg shadow-md shadow-[#137fec]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin size-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                        />
                                    </svg>
                                    Loading…
                                </>
                            ) : (
                                "Continue"
                            )}
                        </button>

                    </form>

                    {/* Logout link */}
                    <button
                        id="btn-logout"
                        type="button"
                        onClick={handleLogout}
                        className="mt-4 text-[13px] text-[#137fec] hover:text-[#1170d0] hover:underline transition-colors font-medium"
                    >
                        Logout
                    </button>

                </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-[11px] text-slate-400 text-center select-none">
                e-SMART &copy; 2019 &ndash; 2026&nbsp;&nbsp;Ver.1.0
            </p>
        </div>
    );
}
