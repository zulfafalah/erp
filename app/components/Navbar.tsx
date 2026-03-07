"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname?.startsWith(path);

    const activeClass = "text-primary text-sm font-semibold border-b-2 border-primary py-1";
    const inactiveClass = "text-slate-600 text-sm font-medium hover:text-primary transition-colors";

    const mobileActiveClass = "block px-4 py-2 text-primary font-semibold bg-primary/10 rounded-lg";
    const mobileInactiveClass = "block px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors";

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
                    <Link className={isActive("/purchase-order") ? activeClass : inactiveClass} href="/purchase-order">
                        Pembelian
                    </Link>
                    <Link className={inactiveClass} href="#">
                        Penjualan
                    </Link>
                    <Link className={inactiveClass} href="#">
                        Persediaan Barang
                    </Link>
                    <Link className={inactiveClass} href="#">
                        Keuangan
                    </Link>
                    <Link className={inactiveClass} href="#">
                        Akunting
                    </Link>
                    <Link className={inactiveClass} href="#">
                        Laporan
                    </Link>
                    <Link className={inactiveClass} href="#">
                        Pengaturan
                    </Link>
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

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-slate-900">Alex Thompson</p>
                            <p className="text-[10px] text-slate-500">Procurement Manager</p>
                        </div>
                        <div className="size-8 md:size-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-xl md:text-xl">
                                person
                            </span>
                        </div>
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
                            <p className="font-bold text-slate-900">Alex Thompson</p>
                            <p className="text-xs text-slate-500">Procurement Manager</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    <Link
                        href="/purchase-order"
                        className={isActive("/purchase-order") ? mobileActiveClass : mobileInactiveClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">shopping_cart</span>
                            Pembelian
                        </div>
                    </Link>
                    <Link href="#" className={mobileInactiveClass} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">storefront</span>
                            Penjualan
                        </div>
                    </Link>
                    <Link href="#" className={mobileInactiveClass} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">inventory_2</span>
                            Persediaan Barang
                        </div>
                    </Link>
                    <Link href="#" className={mobileInactiveClass} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                            Keuangan
                        </div>
                    </Link>
                    <Link href="#" className={mobileInactiveClass} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">receipt_long</span>
                            Akunting
                        </div>
                    </Link>
                    <Link href="#" className={mobileInactiveClass} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">bar_chart</span>
                            Laporan
                        </div>
                    </Link>

                    <div className="h-px bg-slate-100 my-2"></div>

                    <Link href="#" className={mobileInactiveClass} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg">settings</span>
                            Pengaturan
                        </div>
                    </Link>
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
                >
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">shopping_bag</span>
                    <span className="text-[9px] md:text-[10px] font-bold w-full text-center truncate">Pembelian</span>
                </Link>
                <Link href="#" className="flex flex-col items-center p-1 text-slate-500 hover:text-primary w-1/5 overflow-hidden">
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">storefront</span>
                    <span className="text-[9px] md:text-[10px] font-medium w-full text-center truncate">Penjualan</span>
                </Link>
                <Link href="#" className="flex flex-col items-center p-1 text-slate-500 hover:text-primary w-1/5 overflow-hidden">
                    <span className="material-symbols-outlined text-[22px] md:text-2xl mb-1">inventory_2</span>
                    <span className="text-[9px] md:text-[10px] font-medium w-full text-center truncate">Persediaan</span>
                </Link>
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
