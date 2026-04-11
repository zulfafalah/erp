"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getModuleByPath, modules } from "../config/menuConfig";
import { usePathname, useSearchParams } from "next/navigation";

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
    const searchParams = useSearchParams();
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

                const searchString = searchParams.toString();
                const currentFullPath = searchString ? `${pathname}?${searchString}` : pathname;

                if (currentFullPath === item.href) return true;
                if (pathname === item.href && !item.href.includes("?")) return true;
                return pathname.startsWith(item.href + "/") || (pathname.startsWith(item.href + "?") && !item.href.includes("?"));
            })
        );

        // If the path is already covered by the active module, keep it unchanged.
        if (isPathInCurrentModule) return;

        // Otherwise fall back to auto-detection (e.g. direct URL navigation).
        const searchString = searchParams.toString();
        const fullPathForModule = searchString ? `${pathname}?${searchString}` : pathname;

        const matched = getModuleByPath(fullPathForModule);
        if (matched) {
            setActiveModuleState(matched.key);
            localStorage.setItem(STORAGE_KEY, matched.key);
        }
    }, [pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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
