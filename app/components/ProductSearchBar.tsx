"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ───────────────────────────────────────────────────────────────────
export interface ProductSearchResult {
    productid: number;
    productcode: string;
    productname: string;
    productname2: string | null;
    produnit: string | null;
    uom_id_prod: number | null;
    qty_outer: string | null;
    qty_inner: string | null;
    uom_inner_outer_name: string | null;
}

export interface ProductSearchBarProps {
    /** Called when user selects a product from the dropdown */
    onSelect: (product: ProductSearchResult) => void;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Minimum characters before triggering search (default: 2) */
    minChars?: number;
    /** Debounce delay in ms (default: 350) */
    debounceMs?: number;
    /** Max results to show in dropdown (default: 8) */
    maxResults?: number;
    /** Optional className to override wrapper div */
    className?: string;
    /** If provided, keeps the input value controlled from outside */
    value?: string;
    /** Called when input value changes (use with `value` for controlled mode) */
    onChange?: (val: string) => void;
    /** Disable the input */
    disabled?: boolean;
}

// ── Skeleton Rows ───────────────────────────────────────────────────────────
function SkeletonRows({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="px-4 py-3 border-b border-slate-100 last:border-0 animate-pulse flex flex-col gap-1.5"
                >
                    <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                </div>
            ))}
        </>
    );
}

// ── Component ───────────────────────────────────────────────────────────────
export default function ProductSearchBar({
    onSelect,
    placeholder = "Cari/Pilih Barang & Jasa...",
    minChars = 2,
    debounceMs = 350,
    maxResults = 8,
    className = "",
    value: controlledValue,
    onChange: controlledOnChange,
    disabled = false,
}: ProductSearchBarProps) {
    const isControlled = controlledValue !== undefined;

    const [internalQuery, setInternalQuery] = useState("");
    const query = isControlled ? controlledValue : internalQuery;

    const [results, setResults] = useState<ProductSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    // ── Debounced search ──────────────────────────────────────────────────
    const search = useCallback(
        (q: string) => {
            // Cancel pending timer
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            // Below minimum chars — clear results but don't fetch
            if (q.trim().length < minChars) {
                setResults([]);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            debounceTimer.current = setTimeout(async () => {
                // Abort previous in-flight request
                if (abortRef.current) abortRef.current.abort();
                abortRef.current = new AbortController();

                try {
                    const res = await fetch(
                        `/api/master-data/products?search=${encodeURIComponent(q.trim())}&limit=${maxResults}`,
                        { signal: abortRef.current.signal }
                    );
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const json = await res.json();

                    if (json.ok && Array.isArray(json.data)) {
                        setResults(json.data.slice(0, maxResults));
                    } else {
                        setResults([]);
                    }
                    setError(null);
                } catch (err: unknown) {
                    if (err instanceof Error && err.name === "AbortError") return; // Intentional cancel
                    console.error("[ProductSearchBar] fetch error", err);
                    setError("Gagal memuat data produk.");
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            }, debounceMs);
        },
        [minChars, debounceMs, maxResults]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

    // ── Input change handler ──────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!isControlled) setInternalQuery(val);
        controlledOnChange?.(val);
        setIsOpen(true);
        search(val);
    };

    // ── Select product ────────────────────────────────────────────────────
    const handleSelect = (product: ProductSearchResult) => {
        const displayName = product.productname;
        if (!isControlled) setInternalQuery(displayName);
        controlledOnChange?.(displayName);
        setIsOpen(false);
        setResults([]);
        onSelect(product);
    };

    // ── Close dropdown on outside click ──────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Hint text below input ─────────────────────────────────────────────
    const showMinCharHint = query.length > 0 && query.length < minChars;
    const showDropdown = isOpen && query.length >= minChars;

    return (
        <div className={`relative ${className}`}>
            {/* ── Input wrapper ─────────────────────────────────────── */}
            <div
                className={`flex items-center border rounded-lg overflow-hidden bg-white transition-all duration-150
                    ${disabled ? "opacity-50 cursor-not-allowed border-slate-200" : ""}
                    ${isOpen && query.length >= minChars
                        ? "border-primary ring-1 ring-primary/30"
                        : "border-slate-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30"
                    }`}
            >
                {/* Search icon */}
                <span className="pl-3 text-slate-400 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">search</span>
                </span>

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => {
                        setIsOpen(true);
                        if (query.length >= minChars && results.length === 0) {
                            search(query);
                        }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-slate-800 placeholder:text-slate-400 disabled:cursor-not-allowed"
                />

                {/* Clear button */}
                {query.length > 0 && !disabled && (
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (!isControlled) setInternalQuery("");
                            controlledOnChange?.("");
                            setResults([]);
                            setIsOpen(false);
                            inputRef.current?.focus();
                        }}
                        className="pr-3 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                        title="Hapus pencarian"
                    >
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                )}

                {/* Loading spinner inside input */}
                {loading && (
                    <span className="pr-3 flex-shrink-0">
                        <span className="block size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </span>
                )}
            </div>

            {/* ── Min char hint ──────────────────────────────────────── */}
            {showMinCharHint && (
                <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs leading-none">info</span>
                    Ketik minimal <strong>{minChars}</strong> karakter untuk mencari
                </p>
            )}

            {/* ── Dropdown ──────────────────────────────────────────── */}
            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Loading skeleton */}
                    {loading && <SkeletonRows count={3} />}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="px-4 py-4 flex items-center gap-2 text-sm text-red-500">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && results.length === 0 && (
                        <div className="px-4 py-4 flex items-center gap-2 text-sm text-slate-400">
                            <span className="material-symbols-outlined text-base">search_off</span>
                            Produk &ldquo;{query}&rdquo; tidak ditemukan
                        </div>
                    )}

                    {/* Results */}
                    {!loading && !error && results.length > 0 && (
                        <div className="max-h-64 overflow-y-auto">
                            {results.map((p) => (
                                <button
                                    key={p.productid}
                                    type="button"
                                    className="w-full px-4 py-3 text-left hover:bg-primary/5 border-b border-slate-100 last:border-0 transition-colors group"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelect(p)}
                                >
                                    <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                                        {p.productname}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[11px]">barcode</span>
                                        {p.productcode}
                                        {p.produnit && (
                                            <>
                                                <span className="mx-1 text-slate-300">·</span>
                                                <span className="material-symbols-outlined text-[11px]">straighten</span>
                                                {p.produnit}
                                            </>
                                        )}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Footer hint */}
                    {!loading && results.length > 0 && (
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-400">
                            <span className="material-symbols-outlined text-xs">keyboard</span>
                            Klik produk untuk memilih
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
