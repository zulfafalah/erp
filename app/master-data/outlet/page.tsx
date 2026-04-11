"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OutletItem {
    id: string;
    initial: string;
    kodeUsaha: string;
    namaUsaha: string;
    merekMotto: string;
    alamat1: string;
    telp1: string;
    fax1: string;
    email1: string;
    komisi: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const allData: OutletItem[] = [
    {
        id: "1",
        initial: "**",
        kodeUsaha: "Jakarta",
        namaUsaha: "TRIAL DATA",
        merekMotto: "",
        alamat1: "Jl. Xyz no. 1",
        telp1: "021-123456789",
        fax1: "021",
        email1: "trial.data.jakarta@gmail.com",
        komisi: 0,
    },
    {
        id: "2",
        initial: "BDG",
        kodeUsaha: "Bandung",
        namaUsaha: "OUTLET BANDUNG",
        merekMotto: "Solusi Terbaik",
        alamat1: "Jl. Asia Afrika No. 5",
        telp1: "022-987654321",
        fax1: "022",
        email1: "outlet.bandung@gmail.com",
        komisi: 2,
    },
    {
        id: "3",
        initial: "SBY",
        kodeUsaha: "Surabaya",
        namaUsaha: "OUTLET SURABAYA",
        merekMotto: "",
        alamat1: "Jl. Pemuda No. 10",
        telp1: "031-111222333",
        fax1: "031",
        email1: "outlet.surabaya@gmail.com",
        komisi: 1,
    },
];

// ─── Filter Fields ────────────────────────────────────────────────────────────

const FILTER_FIELDS: FilterField[] = [
    { key: "initial",   label: "Initial",    type: "text" },
    { key: "kodeUsaha", label: "Kode Usaha", type: "text" },
    { key: "namaUsaha", label: "Nama Usaha", type: "text" },
    { key: "alamat1",   label: "Alamat",     type: "text" },
    { key: "email1",    label: "Email",      type: "text" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OutletMasterDataPage() {
    const [filteredData, setFilteredData] = useState<OutletItem[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
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
                                    Daftar Nama Usaha
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola data master outlet / lokasi usaha Anda.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
                                <Link
                                    href="/master-data/outlet/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Outlet Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">

                            {/* Mobile Card View */}
                            <div className="block md:hidden divide-y divide-primary/5">
                                {filteredData.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">store</span>
                                        <p className="mt-2 text-sm">Tidak ada data outlet.</p>
                                    </div>
                                ) : (
                                    filteredData.map((item) => (
                                        <div key={item.id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link
                                                        href={`/master-data/outlet/${item.id}`}
                                                        className="font-semibold text-primary text-sm hover:underline"
                                                    >
                                                        {item.namaUsaha}
                                                    </Link>
                                                    <p className="text-xs text-slate-500 mt-0.5">{item.kodeUsaha} · {item.initial}</p>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600">{item.alamat1 || "—"}</p>
                                                <p className="text-xs text-slate-500">{item.telp1}</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                <span className="text-xs text-slate-500">{item.email1}</span>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/master-data/outlet/${item.id}`}
                                                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-base">edit_square</span>
                                                    </Link>
                                                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                        <span className="material-symbols-outlined text-base">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-primary/10">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Initial</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Kode</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nama</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Merek/Motto</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Alamat 1</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Telp 1</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fax 1</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Email 1</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Komisi</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {filteredData.length === 0 ? (
                                            <tr>
                                                <td colSpan={11} className="px-6 py-10 text-center text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 block mx-auto mb-2">store</span>
                                                    Tidak ada data outlet.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredData.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                                                    <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-primary">{item.initial}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-700">{item.kodeUsaha}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                                        <Link
                                                            href={`/master-data/outlet/${item.id}`}
                                                            className="font-semibold text-primary hover:underline"
                                                        >
                                                            {item.namaUsaha}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{item.merekMotto || "—"}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{item.alamat1 || "—"}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{item.telp1 || "—"}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{item.fax1 || "—"}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{item.email1 || "—"}</td>
                                                    <td className="px-6 py-4 text-sm text-right text-slate-600">{item.komisi}%</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/master-data/outlet/${item.id}`}
                                                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                                title="View/Edit"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">edit_square</span>
                                                            </Link>
                                                            <button
                                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 border-t border-primary/10">
                                <p className="text-sm text-slate-500 text-center md:text-left">
                                    Menampilkan 1 sampai {filteredData.length} dari {filteredData.length} data
                                </p>
                                <div className="flex flex-wrap justify-center items-center gap-1">
                                    <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
                                    <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
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
