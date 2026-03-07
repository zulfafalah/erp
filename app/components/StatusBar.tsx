"use client";

import { useState } from "react";

export default function StatusBar() {
    const [showMobileInfo, setShowMobileInfo] = useState(false);

    return (
        <footer className="fixed bottom-0 left-0 w-full h-8 bg-slate-900 text-slate-400 flex items-center justify-between px-3 md:px-6 shrink-0 text-[8px] md:text-[10px] uppercase font-bold tracking-widest z-50">
            <div className="flex gap-3 md:gap-6 items-center">
                <button
                    onClick={() => setShowMobileInfo(!showMobileInfo)}
                    className="flex items-center gap-1.5 shrink-0 focus:outline-none md:cursor-default active:opacity-70 md:active:opacity-100 transition-opacity"
                >
                    <span className="size-1.5 md:size-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                    <span className="hidden md:inline">System Connected</span>
                    <span className="inline md:hidden border-b border-dashed border-slate-500 pb-[1px]">Connected</span>
                </button>
                <span className="hidden lg:inline">Server: ASIA-SOUTH-1</span>
                <span className="hidden xl:inline">DB: PROD_ERP_01</span>
            </div>
            <div className="flex gap-2 md:gap-4 items-center shrink-0">
                <span className="hidden 2xl:inline">Shortcut Keys: F2-Save, F5-Refresh, F8-Print</span>
                <span className="text-slate-200">
                    <span className="hidden sm:inline">User: </span>Zulfa F.
                    <span className="hidden sm:inline"> | Time: 14:22:10</span>
                </span>
            </div>

            {/* Mobile Info Popup */}
            {showMobileInfo && (
                <div className="absolute bottom-24 left-3 bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg flex flex-col gap-2 md:hidden min-w-[200px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="text-slate-300 flex justify-between items-center border-b border-slate-700 pb-2 mb-1">
                        <span className="text-[10px] text-white">System Info</span>
                        <button onClick={() => setShowMobileInfo(false)} className="text-slate-400 hover:text-white px-2 py-0.5 text-xs">✕</button>
                    </div>
                    <div className="flex gap-2 justify-between">
                        <span>Server:</span>
                        <span className="text-white">ASIA-SOUTH-1</span>
                    </div>
                    <div className="flex gap-2 justify-between">
                        <span>DB:</span>
                        <span className="text-white">PROD_ERP_01</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700 text-slate-500 normal-case text-[9px] text-center">
                        F2-Save · F5-Refresh · F8-Print
                    </div>
                </div>
            )}
        </footer>
    );
}
