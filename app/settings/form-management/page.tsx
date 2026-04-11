"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
    id: string;
    namaForm: string;
    keterangan: string;
    url: string;
    tipeModule: "Detil Menu" | "Menu Utama" | "Sub Menu" | "Laporan";
    reportGroup: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: FormData[] = [
    { id: "1",  namaForm: "menuakunting",    keterangan: "Menu Akunting",          url: "",                         tipeModule: "Detil Menu",  reportGroup: "" },
    { id: "2",  namaForm: "menukeuangan",    keterangan: "Menu Keuangan",          url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "3",  namaForm: "menulaporan",     keterangan: "Menu Laporan",           url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "4",  namaForm: "menupanel",       keterangan: "Menu Panel Utama",       url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "5",  namaForm: "menupembelian",   keterangan: "Menu Pembelian",         url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "6",  namaForm: "menupenerimaan",  keterangan: "Menu Penerimaan",        url: "",                         tipeModule: "Sub Menu",    reportGroup: "" },
    { id: "7",  namaForm: "menupengaturan",  keterangan: "Menu Pengaturan",        url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "8",  namaForm: "menupengguna",    keterangan: "Menu Pengguna",          url: "",                         tipeModule: "Sub Menu",    reportGroup: "" },
    { id: "9",  namaForm: "menupengiriman",  keterangan: "Menu Pengiriman",        url: "",                         tipeModule: "Sub Menu",    reportGroup: "" },
    { id: "10", namaForm: "menupenjualan",   keterangan: "Menu Penjualan",         url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "11", namaForm: "menupersediaan",  keterangan: "Menu Persediaan",        url: "",                         tipeModule: "Menu Utama",  reportGroup: "" },
    { id: "12", namaForm: "formchartofacc",  keterangan: "Chart of Accounts",      url: "/accounting/chart-of-accounts", tipeModule: "Detil Menu", reportGroup: "Akunting" },
    { id: "13", namaForm: "formgenjurnal",   keterangan: "Jurnal Umum",            url: "/accounting/general-journal",   tipeModule: "Detil Menu", reportGroup: "Akunting" },
    { id: "14", namaForm: "formtxjurnal",    keterangan: "Jurnal Transaksi",       url: "/accounting/transaction-journal", tipeModule: "Detil Menu", reportGroup: "Akunting" },
    { id: "15", namaForm: "formfundreq",     keterangan: "Permintaan Dana",        url: "/accounting/fund-request",      tipeModule: "Detil Menu", reportGroup: "Akunting" },
    { id: "16", namaForm: "formsopenjualan", keterangan: "Pesanan Penjualan",      url: "/sales/order",                  tipeModule: "Detil Menu", reportGroup: "Penjualan" },
    { id: "17", namaForm: "formsolaporan",   keterangan: "Laporan Penjualan",      url: "#",                             tipeModule: "Laporan",    reportGroup: "Penjualan" },
    { id: "18", namaForm: "formhutang",      keterangan: "Saldo Awal Hutang",      url: "/finance/accounts-payable/opening-balance", tipeModule: "Detil Menu", reportGroup: "Keuangan" },
    { id: "19", namaForm: "formpiutang",     keterangan: "Saldo Awal Piutang",     url: "/finance/accounts-receivable/opening-balance", tipeModule: "Detil Menu", reportGroup: "Keuangan" },
    { id: "20", namaForm: "formoutlet",      keterangan: "Data Outlet",            url: "/master-data/outlet",           tipeModule: "Detil Menu", reportGroup: "Master Data" },
    { id: "21", namaForm: "formpengguna",    keterangan: "Pengaturan Pengguna",    url: "/settings/user-settings",       tipeModule: "Detil Menu", reportGroup: "Pengaturan" },
    { id: "22", namaForm: "formgrupuser",    keterangan: "Grup Pengguna",          url: "/settings/user-group-settings", tipeModule: "Detil Menu", reportGroup: "Pengaturan" },
    { id: "23", namaForm: "formsystem",      keterangan: "Pengaturan Program",     url: "/settings/system",              tipeModule: "Detil Menu", reportGroup: "Pengaturan" },
    { id: "24", namaForm: "formproduk",      keterangan: "Master Produk",          url: "/master-data/product",          tipeModule: "Detil Menu", reportGroup: "Master Data" },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "namaForm",    label: "Nama Form",     type: "text" },
    { key: "keterangan",  label: "Keterangan",    type: "text" },
    { key: "url",         label: "URL",           type: "text" },
    {
        key: "tipeModule",
        label: "Tipe Module",
        type: "select",
        options: [
            { label: "Detil Menu",  value: "Detil Menu"  },
            { label: "Menu Utama",  value: "Menu Utama"  },
            { label: "Sub Menu",    value: "Sub Menu"    },
            { label: "Laporan",     value: "Laporan"     },
        ],
    },
    { key: "reportGroup", label: "Report Group",  type: "text" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormManagementPage() {
    const [filteredData, setFilteredData] = useState<FormData[]>(allData);
    const [currentPage, setCurrentPage]   = useState(1);
    const perPage = 10;

    const totalPages = Math.ceil(filteredData.length / perPage);
    const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

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

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8 space-y-4 md:space-y-8">

                        {/* Title & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                                    Daftar Form
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm">
                                    Kelola daftar form / modul yang tersedia dalam sistem ERP.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/settings/form-management/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Form Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">

                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {paginatedData.map((item) => (
                                    <div key={item.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/settings/form-management/${item.id}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {item.namaForm}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.keterangan}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {item.tipeModule}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 truncate">
                                                URL: <span className="font-medium text-slate-700">{item.url || "—"}</span>
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Report Group: <span className="font-medium text-slate-700">{item.reportGroup || "—"}</span>
                                            </p>
                                        </div>
                                        <div className="flex justify-end items-center pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/settings/form-management/${item.id}`}
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
                                    </div>
                                ))}
                                {paginatedData.length === 0 && (
                                    <div className="p-8 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl">list_alt</span>
                                        <p className="mt-2 text-sm">Tidak ada data form.</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nama Form</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Keterangan</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">URL</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tipe Module</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Report Group</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {paginatedData.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {(currentPage - 1) * perPage + idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/settings/form-management/${item.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {item.namaForm}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{item.keterangan}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{item.url || "—"}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.tipeModule}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.reportGroup || "—"}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/settings/form-management/${item.id}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit_square</span>
                                                        </Link>
                                                        <button
                                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedData.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl block mb-2">list_alt</span>
                                                    Tidak ada data form.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                                <p className="text-sm text-slate-500 text-center md:text-left">
                                    Menampilkan {filteredData.length === 0 ? 0 : (currentPage - 1) * perPage + 1} sampai{" "}
                                    {Math.min(currentPage * perPage, filteredData.length)} dari {filteredData.length} data
                                </p>
                                <div className="flex flex-wrap justify-center items-center gap-1">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
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
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
