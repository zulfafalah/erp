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
    const sidebarWidthDesktop = isMounted && collapsed ? "md:w-[68px]" : "md:w-60";
    const sidebarStateMobile = isMounted && !collapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0";
    const containerPadding = isMounted && collapsed ? "px-2 py-4" : "p-4";
    const hideLabel = isMounted && collapsed;

    return (
        <>
            {/* Mobile Overlay */}
            {isMounted && !collapsed && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-[45] md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setCollapsed(true)}
                ></div>
            )}

            <aside
                className={`fixed md:relative top-0 left-0 h-full md:h-auto z-[50] border-r border-primary/10 bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out w-60 ${sidebarWidthDesktop} ${sidebarStateMobile}`}
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex absolute -right-3 top-4 z-10 size-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm hover:bg-slate-50 hover:border-primary/30 transition-all"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span
                        className={`material-symbols-outlined !text-xs text-slate-500 transition-transform duration-300 ${collapsed ? "rotate-180" : ""
                            }`}
                    >
                        chevron_left
                    </span>
                </button>

                {/* Mobile Floating Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className={`md:hidden absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-white border border-slate-200 shadow-md ${collapsed ? "-right-7 rounded-r-xl border-l-0 py-3 px-1 hover:bg-slate-50" : "-right-4 size-8 rounded-full hover:bg-slate-50"
                        } text-primary transition-all duration-300`}
                >
                    <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}>
                        chevron_left
                    </span>
                </button>

                <div
                    className={`space-y-1 flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${containerPadding}`}
                >
                    <a
                        className={linkClass("text-slate-600 hover:bg-slate-100")}
                        href="#"
                        title="Pemasok"
                    >
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            local_shipping
                        </span>
                        {!hideLabel && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Pemasok
                            </span>
                        )}
                    </a>
                    <a
                        className={linkClass("text-slate-600 hover:bg-slate-100")}
                        href="#"
                        title="Permintaan"
                    >
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            assignment
                        </span>
                        {!hideLabel && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Permintaan
                            </span>
                        )}
                    </a>
                    <a
                        className={linkClass(
                            "bg-primary text-white shadow-md shadow-primary/20"
                        )}
                        href="/purchase-order"
                        title="Pesanan"
                    >
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            shopping_cart
                        </span>
                        {!hideLabel && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Pesanan
                            </span>
                        )}
                    </a>
                    <a
                        className={linkClass("text-slate-600 hover:bg-slate-100")}
                        href="#"
                        title="Penerimaan"
                    >
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            inventory_2
                        </span>
                        {!hideLabel && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Penerimaan
                            </span>
                        )}
                    </a>
                    <a
                        className={linkClass("text-slate-600 hover:bg-slate-100")}
                        href="#"
                        title="Faktur Pembelian"
                    >
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            receipt_long
                        </span>
                        {!hideLabel && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Faktur Pembelian
                            </span>
                        )}
                    </a>
                    <a
                        className={linkClass("text-slate-600 hover:bg-slate-100")}
                        href="#"
                        title="Retur Pembelian"
                    >
                        <span className="material-symbols-outlined shrink-0 text-[22px]">
                            assignment_return
                        </span>
                        {!hideLabel && (
                            <span className="text-sm font-medium whitespace-nowrap">
                                Retur Pembelian
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
        </>
    );
}
