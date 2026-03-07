"use client";

import { useState, useEffect } from "react";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Cek localStorage saat komponen di-mount di client
        const savedState = localStorage.getItem("sidebar_collapsed");
        if (savedState) {
            setCollapsed(JSON.parse(savedState));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        // Simpan state ke localStorage
        localStorage.setItem("sidebar_collapsed", JSON.stringify(newState));
    };

    const linkBase =
        "flex items-center rounded-lg transition-all duration-300";
    const linkExpanded = "gap-3 px-3 py-2.5";
    const linkCollapsed = "justify-center px-0 py-2.5";

    const linkClass = (extra: string = "") =>
        `${linkBase} ${collapsed ? linkCollapsed : linkExpanded} ${extra}`;

    // Hindari hydration mismatch dengan tidak merender style beda di server vs client pertama kali
    // Asumsi default adalah w-60 kalau belum mounted (kondisi awal)
    const sidebarWidth = isMounted && collapsed ? "w-[68px]" : "w-60";
    const containerPadding = isMounted && collapsed ? "px-2 py-4" : "p-4";
    const hideLabel = isMounted && collapsed;

    return (
        <aside
            className={`relative border-r border-primary/10 bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out ${sidebarWidth}`}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-4 z-10 size-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 hover:border-primary/30 transition-all"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span
                    className={`material-symbols-outlined !text-xs text-slate-500 transition-transform duration-300 ${collapsed ? "rotate-180" : ""
                        }`}
                >
                    chevron_left
                </span>
            </button>

            <div
                className={`space-y-1 flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${containerPadding}`}
            >
                <a
                    className={linkClass("text-slate-600 hover:bg-slate-100")}
                    href="#"
                    title="Overview"
                >
                    <span className="material-symbols-outlined shrink-0 text-[22px]">home</span>
                    {!hideLabel && (
                        <span className="text-sm font-medium whitespace-nowrap">
                            Overview
                        </span>
                    )}
                </a>
                <a
                    className={linkClass(
                        "bg-primary text-white shadow-md shadow-primary/20"
                    )}
                    href="/purchase-order"
                    title="Purchase Orders"
                >
                    <span className="material-symbols-outlined shrink-0 text-[22px]">
                        shopping_cart
                    </span>
                    {!hideLabel && (
                        <span className="text-sm font-medium whitespace-nowrap">
                            Purchase Orders
                        </span>
                    )}
                </a>
                <a
                    className={linkClass("text-slate-600 hover:bg-slate-100")}
                    href="#"
                    title="Suppliers"
                >
                    <span className="material-symbols-outlined shrink-0 text-[22px]">
                        local_shipping
                    </span>
                    {!hideLabel && (
                        <span className="text-sm font-medium whitespace-nowrap">
                            Suppliers
                        </span>
                    )}
                </a>
                <a
                    className={linkClass("text-slate-600 hover:bg-slate-100")}
                    href="#"
                    title="Reports"
                >
                    <span className="material-symbols-outlined shrink-0 text-[22px]">
                        analytics
                    </span>
                    {!hideLabel && (
                        <span className="text-sm font-medium whitespace-nowrap">
                            Reports
                        </span>
                    )}
                </a>
                <div className="my-3 border-t border-slate-100"></div>
                <a
                    className={linkClass("text-slate-600 hover:bg-slate-100")}
                    href="#"
                    title="Settings"
                >
                    <span className="material-symbols-outlined shrink-0 text-[22px]">
                        settings
                    </span>
                    {!hideLabel && (
                        <span className="text-sm font-medium whitespace-nowrap">
                            Settings
                        </span>
                    )}
                </a>
            </div>
            <div
                className={`border-t border-slate-100 transition-all duration-300 ${containerPadding}`}
            >
                <button
                    className={`w-full bg-slate-100 text-slate-700 py-2 rounded-lg flex items-center ${collapsed ? "justify-center px-0" : "justify-center gap-2"
                        } hover:bg-slate-200 transition-all`}
                    title="Exit"
                >
                    <span className="material-symbols-outlined text-lg shrink-0">logout</span>
                    {!hideLabel && (
                        <span className="text-sm font-semibold whitespace-nowrap">
                            Exit
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
