"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError("Username dan password harus diisi.");
            return;
        }

        setIsLoading(true);
        try {
            await login(username, password);
            // Redirect to Context Selection page after successful login
            router.push("/select-location");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login gagal. Coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center px-4">

            {/* ── Card ─────────────────────────────────────────────────────── */}
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

                    {/* Welcome text */}
                    <h1 className="text-[15px] font-semibold text-slate-600 mb-6 tracking-wide">
                        Welcome, please sign in
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-3" id="login-form">

                        {/* Username */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none select-none">
                                person
                            </span>
                            <input
                                id="input-username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                className="w-full h-10 pl-9 pr-4 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/15 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none select-none">
                                lock
                            </span>
                            <input
                                id="input-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                className="w-full h-10 pl-9 pr-10 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/15 transition-all"
                            />
                            <button
                                type="button"
                                id="btn-toggle-password"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p
                                id="login-error"
                                className="text-[12px] text-red-500 font-medium text-center pt-0.5"
                            >
                                {error}
                            </p>
                        )}

                        {/* Submit button */}
                        <button
                            id="btn-signin"
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
                                    Signing in…
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                    </form>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-[11px] text-slate-400 text-center select-none">
                e-SMART &copy; 2019 &ndash; 2026&nbsp;&nbsp;Ver.1.0-KTC
            </p>
        </div>
    );
}
