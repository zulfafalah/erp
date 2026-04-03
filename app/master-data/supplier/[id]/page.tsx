"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import FormTextarea from "../../../components/FormTextarea";

export default function PemasokFormPage() {
    const router = useRouter();

    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* Action Header */}
                    <div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/master-data/pemasok")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    arrow_back
                                </span>
                            </button>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                    :: Data Pemasok
                                </h1>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola master data pemasok/supplier Anda.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                                {/* Left Section: Form Data Pemasok */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                                            {/* Form Group: Kode */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Kode
                                                </label>
                                                <div className="sm:col-span-3">
                                                    <div className="w-1/3">
                                                        <FormInput defaultValue="" placeholder="AUTO" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Group: Nama - Gelar */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Nama - Gelar
                                                </label>
                                                <div className="sm:col-span-3 flex gap-2">
                                                    <div className="w-2/3">
                                                        <FormInput />
                                                    </div>
                                                    <div className="w-1/3">
                                                        <FormInput />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Form Group: Nama Kontak */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Nama Kontak
                                                </label>
                                                <div className="sm:col-span-3 w-2/3">
                                                    <FormInput />
                                                </div>
                                            </div>

                                            {/* Form Group: Alamat */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1 mt-2">
                                                    Alamat
                                                </label>
                                                <div className="sm:col-span-3">
                                                    <FormTextarea rows={2} />
                                                </div>
                                            </div>

                                            {/* Form Group: Telepon */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Telepon
                                                </label>
                                                <div className="sm:col-span-3 w-1/2">
                                                    <FormInput />
                                                </div>
                                            </div>

                                            {/* Form Group: Is Importir? */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Is Importir ?
                                                </label>
                                                <div className="sm:col-span-3">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                </div>
                                            </div>

                                            {/* Form Group: Wilayah */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Wilayah
                                                </label>
                                                <div className="sm:col-span-3 w-1/2">
                                                    <FormSelect>
                                                        <option>:: Pilih Wilayah ::</option>
                                                        <option>DKI Jakarta</option>
                                                        <option>Jawa Barat</option>
                                                        <option>Jawa Tengah</option>
                                                        <option>Jawa Timur</option>
                                                        <option>Bali</option>
                                                    </FormSelect>
                                                </div>
                                            </div>

                                            {/* Form Group: Sisa Hutang */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Sisa Hutang
                                                </label>
                                                <div className="sm:col-span-3 w-2/3">
                                                    <FormInput defaultValue="0.00" type="text" />
                                                </div>
                                            </div>

                                            {/* Form Group: Account Code */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Account Code
                                                </label>
                                                <div className="sm:col-span-3 w-2/3">
                                                    <FormSelect>
                                                        <option>300 - MODAL</option>
                                                        <option>200 - KEWAJIBAN LANCAR</option>
                                                        <option>400 - PENDAPATAN</option>
                                                        <option>500 - HARGA POKOK PENJUALAN</option>
                                                    </FormSelect>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


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
