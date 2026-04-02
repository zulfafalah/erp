"use client";

import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

export default function CityFormPage() {
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
                                onClick={() => router.push("/master-data/city")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                    :: Data Kota
                                </h1>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    Kelola master data kota di sistem.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">refresh</span>
                                Reset
                            </button>
                            <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-400 rounded-lg transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">help</span>
                                Info
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

                                {/* Left Section: Form */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        {/* Card Header */}
                                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">location_city</span>
                                            <h3 className="font-bold text-slate-800">Informasi Kota</h3>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 md:p-6 space-y-4 md:space-y-5">

                                            {/* Nama Kota */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Nama Kota
                                                </label>
                                                <div className="sm:col-span-3 w-2/3">
                                                    <FormInput
                                                        placeholder="Masukkan nama kota"
                                                        defaultValue=""
                                                    />
                                                </div>
                                            </div>

                                            {/* Negara */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                                <label className="text-sm font-medium text-slate-700 sm:col-span-1">
                                                    Negara
                                                </label>
                                                <div className="sm:col-span-3 w-2/3">
                                                    <FormSelect defaultValue="">
                                                        <option value="" disabled>Pilih negara</option>
                                                        <option value="AR">ARAB</option>
                                                        <option value="AU">AUSTRALIA</option>
                                                        <option value="CN">CHINA</option>
                                                        <option value="HK">HONGKONG</option>
                                                        <option value="ID">INDONESIA</option>
                                                        <option value="JP">JEPANG</option>
                                                        <option value="MY">MALAYSIA</option>
                                                        <option value="SG">SINGAPORE</option>
                                                        <option value="SU">SUMATRA</option>
                                                    </FormSelect>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Info Summary */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <h3 className="font-bold text-slate-800">Informasi</h3>
                                        </div>
                                        <div className="p-4 md:p-6 space-y-3">
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Data kota digunakan sebagai referensi dalam transaksi penjualan, pelanggan, dan pengiriman barang.
                                            </p>
                                            <div className="pt-3 border-t border-slate-100 space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Dibuat oleh</span>
                                                    <span className="font-semibold text-slate-700">ADMINISTRATOR</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Tanggal</span>
                                                    <span className="font-semibold text-slate-700">—</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Status</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Aktif
                                                    </span>
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
