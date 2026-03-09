"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getModuleByPath } from "../config/menuConfig";
import { usePathname } from "next/navigation";

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
    const [activeModule, setActiveModule] = useState("pembelian");

    // Auto-detect active module based on the current route
    useEffect(() => {
        const matched = getModuleByPath(pathname);
        if (matched) {
            setActiveModule(matched.key);
        }
    }, [pathname]);

    return (
        <ActiveMenuContext.Provider value={{ activeModule, setActiveModule }}>
            {children}
        </ActiveMenuContext.Provider>
    );
}

export function useActiveMenu() {
    return useContext(ActiveMenuContext);
}
