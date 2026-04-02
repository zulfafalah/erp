"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";
import MultiFilter, { FilterField, FilterRule } from "../../components/MultiFilter";
import DataTable, { Column } from "../../components/DataTable";

interface Seller {
    id: string;
    kode: string;
    nama: string;
    telp: string;
    email: string;
    aktif: boolean;
}

const allData: Seller[] = [
    { id: "SL-001", kode: "",       nama: "Mariana",    telp: "1", email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-002", kode: "",       nama: "SANDRY",     telp: "",  email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-003", kode: "",       nama: "Lima Dara",  telp: "",  email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-004", kode: "ANGGUN", nama: "ANGGUN",     telp: "2", email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-005", kode: "APHAN",  nama: "APHAN",      telp: "",  email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-006", kode: "ATIONG", nama: "ATIONG",     telp: "3", email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-007", kode: "DHANI",  nama: "DHANI",      telp: "",  email: "via.chjp@gmail.com",    aktif: true  },
    { id: "SL-008", kode: "EXPORT", nama: "EXPORT",     telp: "2", email: "mrohmania25@gmail.com", aktif: true  },
    { id: "SL-009", kode: "GRENDI", nama: "GRENDI",     telp: "5", email: "yo7705@gmail.com",      aktif: true  },
    { id: "SL-010", kode: "MERIANA",nama: "MERUANA",    telp: "5", email: "via.chjp@gmail.com",    aktif: true  },
];

const FILTER_FIELDS: FilterField[] = [
    { key: "kode",  label: "Kode",  type: "text" },
    { key: "nama",  label: "Nama",  type: "text" },
    { key: "email", label: "Email", type: "text" },
    {
        key: "aktif", label: "Aktif", type: "select",
        options: [
            { label: "Aktif",    value: "true"  },
            { label: "Nonaktif", value: "false" },
        ],
    },
];

export default function SellerListPage() {
    const [filteredData, setFilteredData] = useState<Seller[]>(allData);

    const handleApplyFilter = (rules: FilterRule[]) => {
        if (rules.length === 0) {
            setFilteredData(allData);
            return;
        }
        const result = allData.filter((item) =>
            rules.every((rule) => {
                const { field, operator, value } = rule;
                const itemValue = item[field as keyof Seller];
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

    const columns: Column<Seller>[] = [
        {
            header: "Kode",
            key: "kode",
            render: (item) => (
                <span className="text-sm text-slate-700">{item.kode || "—"}</span>
            ),
        },
        {
            header: "Nama",
            key: "nama",
            render: (item) => (
                <Link
                    href={`/master-data/seller/${item.id}`}
                    className="font-semibold text-primary text-sm tracking-tight hover:underline"
                >
                    {item.nama}
                </Link>
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
            header: "Email",
            key: "email",
            render: (item) => (
                <span className="text-sm text-slate-700">{item.email}</span>
            ),
        },
        {
            header: "Aktif?",
            key: "aktif",
            render: (item) => (
                item.aktif ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Nonaktif
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
                        href={`/master-data/seller/${item.id}`}
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
            ),
        },
    ];

    const renderMobileCard = (item: Seller) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/master-data/seller/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.nama}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.kode || "Tanpa kode"}</p>
                </div>
                {item.aktif ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Nonaktif
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Telp:</span> {item.telp || "—"}
                </p>
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Email:</span> {item.email}
                </p>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-slate-100 gap-1">
                <Link
                    href={`/master-data/seller/${item.id}`}
                    className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-base">edit_square</span>
                </Link>
                <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
                </button>
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
                                    Daftar Penjual
                                </h2>
                                <p className="text-slate-500 mt-1">
                                    Kelola master data penjual yang terdaftar di sistem.
                                </p>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
                                <MultiFilter
                                    fields={FILTER_FIELDS}
                                    onApplyFilter={handleApplyFilter}
                                />
                                <Link
                                    href="/master-data/seller/new"
                                    className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    Tambah Penjual Baru
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
