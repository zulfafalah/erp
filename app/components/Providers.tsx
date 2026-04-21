"use client";

import { ReactNode } from "react";
import { ActiveMenuProvider } from "../context/ActiveMenuContext";
import { AuthProvider } from "../context/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <ActiveMenuProvider>
                {children}
            </ActiveMenuProvider>
        </AuthProvider>
    );
}
