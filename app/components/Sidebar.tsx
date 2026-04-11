"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useActiveMenu } from "../context/ActiveMenuContext";
import { getModuleByKey } from "../config/menuConfig";

export default function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { activeModule } = useActiveMenu();
    const [collapsed, setCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    const moduleConfig = getModuleByKey(activeModule);
    const sidebarSections = moduleConfig?.sidebarSections ?? [];

    useEffect(() => {
        setIsMounted(true);
        const savedState = localStorage.getItem("sidebar_collapsed");
        if (savedState) {
            setCollapsed(JSON.parse(savedState));
        }
        const savedSections = localStorage.getItem("sidebar_sections_collapsed");
        if (savedSections) {
            setCollapsedSections(JSON.parse(savedSections));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("sidebar_collapsed", JSON.stringify(newState));
    };

    const toggleSection = useCallback((sectionKey: string) => {
        setCollapsedSections((prev) => {
            const next = { ...prev, [sectionKey]: !prev[sectionKey] };
            localStorage.setItem("sidebar_sections_collapsed", JSON.stringify(next));
            return next;
        });
    }, []);

    const isLinkActive = (href: string) => {
        if (href === "#" || !pathname) return false;

        const searchString = searchParams.toString();
        const currentFullPath = searchString ? `${pathname}?${searchString}` : pathname;

        if (currentFullPath === href) return true;
        if (pathname === href && !href.includes("?")) return true;

        return pathname.startsWith(href + "/") || (pathname.startsWith(href + "?") && !href.includes("?"));
    };

    const sidebarWidthDesktop = isMounted && collapsed ? "md:w-[68px]" : "md:w-[270px]";
    const sidebarStateMobile = isMounted && !collapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0";
    const containerPadding = isMounted && collapsed ? "px-2 py-4" : "px-3 py-4";
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
                className={`fixed md:relative top-0 left-0 h-full md:h-auto z-[50] border-r border-slate-200/80 bg-white flex flex-col shrink-0 transition-all duration-300 ease-in-out w-[270px] ${sidebarWidthDesktop} ${sidebarStateMobile}`}
                style={{ boxShadow: "1px 0 8px rgba(0,0,0,0.03)" }}
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex absolute -right-3 top-4 z-10 size-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <span
                        className={`material-symbols-outlined !text-xs text-slate-400 hover:text-primary transition-all duration-300 ${collapsed ? "rotate-180" : ""
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
                    <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                                <span className="material-symbols-outlined text-primary !text-[18px]">
                                    {moduleConfig.icon}
                                </span>
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                                {moduleConfig.label}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Collapsed Module Icon */}
                {hideLabel && moduleConfig && (
                    <div className="flex justify-center pt-4 pb-2 border-b border-slate-100">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10" title={moduleConfig.label}>
                            <span className="material-symbols-outlined text-primary !text-[20px]">
                                {moduleConfig.icon}
                            </span>
                        </div>
                    </div>
                )}

                <div
                    className={`space-y-0.5 flex-1 overflow-y-auto no-scrollbar transition-all duration-300 ${containerPadding}`}
                >
                    {sidebarSections.length > 0 ? (
                        sidebarSections.map((section, sIdx) => {
                            const sectionKey = `${activeModule}_${sIdx}`;
                            const isSectionCollapsed = collapsedSections[sectionKey] ?? false;

                            return (
                                <div key={sIdx} className={sIdx > 0 ? "pt-2" : ""}>
                                    {/* Section Title - clickable to collapse */}
                                    {!hideLabel && (
                                        <button
                                            onClick={() => toggleSection(sectionKey)}
                                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-50 group transition-colors duration-150"
                                        >
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-500 transition-colors">
                                                {section.title}
                                            </p>
                                            <span
                                                className={`material-symbols-outlined !text-[14px] text-slate-300 group-hover:text-slate-400 transition-all duration-200 ${isSectionCollapsed ? "-rotate-90" : ""
                                                    }`}
                                            >
                                                expand_more
                                            </span>
                                        </button>
                                    )}
                                    {hideLabel && sIdx > 0 && (
                                        <div className="h-px bg-slate-100 my-2"></div>
                                    )}

                                    {/* Section Items with collapse animation */}
                                    <div
                                        className={`space-y-0.5 overflow-hidden transition-all duration-200 ease-in-out ${!hideLabel && isSectionCollapsed
                                            ? "max-h-0 opacity-0"
                                            : "max-h-[2000px] opacity-100"
                                            }`}
                                    >
                                        {section.items.map((item, iIdx) => {
                                            const active = isLinkActive(item.href);
                                            return (
                                                <Link
                                                    key={iIdx}
                                                    className={`flex items-center rounded-lg transition-all duration-200 group relative ${collapsed
                                                        ? "justify-center px-0 py-2.5"
                                                        : "gap-3 px-3 py-2"
                                                        } ${active
                                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                        }`}
                                                    href={item.href}
                                                    title={item.label}
                                                >
                                                    <span
                                                        className={`material-symbols-outlined shrink-0 transition-transform duration-200 group-hover:scale-110 ${collapsed ? "text-[22px]" : "text-[20px]"
                                                            }`}
                                                    >
                                                        {item.icon}
                                                    </span>
                                                    {!hideLabel && (
                                                        <span className="text-[13px] font-medium leading-tight truncate">
                                                            {item.label}
                                                        </span>
                                                    )}

                                                    {/* Tooltip for collapsed mode */}
                                                    {hideLabel && (
                                                        <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-[60] shadow-lg">
                                                            {item.label}
                                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                                                        </div>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
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
                        className={`w-full bg-slate-50 text-slate-600 py-2 rounded-lg flex items-center ${collapsed ? "justify-center px-0" : "justify-center gap-2"
                            } hover:bg-red-50 hover:text-red-600 transition-all duration-200 group`}
                        title="Exit"
                    >
                        <span className="material-symbols-outlined text-lg shrink-0 group-hover:scale-110 transition-transform duration-200">logout</span>
                        {!hideLabel && (
                            <span className="text-sm font-semibold">
                                Exit
                            </span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
