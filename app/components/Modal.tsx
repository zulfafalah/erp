"use client";

import { useEffect, useRef } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: string;
    size?: ModalSize;
    children: React.ReactNode;
    footer?: React.ReactNode;
    /** Tutup modal saat klik backdrop (default: true) */
    closeOnBackdrop?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    icon,
    size = "md",
    children,
    footer,
    closeOnBackdrop = true,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    /* Tutup dengan tombol Escape */
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    /* Cegah scroll body saat modal terbuka */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
            onClick={closeOnBackdrop ? onClose : undefined}
        >
            {/* Panel */}
            <div
                ref={panelRef}
                onClick={(e) => e.stopPropagation()}
                className={`
                    bg-white rounded-2xl shadow-2xl w-full overflow-hidden
                    flex flex-col max-h-[90vh]
                    ${sizeClasses[size]}
                    animate-in zoom-in-95 fade-in duration-150
                `}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
                    {icon && (
                        <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary">{icon}</span>
                        </div>
                    )}
                    <h3 className="font-bold text-slate-800 flex-1 text-base">{title}</h3>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none"
                        aria-label="Tutup modal"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* Footer — opsional */}
                {footer && (
                    <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/60">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
