"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveMenu } from "../context/ActiveMenuContext";
import { getModuleByKey } from "../config/menuConfig";

export default function Sidebar() {
    const pathname = usePathname();
    const { activeModule } = useActiveMenu();
    const [collapsed, setCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const moduleConfig = getModuleByKey(activeModule);
    const sidebarSections = moduleConfig?.sidebarSections ?? [];

    useEffect(() => {
        setIsMounted(true);
        const savedState = localStorage.getItem("sidebar_collapsed");
        if (savedState) {
            setCollapsed(JSON.parse(savedState));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("sidebar_collapsed", JSON.stringify(newState));
    };

    const linkBase =
        "flex items-center rounded-lg transition-all duration-300";
    const linkExpanded = "gap-3 px-3 py-2.5";
    const linkCollapsed = "justify-center px-0 py-2.5";

    const linkClass = (extra: string = "") =>
        `${linkBase} ${collapsed ? linkCollapsed : linkExpanded} ${extra}`;

    const isLinkActive = (href: string) =>
        href !== "#" && pathname?.startsWith(href);

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

                {/* Module Title */}
                {!hideLabel && moduleConfig && (
                    <div className="px-4 pt-4 pb-2 border-b border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                            {moduleConfig.label}
                        </h3>
                    </div>
                )}

                <div
                    className={`space-y-1 flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${containerPadding}`}
                >
                    {sidebarSections.length > 0 ? (
                        sidebarSections.map((section, sIdx) => (
                            <div key={sIdx} className={sIdx > 0 ? "pt-3" : ""}>
                                {/* Section Title */}
                                {!hideLabel && (
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
                                        {section.title}
                                    </p>
                                )}
                                {hideLabel && sIdx > 0 && (
                                    <div className="h-px bg-slate-100 my-2"></div>
                                )}
                                <div className="space-y-0.5">
                                    {section.items.map((item, iIdx) => (
                                        <Link
                                            key={iIdx}
                                            className={linkClass(
                                                isLinkActive(item.href)
                                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                                    : "text-slate-600 hover:bg-slate-100"
                                            )}
                                            href={item.href}
                                            title={item.label}
                                        >
                                            <span className="material-symbols-outlined shrink-0 text-[22px]">
                                                {item.icon}
                                            </span>
                                            {!hideLabel && (
                                                <span className="text-sm font-medium whitespace-nowrap">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                            <span className="material-symbols-outlined text-3xl mb-2">construction</span>
                            {!hideLabel && (
                                <p className="text-xs font-medium text-center">Menu belum tersedia</p>
                            )}
                        </div>
                    )}
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
