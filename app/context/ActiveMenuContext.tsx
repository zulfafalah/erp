"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getModuleByPath, modules } from "../config/menuConfig";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "erp_active_module";

interface ActiveMenuContextType {
    activeModule: string;
    setActiveModule: (key: string) => void;
}

const ActiveMenuContext = createContext<ActiveMenuContextType>({
    activeModule: "pembelian",
    setActiveModule: () => { },
});

export function ActiveMenuProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [activeModule, setActiveModuleState] = useState("pembelian");

    // Load persisted module from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && modules.some((m) => m.key === saved)) {
            setActiveModuleState(saved);
        }
    }, []);

    // Auto-detect active module based on the current route,
    // but only override the persisted choice when the new path
    // unambiguously belongs to a *different* module (i.e. the path
    // is not contained in the currently-active module's sidebar items).
    useEffect(() => {
        const currentMod = modules.find((m) => m.key === activeModule);
        const isPathInCurrentModule = currentMod?.sidebarSections.some((section) =>
            section.items.some((item) => {
                if (item.href === "#") return false;
                return pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith(item.href + "?");
            })
        );

        // If the path is already covered by the active module, keep it unchanged.
        if (isPathInCurrentModule) return;

        // Otherwise fall back to auto-detection (e.g. direct URL navigation).
        const matched = getModuleByPath(pathname);
        if (matched) {
            setActiveModuleState(matched.key);
            localStorage.setItem(STORAGE_KEY, matched.key);
        }
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    const setActiveModule = (key: string) => {
        setActiveModuleState(key);
        localStorage.setItem(STORAGE_KEY, key);
    };

    return (
        <ActiveMenuContext.Provider value={{ activeModule, setActiveModule }}>
            {children}
        </ActiveMenuContext.Provider>
    );
}

export function useActiveMenu() {
    return useContext(ActiveMenuContext);
}
