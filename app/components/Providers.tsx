"use client";

import { ReactNode } from "react";
import { ActiveMenuProvider } from "../context/ActiveMenuContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ActiveMenuProvider>
            {children}
        </ActiveMenuProvider>
    );
}
