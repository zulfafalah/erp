"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
    id: string;
    idUser: string;
    namaUser: string;
    divisi: string;
    departemen: string;
    posisi: string;
    atasan: string;
    statusAktif: "Aktif" | "Nonaktif";
}

const statusStyles: Record<UserData["statusAktif"], string> = {
    Aktif:    "bg-green-100 text-green-800",
    Nonaktif: "bg-red-100 text-red-800",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: UserData[] = [
    { id: "1",  idUser: "momo1",      namaUser: "momo1",       divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Administrator", atasan: "",              statusAktif: "Aktif" },
    { id: "2",  idUser: "admin",      namaUser: "Administrator", divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Administrator", atasan: "",             statusAktif: "Aktif" },
    { id: "3",  idUser: "adminso",    namaUser: "adminso",     divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Admin SO",      atasan: "Manager",       statusAktif: "Aktif" },
    { id: "4",  idUser: "admpltang",  namaUser: "admpltang",   divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Keuangan",      atasan: "Boss",          statusAktif: "Aktif" },
    { id: "5",  idUser: "aqualina",   namaUser: "aqualina",    divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Pembelian",     atasan: "Pembelian",     statusAktif: "Aktif" },
    { id: "6",  idUser: "apriza",     namaUser: "apriza",      divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Gudang",        atasan: "Manager",       statusAktif: "Aktif" },
    { id: "7",  idUser: "boss",       namaUser: "boss",        divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Boss",          atasan: "Boss",          statusAktif: "Aktif" },
    { id: "8",  idUser: "catherine",  namaUser: "catherine",   divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Boss",          atasan: "Boss",          statusAktif: "Aktif" },
    { id: "9",  idUser: "eva",        namaUser: "eva",         divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Kasir",         atasan: "Administrator", statusAktif: "Aktif" },
    { id: "10", idUser: "ferry",      namaUser: "ferry",       divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Manager",       atasan: "Administrator", statusAktif: "Aktif" },
    { id: "11", idUser: "hanafi",     namaUser: "hanafi",      divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Staff",         atasan: "Manager",       statusAktif: "Aktif" },
    { id: "12", idUser: "indra",      namaUser: "indra",       divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Gudang",        atasan: "Boss",          statusAktif: "Nonaktif" },
    { id: "13", idUser: "jessica",    namaUser: "jessica",     divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Pembelian",     atasan: "Manager",       statusAktif: "Aktif" },
    { id: "14", idUser: "kevin",      namaUser: "kevin",       divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Sales",         atasan: "Boss",          statusAktif: "Aktif" },
    { id: "15", idUser: "lina",       namaUser: "lina",        divisi: "Divisi 1", departemen: "Departemen 1", posisi: "Admin SO",      atasan: "Manager",       statusAktif: "Aktif" },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "idUser",      label: "ID User",     type: "text" },
    { key: "namaUser",    label: "Nama User",   type: "text" },
    { key: "divisi",      label: "Divisi",      type: "text" },
    { key: "departemen",  label: "Departemen",  type: "text" },
    { key: "posisi",      label: "Posisi",      type: "text" },
    { key: "atasan",      label: "Atasan",      type: "text" },
    {
        key: "statusAktif",
        label: "Status Aktif",
        type: "select",
        options: [
            { label: "Aktif",    value: "Aktif"    },
            { label: "Nonaktif", value: "Nonaktif" },
        ],
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserSettingsPage() {
    const [filteredData, setFilteredData] = useState<UserData[]>(allData);
    const [currentPage, setCurrentPage] = useState(1);
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
                const valStr = value.toLowerCase();
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
                                    Daftar Pengguna
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm">
                                    Kelola akun pengguna, hak akses, jabatan, dan informasi login sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/settings/user-settings/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Pengguna Baru
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
                                                    href={`/settings/user-settings/${item.id}`}
                                                    className="font-semibold text-primary text-sm hover:underline"
                                                >
                                                    {item.idUser}
                                                </Link>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.namaUser}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.statusAktif]}`}>
                                                {item.statusAktif}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{item.posisi}</p>
                                            <p className="text-xs text-slate-500">{item.departemen} · {item.divisi}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                            <span className="text-xs text-slate-500">
                                                Atasan: <span className="font-medium text-slate-700">{item.atasan || "—"}</span>
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/settings/user-settings/${item.id}`}
                                                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                    title="View"
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
                                        <span className="material-symbols-outlined text-4xl">manage_accounts</span>
                                        <p className="mt-2 text-sm">Tidak ada data pengguna.</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID User</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nama User</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Divisi</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Departemen</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Posisi</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Atasan</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status Aktif</th>
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
                                                        href={`/settings/user-settings/${item.id}`}
                                                        className="font-semibold text-primary text-sm tracking-tight hover:underline"
                                                    >
                                                        {item.idUser}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.namaUser}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.divisi}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.departemen}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.posisi}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.atasan || "—"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.statusAktif]}`}>
                                                        {item.statusAktif}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/settings/user-settings/${item.id}`}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="View"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit_square</span>
                                                        </Link>
                                                        <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {paginatedData.length === 0 && (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl block mb-2">manage_accounts</span>
                                                    Tidak ada data pengguna.
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
