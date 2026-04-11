"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOutlets: Record<string, {
    initial: string;
    kodeUsaha: string;
    namaUsaha: string;
    merekMotto: string;
    alamat1: string;
    alamat2: string;
    alamat3: string;
    telp1: string;
    telp2: string;
    telp3: string;
    fax1: string;
    fax2: string;
    fax3: string;
    email1: string;
    email2: string;
    komisi: number;
}> = {
    "1": {
        initial: "**",
        kodeUsaha: "Jakarta",
        namaUsaha: "TRIAL DATA",
        merekMotto: "",
        alamat1: "Jl. Xyz no. 1",
        alamat2: "",
        alamat3: "",
        telp1: "021-123456789",
        telp2: "",
        telp3: "",
        fax1: "021",
        fax2: "",
        fax3: "",
        email1: "trial.data.jakarta@gmail.com",
        email2: "",
        komisi: 0,
    },
    "2": {
        initial: "BDG",
        kodeUsaha: "Bandung",
        namaUsaha: "OUTLET BANDUNG",
        merekMotto: "Solusi Terbaik",
        alamat1: "Jl. Asia Afrika No. 5",
        alamat2: "",
        alamat3: "",
        telp1: "022-987654321",
        telp2: "",
        telp3: "",
        fax1: "022",
        fax2: "",
        fax3: "",
        email1: "outlet.bandung@gmail.com",
        email2: "",
        komisi: 2,
    },
    "3": {
        initial: "SBY",
        kodeUsaha: "Surabaya",
        namaUsaha: "OUTLET SURABAYA",
        merekMotto: "",
        alamat1: "Jl. Pemuda No. 10",
        alamat2: "",
        alamat3: "",
        telp1: "031-111222333",
        telp2: "",
        telp3: "",
        fax1: "031",
        fax2: "",
        fax3: "",
        email1: "outlet.surabaya@gmail.com",
        email2: "",
        komisi: 1,
    },
};

const emptyOutlet = {
    initial: "",
    kodeUsaha: "",
    namaUsaha: "",
    merekMotto: "",
    alamat1: "",
    alamat2: "",
    alamat3: "",
    telp1: "",
    telp2: "",
    telp3: "",
    fax1: "",
    fax2: "",
    fax3: "",
    email1: "",
    email2: "",
    komisi: 0,
};

// ─── Detail / Form Page ───────────────────────────────────────────────────────

