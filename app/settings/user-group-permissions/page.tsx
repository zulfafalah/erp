"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PermissionRow {
    id: string;
    level: string;
    form: string;
    open: boolean;
    save: boolean;
    edit: boolean;
    filter: boolean;
    approve: boolean;
    unApprove: boolean;
    delete: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const allData: PermissionRow[] = [
    { id: "1",  level: "1 - Administrator", form: "Data Perpindahan Barang Antar Gudang (Terima)", open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "2",  level: "1 - Administrator", form: "Laporan Rekapitulasi Posang Dagang",             open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "3",  level: "1 - Administrator", form: "Jurna Transfer",                                  open: true,  save: false, edit: false, filter: true,  approve: false, unApprove: false, delete: false },
    { id: "4",  level: "1 - Administrator", form: "Menu Laporan Utl Kas",                            open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "5",  level: "1 - Administrator", form: "Pengguna",                                        open: true,  save: true,  edit: true,  filter: false, approve: false, unApprove: false, delete: false },
    { id: "6",  level: "1 - Administrator", form: "Dokumen Pengeluaran Pembayaran Ke Pemasok",       open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "7",  level: "1 - Administrator", form: "Menu Pengguna",                                   open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "8",  level: "1 - Administrator", form: "Pengaturan Harga Penjualan Barang / Wilayah",     open: true,  save: true,  edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "9",  level: "1 - Administrator", form: "Monthly Posting-Unposting Keuangan",              open: true,  save: true,  edit: true,  filter: false, approve: false, unApprove: false, delete: false },
    { id: "10", level: "1 - Administrator", form: "Laporan Rekapitulasi Nota Pembelian Barang (PIV)", open: true, save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "11", level: "1 - Administrator", form: "Laporan Laba Rugi",                               open: false, save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "12", level: "1 - Administrator", form: "Form Debit Memo",                                 open: true,  save: true,  edit: true,  filter: false, approve: false, unApprove: false, delete: false },
    { id: "13", level: "1 - Administrator", form: "Laporan Barcode Catalog",                         open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "14", level: "1 - Administrator", form: "Faktur Pembelian Barang",                         open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "15", level: "1 - Administrator", form: "Dokumen Penerimaan Pembayaran Dari Pelanggan",    open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "16", level: "1 - Administrator", form: "Menu Pembelian Barang",                           open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "17", level: "1 - Administrator", form: "Data Karyawan",                                   open: true,  save: true,  edit: true,  filter: false, approve: false, unApprove: false, delete: false },
    { id: "18", level: "1 - Administrator", form: "Laporan Detil Penjualan Barang",                  open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "19", level: "1 - Administrator", form: "Pencetakan Permintaan Dana",                      open: true,  save: true,  edit: true,  filter: true,  approve: true,  unApprove: false, delete: true  },
    { id: "20", level: "1 - Administrator", form: "Mata Uang",                                       open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "21", level: "2 - Admin_SO",      form: "Pesanan Penjualan",                               open: true,  save: true,  edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "22", level: "2 - Admin_SO",      form: "Faktur Penjualan",                                open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "23", level: "3 - Akunting",      form: "Jurnal Umum",                                     open: true,  save: true,  edit: true,  filter: true,  approve: false, unApprove: false, delete: false },
    { id: "24", level: "3 - Akunting",      form: "Chart of Accounts",                               open: true,  save: true,  edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "25", level: "4 - Boss",          form: "Laporan Laba Rugi",                               open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "26", level: "4 - Boss",          form: "Laporan Neraca",                                  open: true,  save: false, edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "27", level: "5 - Gudang",        form: "Data Perpindahan Barang Antar Gudang (Kirim)",    open: true,  save: true,  edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "28", level: "5 - Gudang",        form: "Penyesuaian Stok",                                open: true,  save: true,  edit: true,  filter: false, approve: false, unApprove: false, delete: false },
    { id: "29", level: "6 - Kasir",         form: "Dokumen Penerimaan Pembayaran Dari Pelanggan",    open: true,  save: true,  edit: false, filter: false, approve: false, unApprove: false, delete: false },
    { id: "30", level: "7 - Keuangan",      form: "Permintaan Dana",                                 open: true,  save: true,  edit: true,  filter: true,  approve: true,  unApprove: true,  delete: false },
];

const LEVEL_OPTIONS = [
    "----------All----------",
    "1 - Administrator",
    "2 - Admin_SO",
    "3 - Akunting",
    "4 - Boss",
    "5 - Gudang",
    "6 - Kasir",
    "7 - Keuangan",
];

// ─── Filter Fields ─────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "level", label: "Level",      type: "text" },
    { key: "form",  label: "Nama Form",  type: "text" },
];

// ─── Permission columns config ────────────────────────────────────────────────

