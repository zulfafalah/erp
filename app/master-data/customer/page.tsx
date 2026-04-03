"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

interface Customer {
    id: string;
    kode: string;
    nama: string;
    alamat: string;
    telp: string;
    tempo: string;
    limitKredit: number;
    isLokal: boolean;
    isEksportir: boolean;
    blocked: boolean;
}

const allData: Customer[] = [
    { id: "A.0001", kode: "A.0001", nama: "ABADI",            alamat: "JL. RADEN SALEH 69 KARANG MULYA CILEDUG",          telp: "0811149988",                          tempo: "30 / 45", limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0002", kode: "A.0002", nama: "ABENG",            alamat: "PALEMBANG",                                         telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0003", kode: "A.0003", nama: "ABUN",             alamat: "MAKASAR",                                           telp: "081211112204",                         tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0004", kode: "A.0004", nama: "ACAI",             alamat: "TANJUNG BALAI",                                     telp: "085226208508/081372233333",             tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0005", kode: "A.0005", nama: "ACUN",             alamat: "JL. RAYA KEDOYA",                                   telp: "82114298318",                          tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0006", kode: "A.0006", nama: "ACUNG (TK. GRACE)",alamat: "PS. PAGI",                                          telp: "021-6320072",                          tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0007", kode: "A.0007", nama: "ADNAN",            alamat: "GRIYA SERPONG",                                     telp: "08777336069",                          tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0008", kode: "A.0008", nama: "ADE HAJI",         alamat: "TAMAN GOLF BLOK AG 3 NO. 10 DEKET METROPOLIS",      telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0009", kode: "A.0009", nama: "ADITYA (TK. LARIS)",alamat: "JL. PEMUDA NO. 169 RT.002/012 KEC. KLATEN TENGAH",telp: "08978455667",                          tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0010", kode: "A.0010", nama: "AGDAU",            alamat: "TANGERANG",                                         telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0011", kode: "A.0011", nama: "AGUNG JAYA, TK",   alamat: "JL. AMPLAS TRADE CENTRE BLOK E NO. 33, MEDAN",      telp: "81262625050",                          tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0012", kode: "A.0012", nama: "AGUNG TK",         alamat: "JL. KANJENAN A 19, SEMARANG",                       telp: "024-3549350/081325612341",             tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0013", kode: "A.0013", nama: "AINUR RIDWAN",     alamat: "PERUM CITRA HARMONI BLOK G2 NO.9 TAMAN, SIDOARJO",  telp: "081703936108123179746",                tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0014", kode: "A.0014", nama: "AKIUN/ALBERT",     alamat: "JL.K.H. AHMAD DAHLAN",                              telp: "8176547053",                           tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0015", kode: "A.0015", nama: "ALAM JAYA, TK",    alamat: "CENGKARENG",                                        telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0016", kode: "A.0016", nama: "ALI",              alamat: "PS. PAGI",                                          telp: "8998940943",                           tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0017", kode: "A.0017", nama: "ALING",            alamat: "NAUK",                                              telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0018", kode: "A.0018", nama: "ALJUNG",           alamat: "PS. PAGI",                                          telp: "083213240693",                         tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0019", kode: "A.0019", nama: "ALOY",             alamat: "TELUK GONG",                                        telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
    { id: "A.0020", kode: "A.0020", nama: "ANANDA",           alamat: "TELUK GONG",                                        telp: "",                                     tempo: "0 / 0",   limitKredit: 0,   isLokal: true, isEksportir: false, blocked: false },
];

const FILTER_FIELDS: FilterField[] = [
    { key: "kode",  label: "Kode",   type: "text" },
    { key: "nama",  label: "Nama",   type: "text" },
    { key: "alamat",label: "Alamat", type: "text" },
    { key: "telp",  label: "Telp",   type: "text" },
    {
        key: "blocked", label: "Status", type: "select",
        options: [
            { label: "Aktif",    value: "false" },
            { label: "Blocked",  value: "true"  },
        ],
    },
    {
        key: "isLokal", label: "Lokal?", type: "select",
        options: [
            { label: "Lokal",  value: "true"  },
            { label: "Ekspor", value: "false" },
        ],
    },
];

export default function CustomerListPage() {
    const [filteredData, setFilteredData] = useState<Customer[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof Customer];
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

    const columns: Column<Customer>[] = [
        {
            header: "Kode",
            key: "kode",
            render: (item) => (
                <Link
                    href={`/master-data/customer/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.kode}
                </Link>
            ),
        },
        {
            header: "Nama",
            key: "nama",
            render: (item) => (
                <Link
                    href={`/master-data/customer/${item.id}`}
                    className="font-semibold text-slate-800 text-sm hover:text-primary hover:underline"
                >
                    {item.nama}
                </Link>
            ),
        },
        {
            header: "Alamat",
            key: "alamat",
            render: (item) => (
                <span className="text-sm text-slate-600 line-clamp-1">{item.alamat || "—"}</span>
            ),
        },
        {
            header: "Telp",
            key: "telp",
            render: (item) => (
                <span className="text-sm text-slate-700">{item.telp || "—"}</span>
            ),
        },
        {
            header: "Tempo",
            key: "tempo",
            render: (item) => (
                <span className="text-sm text-slate-700">{item.tempo}</span>
            ),
        },
        {
            header: "Limit Kredit",
            key: "limitKredit",
            align: "right",
            render: (item) => (
                <span className="text-sm font-semibold text-slate-700 tabular-nums">
                    {item.limitKredit.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                </span>
            ),
        },
        {
            header: "Local?",
            key: "isLokal",
            render: (item) => (
                item.isLokal ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        LOCAL
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        EXPORT
                    </span>
                )
            ),
        },
        {
            header: "Aksi",
            key: "aksi",
            align: "right",
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/master-data/customer/${item.id}`}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
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
            ),
        },
    ];

    const renderMobileCard = (item: Customer) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/master-data/customer/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.nama}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{item.kode}</p>
                </div>
                {item.isLokal ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        LOCAL
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        EXPORT
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-xs text-slate-500 line-clamp-1">
                    <span className="font-medium text-slate-700">Alamat:</span> {item.alamat || "—"}
                </p>
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Telp:</span> {item.telp || "—"}
                </p>
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Tempo:</span> {item.tempo}
                </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 tabular-nums">
                    Limit: {item.limitKredit.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-1">
                    <Link
                        href={`/master-data/customer/${item.id}`}
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
    );

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
                                    Daftar Pelanggan
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data pelanggan yang terdaftar di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/customer/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Pelanggan Baru
                                </Link>
                            </div>
                        </div>

                        {/* Table Container */}
                        <DataTable
                            data={filteredData}
                            columns={columns}
                            keyField="id"
                            renderMobileCard={renderMobileCard}
                        />
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