export default function OutletDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === "new";
    const existing = mockOutlets[id] ?? emptyOutlet;

    const [form, setForm] = useState({ ...existing });
    const [saved, setSaved] = useState(false);

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const pageTitle = isNew ? "Pembuatan Lokasi Baru" : `Edit Outlet: ${existing.namaUsaha || id}`;

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
                        {/* Left: Back + title */}
                        <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
                            <button
                                onClick={() => router.push("/master-data/outlet")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {pageTitle}
                                    </h1>
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew
                                        ? "Isi form di bawah untuk mendaftarkan outlet / lokasi usaha baru."
                                        : "Edit informasi outlet / lokasi usaha ini."}
                                </p>
                            </div>
                        </div>
                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">save</span>
                                Simpan
                            </button>
                            <button
                                onClick={() => router.push("/master-data/outlet")}
                                className="w-full md:w-auto justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                                Batal
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-28 md:pb-8 space-y-6">

                        {/* Success Toast */}
                        {saved && (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                <p className="text-sm text-green-700 font-medium">Data outlet berhasil disimpan.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left: Form Cards */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Identitas Usaha */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">store</span>
                                        <h3 className="font-bold text-slate-800">Identitas Usaha</h3>
                                    </div>
                                    <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <FormField label="Initial">
                                            <FormInput
                                                value={form.initial}
                                                onChange={set("initial")}
                                                placeholder="Contoh: JKT"
                                            />
                                        </FormField>
                                        <FormField label="Kode Usaha">
                                            <FormInput
                                                value={form.kodeUsaha}
                                                onChange={set("kodeUsaha")}
                                                placeholder="Contoh: Jakarta"
                                            />
                                        </FormField>
                                        <FormField label="Nama Usaha" className="sm:col-span-2">
                                            <FormInput
                                                value={form.namaUsaha}
                                                onChange={set("namaUsaha")}
                                                placeholder="Nama lengkap usaha / outlet"
                                            />
                                        </FormField>
                                        <FormField label="Merek / Motto" className="sm:col-span-2">
                                            <FormInput
                                                value={form.merekMotto}
                                                onChange={set("merekMotto")}
                                                placeholder="Merek atau motto usaha (opsional)"
                                            />
                                        </FormField>
                                    </div>
                                </div>

                                {/* Alamat */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <h3 className="font-bold text-slate-800">Alamat</h3>
                                    </div>
                                    <div className="p-4 md:p-6 space-y-4">
                                        <FormField label="Address 1">
                                            <FormInput
                                                value={form.alamat1}
                                                onChange={set("alamat1")}
                                                placeholder="Alamat baris pertama"
                                            />
                                        </FormField>
                                        <FormField label="Address 2">
                                            <FormInput
                                                value={form.alamat2}
                                                onChange={set("alamat2")}
                                                placeholder="Alamat baris kedua (opsional)"
                                            />
                                        </FormField>
                                        <FormField label="Address 3">
                                            <FormInput
                                                value={form.alamat3}
                                                onChange={set("alamat3")}
                                                placeholder="Alamat baris ketiga (opsional)"
                                            />
                                        </FormField>
                                    </div>
                                </div>

                                {/* Kontak */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">contact_phone</span>
                                        <h3 className="font-bold text-slate-800">Kontak</h3>
                                    </div>
                                    <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                        <FormField label="Telp 1">
                                            <FormInput value={form.telp1} onChange={set("telp1")} placeholder="Telp utama" />
                                        </FormField>
                                        <FormField label="Telp 2">
                                            <FormInput value={form.telp2} onChange={set("telp2")} placeholder="Telp ke-2 (opsional)" />
                                        </FormField>
                                        <FormField label="Telp 3">
                                            <FormInput value={form.telp3} onChange={set("telp3")} placeholder="Telp ke-3 (opsional)" />
                                        </FormField>
                                        <FormField label="Fax 1">
                                            <FormInput value={form.fax1} onChange={set("fax1")} placeholder="Fax utama" />
                                        </FormField>
                                        <FormField label="Fax 2">
                                            <FormInput value={form.fax2} onChange={set("fax2")} placeholder="Fax ke-2 (opsional)" />
                                        </FormField>
                                        <FormField label="Fax 3">
                                            <FormInput value={form.fax3} onChange={set("fax3")} placeholder="Fax ke-3 (opsional)" />
                                        </FormField>
                                        <FormField label="Email 1" className="sm:col-span-2">
                                            <FormInput type="email" value={form.email1} onChange={set("email1")} placeholder="Email utama" />
                                        </FormField>
                                        <FormField label="Email 2">
                                            <FormInput type="email" value={form.email2} onChange={set("email2")} placeholder="Email ke-2 (opsional)" />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">settings</span>
                                        <h3 className="font-bold text-slate-800">Aksi</h3>
                                    </div>

                                    {saved && (
                                        <div className="mx-4 mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                            <span className="material-symbols-outlined text-green-600 text-base">check_circle</span>
                                            <p className="text-xs text-green-700 font-medium">Data berhasil disimpan.</p>
                                        </div>
                                    )}

                                    <div className="p-4 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="col-span-2 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined">save</span>
                                            SIMPAN
                                        </button>
                                        <button
                                            onClick={() => setForm({ ...existing })}
                                            className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <span className="material-symbols-outlined !text-sm">refresh</span>
                                            RESET
                                        </button>
                                        <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined !text-sm">help</span>
                                            INFO
                                        </button>
                                    </div>

                                    {/* Komisi */}
                                    <div className="px-4 pb-4">
                                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-3">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Komisi</p>
                                            <FormField label="Komisi (%)">
                                                <div className="flex items-center gap-2">
                                                    <FormInput
                                                        type="number"
                                                        value={String(form.komisi)}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            setForm((prev) => ({ ...prev, komisi: Number(e.target.value) }))
                                                        }
                                                        placeholder="0"
                                                    />
                                                    <span className="text-sm font-semibold text-slate-500">%</span>
                                                </div>
                                            </FormField>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="px-4 pb-4">
                                        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-2">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <span className="material-symbols-outlined !text-sm text-slate-400">store</span>
                                                <span>Kode: <span className="font-semibold">{form.kodeUsaha || "—"}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <span className="material-symbols-outlined !text-sm text-slate-400">tag</span>
                                                <span>Initial: <span className="font-semibold">{form.initial || "—"}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <span className="material-symbols-outlined !text-sm text-slate-400">mail</span>
                                                <span className="truncate">{form.email1 || "—"}</span>
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
