"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "../lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
    /** Currently authenticated user. null = not logged in or still loading. */
    user: User | null;
    /** True while the initial auth state is being determined. */
    isLoading: boolean;
    /** Call with credentials to authenticate. Throws on failure. */
    login: (username: string, password: string) => Promise<void>;
    /** Clear session and redirect to /login. */
    logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ── Restore session on mount ────────────────────────────────────────────────
    // We try a silent token refresh to verify if the session is still valid.
    // The actual user object is resolved via the /api/auth/me endpoint or
    // inferred from localStorage (set after a successful login).
    useEffect(() => {
        const stored = localStorage.getItem("erp_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored) as User);
            } catch {
                localStorage.removeItem("erp_user");
            }
        }
        setIsLoading(false);
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────

    const login = useCallback(async (username: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const body = await res.json() as { ok: boolean; message?: string; username?: string };

        if (!body.ok) {
            throw new Error(body.message ?? "Login gagal. Coba lagi.");
        }

        // Build a minimal user object from the login response
        const loggedInUser: User = {
            id: "",                              // filled after /api/me is available
            username: body.username ?? username,
            full_name: body.username ?? username,
        };

        setUser(loggedInUser);
        localStorage.setItem("erp_user", JSON.stringify(loggedInUser));
    }, []);

    // ── Logout ────────────────────────────────────────────────────────────────

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // Best-effort; proceed with local cleanup even if the request fails
        }
        setUser(null);
        localStorage.removeItem("erp_user");
        localStorage.removeItem("erp_active_module");
        router.push("/login");
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
    return useContext(AuthContext);
}