const PERM_COLS: { key: keyof PermissionRow; label: string }[] = [
    { key: "open",      label: "Open"      },
    { key: "save",      label: "Save"      },
    { key: "edit",      label: "Edit"      },
    { key: "filter",    label: "Filter"    },
    { key: "approve",   label: "Approve"   },
    { key: "unApprove", label: "UnApprove" },
    { key: "delete",    label: "Delete"    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserGroupPermissionsPage() {
    const [filteredData, setFilteredData] = useState<PermissionRow[]>(allData);
    const [currentPage, setCurrentPage]   = useState(1);
    const [selectedLevel, setSelectedLevel] = useState("----------All----------");
    const [search, setSearch] = useState("");
    const [rows, setRows] = useState<PermissionRow[]>(allData);
    const perPage = 20;

    // Combined filter: level dropdown + search text
    const displayData = useMemo(() => {
        return rows.filter((item) => {
            const levelMatch =
                selectedLevel === "----------All----------" ||
                item.level === selectedLevel;
            const searchMatch =
                search === "" ||
                item.form.toLowerCase().includes(search.toLowerCase()) ||
                item.level.toLowerCase().includes(search.toLowerCase());
            return levelMatch && searchMatch;
        });
    }, [rows, selectedLevel, search]);

    const totalPages = Math.ceil(displayData.length / perPage);
    const paginatedData = displayData.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleApplyFilter = (rules: FilterRule[]) => {
        setCurrentPage(1);
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof typeof item];
                if (itemValue === undefined) return true;
                const itemStr = String(itemValue).toLowerCase();
                const valStr  = value.toLowerCase();
                switch (operator) {
                    case "contains":    return itemStr.includes(valStr);
                    case "equals":      return itemStr === valStr;
                    case "not_equals":  return itemStr !== valStr;
                    case "starts_with": return itemStr.startsWith(valStr);
                    case "ends_with":   return itemStr.endsWith(valStr);
                    default:            return true;
                }
            })
        );
        setFilteredData(result);
    };

    // Toggle single checkbox inline
    const togglePerm = (id: string, key: keyof PermissionRow) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [key]: !row[key] } : row
            )
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-6">

                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Hak Akses Grup
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm">
                                    Kelola permission (hak akses) untuk setiap grup pengguna pada setiap form.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/settings/user-group-permissions/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Hak Akses
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">

                            {/* Toolbar: Level filter + Search */}
                            <div className="px-4 md:px-6 py-3 border-b border-primary/10 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {/* Level dropdown */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Level:</span>
                                    <select
                                        value={selectedLevel}
                                        onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                                        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        {LEVEL_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Search */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Search:</span>
                                    <div className="relative w-full sm:w-52">
                                        <span className="material-symbols-outlined text-slate-400 text-base absolute left-2.5 top-1/2 -translate-y-1/2">search</span>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                            placeholder="Cari form atau level..."
                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {paginatedData.map((item) => (
                                    <div key={item.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 text-sm leading-snug">{item.form}</p>
                                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                                                    {item.level}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Link
                                                    href={`/settings/user-group-permissions/${item.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-base">edit_square</span>
                                                </Link>
                                                <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                    <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        {/* Permission grid on mobile */}
                                        <div className="grid grid-cols-4 gap-2">
                                            {PERM_COLS.map((col) => (
                                                <label key={col.key} className="flex flex-col items-center gap-1 cursor-pointer">
                                                    <span className="text-[10px] text-slate-500 font-medium">{col.label}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={item[col.key] as boolean}
                                                        onChange={() => togglePerm(item.id, col.key)}
                                                        className="size-4 accent-primary cursor-pointer"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {paginatedData.length === 0 && (
                                    <div className="p-8 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                                        <p className="mt-2 text-sm">Tidak ada data hak akses.</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-10">No.</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Level</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Form</th>
                                            {PERM_COLS.map((col) => (
                                                <th key={col.key} className="px-2 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-center whitespace-nowrap">
                                                    {col.label}
                                                </th>
                                            ))}
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {paginatedData.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                                <td className="px-4 py-3 text-sm text-slate-500 text-center">
                                                    {(currentPage - 1) * perPage + idx + 1}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                                                    {item.level}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                                                    {item.form}
                                                </td>
                                                {PERM_COLS.map((col) => (
                                                    <td key={col.key} className="px-2 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item[col.key] as boolean}
                                                            onChange={() => togglePerm(item.id, col.key)}
                                                            className="size-4 accent-primary cursor-pointer"
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/settings/user-group-permissions/${item.id}`}
                                                            className="px-2 py-1 text-xs font-semibold text-primary hover:underline"
                                                            title="Edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <span className="text-slate-300">|</span>
                                                        <button
                                                            className="px-2 py-1 text-xs font-semibold text-red-500 hover:underline"
                                                            title="Delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedData.length === 0 && (
                                            <tr>
                                                <td colSpan={3 + PERM_COLS.length + 1} className="px-6 py-12 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl block mb-2">admin_panel_settings</span>
                                                    Tidak ada data hak akses.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                <p className="text-sm text-slate-500 text-center md:text-left">
                                    Menampilkan {displayData.length === 0 ? 0 : (currentPage - 1) * perPage + 1} sampai{" "}
                                    {Math.min(currentPage * perPage, displayData.length)} dari {displayData.length} data
                                </p>
                                <div className="flex flex-wrap justify-center items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? "bg-primary text-white font-bold"
                                                    : "hover:bg-white text-slate-600"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
