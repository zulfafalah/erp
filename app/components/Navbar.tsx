"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { modules } from "../config/menuConfig";
import { useActiveMenu } from "../context/ActiveMenuContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const { activeModule, setActiveModule } = useActiveMenu();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const isActive = (path: string) => pathname?.startsWith(path);
    const isModuleActive = (key: string) => activeModule === key;

    const activeClass = "text-primary text-sm font-semibold border-b-2 border-primary py-1";
    const inactiveClass = "text-slate-600 text-sm font-medium hover:text-primary transition-colors cursor-pointer";

    const mobileActiveClass = "block px-4 py-2 text-primary font-semibold bg-primary/10 rounded-lg";
    const mobileInactiveClass = "block px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors";

    const handleModuleClick = (key: string, href: string) => {
        setActiveModule(key);
        // If module has a real href, navigation will happen via Link
        // For modules with "#", we just switch the sidebar
    };

    // Separate settings from main modules
    const mainModules = modules.filter((m) => m.key !== "pengaturan");
    const settingsModule = modules.find((m) => m.key === "pengaturan");

    return (
        <>
            <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 bg-white px-4 md:px-6 py-3 shrink-0 relative z-40">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2 md:gap-3 text-primary">
                        <Image
                            src="/logoesmart2.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="size-7 md:size-8 object-contain"
                        />
                        <h2 className="text-slate-900 text-base md:text-lg font-bold leading-tight tracking-tight hidden sm:block">
                            ERP E-Smart
                        </h2>
                    </div>
                </div>

                <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
                    {mainModules.map((mod) =>
                        mod.href !== "#" ? (
                            <Link
                                key={mod.key}
                                className={isModuleActive(mod.key) ? activeClass : inactiveClass}
                                href={mod.href}
                                onClick={() => handleModuleClick(mod.key, mod.href)}
                            >
                                {mod.label}
                            </Link>
                        ) : (
                            <button
                                key={mod.key}
                                className={isModuleActive(mod.key) ? activeClass : inactiveClass}
                                onClick={() => handleModuleClick(mod.key, mod.href)}
                            >
                                {mod.label}
                            </button>
                        )
                    )}
                    {settingsModule && (
                        <button
                            className={isModuleActive(settingsModule.key) ? activeClass : inactiveClass}
                            onClick={() => handleModuleClick(settingsModule.key, settingsModule.href)}
                        >
                            {settingsModule.label}
                        </button>
                    )}
                </nav>

                <div className="flex items-center gap-2 md:gap-4">

                    {/* Mobile Search Icon */}
                    <button className="xl:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                        <span className="material-symbols-outlined">search</span>
                    </button>

                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    <div className="flex items-center gap-3 relative">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-slate-900">{user?.full_name || user?.username || "—"}</p>
                            <p className="text-[10px] text-slate-500">Administrator</p>
                        </div>
                        <button
                            id="btn-profile-menu"
                            onClick={() => setIsProfileOpen((v) => !v)}
                            className="size-8 md:size-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-primary text-xl md:text-xl">
                                person
                            </span>
                        </button>

                        {/* Profile dropdown */}
                        {isProfileOpen && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <div className="absolute right-0 top-11 w-48 bg-white rounded-xl border border-slate-100 shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-bold text-slate-800">{user?.full_name || user?.username || "—"}</p>
                                        <p className="text-xs text-slate-400">Administrator</p>
                                    </div>
                                    <button
                                        id="btn-navbar-logout"
                                        onClick={async () => { setIsProfileOpen(false); await logout(); }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-50 xl:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Navigation Drawer */}
            <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out xl:hidden shadow-2xl flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/logoesmart2.png" alt="Logo" width={32} height={32} className="size-8 object-contain" />
                        <h2 className="text-slate-900 text-lg font-bold">ERP E-Smart</h2>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{user?.full_name || user?.username || "—"}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {mainModules.map((mod) => (
                        mod.href !== "#" ? (
                            <Link
                                key={mod.key}
                                href={mod.href}
                                className={isModuleActive(mod.key) ? mobileActiveClass : mobileInactiveClass}
                                onClick={() => {
                                    handleModuleClick(mod.key, mod.href);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">{mod.icon}</span>
                                    {mod.label}
                                </div>
                            </Link>
                        ) : (
                            <button
                                key={mod.key}
                                className={isModuleActive(mod.key) ? mobileActiveClass : mobileInactiveClass}
                                onClick={() => {
                                    handleModuleClick(mod.key, mod.href);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <span className="material-symbols-outlined text-lg">{mod.icon}</span>
                                    {mod.label}
                                </div>
                            </button>
                        )
                    ))}

                    <div className="h-px bg-slate-100 my-2"></div>

                    {settingsModule && (
                        <button
                            className={isModuleActive(settingsModule.key) ? mobileActiveClass : mobileInactiveClass}
                            onClick={() => {
                                handleModuleClick(settingsModule.key, settingsModule.href);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-3 text-left">
                                <span className="material-symbols-outlined text-lg">{settingsModule.icon}</span>
                                {settingsModule.label}
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="xl:hidden fixed bottom-8 md:bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-between items-start z-[55] pb-safe pt-2 md:pt-3 pb-2 md:pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-1 md:px-12">
                <Link href="/" className="flex flex-col items-center p-1 text-slate-500 hover:text-primary w-1/5 overflow-hidden">
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">home</span>
                    <span className="text-[9px] md:text-[10px] font-medium w-full text-center truncate">Dashboard</span>
                </Link>
                <Link
                    href="/purchase-order"
                    className={`flex flex-col items-center p-1 w-1/5 overflow-hidden ${isActive("/purchase-order") ? "text-primary" : "text-slate-500 hover:text-primary"}`}
                    onClick={() => handleModuleClick("pembelian", "/purchase-order")}
                >
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">shopping_bag</span>
                    <span className="text-[9px] md:text-[10px] font-bold w-full text-center truncate">Pembelian</span>
                </Link>
                <Link
                    href="/sales"
                    onClick={() => handleModuleClick("penjualan", "/sales")}
                    className={`flex flex-col items-center p-1 w-1/5 overflow-hidden ${isModuleActive("penjualan") ? "text-primary" : "text-slate-500 hover:text-primary"}`}
                >
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">storefront</span>
                    <span className="text-[9px] md:text-[10px] font-medium w-full text-center truncate">Penjualan</span>
                </Link>
                <button
                    onClick={() => handleModuleClick("persediaan", "#")}
                    className={`flex flex-col items-center p-1 w-1/5 overflow-hidden ${isModuleActive("persediaan") ? "text-primary" : "text-slate-500 hover:text-primary"}`}
                >
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">inventory_2</span>
                    <span className="text-[9px] md:text-[10px] font-medium w-full text-center truncate">Persediaan</span>
                </button>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`flex flex-col items-center p-1 w-1/5 overflow-hidden ${isMobileMenuOpen ? "text-primary" : "text-slate-500 hover:text-primary"}`}
                >
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">grid_view</span>
                    <span className="text-[9px] md:text-[10px] font-medium w-full text-center truncate">Menu</span>
                </button>
            </div>
        </>
    );
}
