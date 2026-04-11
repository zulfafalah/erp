"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import StatusBar from "../../../components/StatusBar";
import FormField from "../../../components/FormField";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "data-pengguna" | "outlet" | "gudang";

const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "data-pengguna", label: "Data Pengguna",   icon: "manage_accounts" },
    { key: "outlet",        label: "Outlet by User",  icon: "store"           },
    { key: "gudang",        label: "Gudang by User",  icon: "warehouse"       },
];

// ─── Mock: Outlet Data ────────────────────────────────────────────────────────

interface OutletItem {
    id: string;
    lokasi: string;
    nama: string;
    initial: string;
    selected: boolean;
}

const outletData: OutletItem[] = [
    { id: "1", lokasi: "Jakarta", nama: "TRIA DATA", initial: "**", selected: false },
];

// ─── Mock: Gudang Data ────────────────────────────────────────────────────────

interface GudangItem {
    id: string;
    kode: string;
    nama: string;
    alamat: string;
    telp: string;
    pic: string;
    selected: boolean;
}

const gudangData: GudangItem[] = [
    { id: "1",  kode: "GDCTC",   nama: "GUDANG CARREFOUR TANGERANG CENTER",   alamat: "Kompleks Manlora Mas",              telp: "08577776725",            pic: "Bapak M. Nur",         selected: false },
    { id: "2",  kode: "GDPA1",   nama: "GUDANG DADAP AB",                     alamat: "PERUMDARAAN MUTIARA",               telp: "",                       pic: "BAPAK BRTTY NICO",     selected: false },
    { id: "3",  kode: "GDPB48",  nama: "GUDANG DADAP B3 AB",                  alamat: "GUDANG DADAP B3 AB",                telp: "024-41023401",           pic: "GUDANG DADAP B3 AB",   selected: false },
    { id: "4",  kode: "GDPBC7",  nama: "GDPBC7",                              alamat: "GDPBC7",                            telp: "",                       pic: "GDPBC7",               selected: false },
    { id: "5",  kode: "GDCR7",   nama: "GUDANG DADAP C7",                     alamat: "PER. MUATIARA KOSAMBA",             telp: "",                       pic: "BAPAK BRTTY NICO",     selected: false },
    { id: "6",  kode: "GDCB5",   nama: "GUDANG GIANT KALIBATA",               alamat: "Jl. Ruwajuto Timur 1",             telp: "0800 170 8877 / 0815 9880 711", pic: "BPK. ZAINAL",  selected: false },
    { id: "7",  kode: "GDGUM",   nama: "GUDANG GIANT UJUNG MENTENG",          alamat: "Jl. Raya Bekasi KM.2",             telp: "021-46023401 / 0815 9880 711", pic: "BPK. ZAINAL",  selected: false },
    { id: "8",  kode: "GDMUK",   nama: "GUDANG MANGALA DHARMA RAGA",          alamat: "BISNIS UNIT DISTRIBU",              telp: "08116690885",            pic: "BPK. DADANG DAYADI",   selected: false },
    { id: "9",  kode: "GRFK",    nama: "Gudang Kapuk",                        alamat: "Alamat gudang, baik",               telp: "No. Telp / No. Fax",    pic: "Person in charge (2/1",selected: false },
    { id: "10", kode: "GRPM1",   nama: "GUDANG KAPUK B3",                     alamat: "GUDANG KAPUK B3",                   telp: "",                       pic: "GUDANG KAPUK B3",      selected: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImageUploadBox({ label }: { label: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <div className="space-y-2">
            <div
                className="w-28 h-28 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => inputRef.current?.click()}
            >
                {preview ? (
                    <img src={preview} alt={label} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-2">
                        <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                        <p className="text-[10px] text-slate-400 mt-1">No Image</p>
                    </div>
                )}
            </div>
            <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-slate-600"
            >
                <span className="material-symbols-outlined !text-sm">upload_file</span>
                Pilih File
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
        </div>
    );
}

// ─── Tab: Data Pengguna ───────────────────────────────────────────────────────

function TabDataPengguna({ userId }: { userId: string }) {
    const [saved, setSaved] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Akun */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">key</span>
                            <h3 className="font-bold text-slate-800">Akun</h3>
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                            <FormField label="ID User">
                                <FormInput defaultValue={userId !== "new" ? "momo1" : ""} placeholder="Masukkan ID user" />
                            </FormField>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</span>
                                {showResetPassword ? (
                                    <div className="flex items-center gap-3">
                                        <FormInput type="password" placeholder="Password baru" />
                                        <button
                                            onClick={() => setShowResetPassword(false)}
                                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 whitespace-nowrap"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowResetPassword(true)}
                                        className="flex items-center gap-1.5 w-fit text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <span className="material-symbols-outlined !text-sm">lock_reset</span>
                                        Reset Password
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Informasi User */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">person</span>
                            <h3 className="font-bold text-slate-800">Informasi User</h3>
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label="Nama Lengkap" className="sm:col-span-2">
                                    <FormInput defaultValue={userId !== "new" ? "momo1" : ""} placeholder="Nama lengkap pengguna" />
                                </FormField>
                                <FormField label="Email 1">
                                    <FormInput type="email" defaultValue={userId !== "new" ? "momo1@mailinator.com" : ""} placeholder="Email utama" />
                                </FormField>
                                <FormField label="Email 2">
                                    <FormInput defaultValue={userId !== "new" ? "393567" : ""} placeholder="Email alternatif" />
                                </FormField>
                                <FormField label="No. Telp">
                                    <FormInput defaultValue={userId !== "new" ? "-" : ""} placeholder="Nomor telepon" />
                                </FormField>
                            </div>

                            {/* Tanda Tangan */}
                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanda Tangan</span>
                                <ImageUploadBox label="Tanda Tangan" />
                            </div>

                            {/* Upload Foto */}
                            <div className="space-y-2 pt-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upload Foto</span>
                                <ImageUploadBox label="Foto Profil" />
                            </div>
                        </div>
                    </div>

                    {/* Informasi Jabatan */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">badge</span>
                            <h3 className="font-bold text-slate-800">Informasi Jabatan</h3>
                        </div>
                        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <FormField label="Divisi">
                                <FormSelect defaultValue="Divisi 1">
                                    <option value="Divisi 1">Divisi 1</option>
                                    <option value="Divisi 2">Divisi 2</option>
                                    <option value="Divisi 3">Divisi 3</option>
                                </FormSelect>
                            </FormField>
                            <FormField label="Departemen">
                                <FormSelect defaultValue="Departemen 1">
                                    <option value="Departemen 1">Departemen 1</option>
                                    <option value="Departemen 2">Departemen 2</option>
                                </FormSelect>
                            </FormField>
                            <FormField label="Posisi">
                                <FormSelect defaultValue="Administrator">
                                    <option value="Administrator">Administrator</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Kasir">Kasir</option>
                                    <option value="Gudang">Gudang</option>
                                    <option value="Pembelian">Pembelian</option>
                                    <option value="Keuangan">Keuangan</option>
                                    <option value="Admin SO">Admin SO</option>
                                    <option value="Boss">Boss</option>
                                    <option value="Sales">Sales</option>
                                </FormSelect>
                            </FormField>
                            <FormField label="Atasan">
                                <FormSelect defaultValue="">
                                    <option value="">:: Pilih Atasan ::</option>
                                    <option value="Administrator">Administrator</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Boss">Boss</option>
                                    <option value="Pembelian">Pembelian</option>
                                </FormSelect>
                            </FormField>
                        </div>
                    </div>

                    {/* Informasi Kredit */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">credit_card</span>
                            <h3 className="font-bold text-slate-800">Informasi Kredit &amp; Aktivasi</h3>
                        </div>
                        <div className="p-4 md:p-6 space-y-4">
                            <FormField label="Batas Kredit">
                                <FormInput type="number" defaultValue={userId !== "new" ? "10000" : "0"} placeholder="Batas kredit" />
                            </FormField>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aktivasi User</span>
                                <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                                        {isActive ? "Active" : "Nonactive"}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {isActive ? "Aktif" : "Nonaktif"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column — Actions */}
                <div className="space-y-5">
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
                            <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined !text-sm">refresh</span>
                                RESET
                            </button>
                            <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined !text-sm">help</span>
                                INFO
                            </button>
                        </div>

                        <div className="px-4 pb-4">
                            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi</p>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="material-symbols-outlined !text-sm text-slate-400">person</span>
                                    <span>ID: <span className="font-semibold">{userId !== "new" ? "momo1" : "—"}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="material-symbols-outlined !text-sm text-slate-400">business</span>
                                    <span>Divisi 1</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <span className="material-symbols-outlined !text-sm text-slate-400">work</span>
                                    <span>Administrator</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Outlet by User ──────────────────────────────────────────────────────

function TabOutlet() {
    const [outlets, setOutlets] = useState<OutletItem[]>(outletData);

    const toggleSelect = (id: string) => {
        setOutlets((prev) =>
            prev.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o))
        );
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">store</span>
                    <h3 className="font-bold text-slate-800">Akses Outlet</h3>
                    <span className="ml-auto text-xs text-slate-500">
                        Centang outlet yang dapat diakses oleh pengguna ini
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-primary/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Lokasi</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nama</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Initial</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Pilih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {outlets.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-500">{idx + 1}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{item.lokasi}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.initial}</td>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleSelect(item.id)}
                                            className="w-4 h-4 accent-primary cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-primary/10">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-base">save</span>
                        Simpan Akses Outlet
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Gudang by User ──────────────────────────────────────────────────────

function TabGudang() {
    const [gudangs, setGudangs] = useState<GudangItem[]>(gudangData);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;
    const totalPages = Math.ceil(gudangs.length / perPage);
    const paginatedGudang = gudangs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const toggleSelect = (id: string) => {
        setGudangs((prev) =>
            prev.map((g) => (g.id === id ? { ...g, selected: !g.selected } : g))
        );
    };

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">warehouse</span>
                    <h3 className="font-bold text-slate-800">Akses Gudang</h3>
                    <span className="ml-auto text-xs text-slate-500">
                        Centang gudang yang dapat diakses oleh pengguna ini
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-primary/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Kode</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nama</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Alamat</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Telp</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">PIC</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Pilih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {paginatedGudang.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-500">{(currentPage - 1) * perPage + idx + 1}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-primary">{item.kode}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{item.nama}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{item.alamat}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.telp || "—"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.pic}</td>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleSelect(item.id)}
                                            className="w-4 h-4 accent-primary cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-4 md:px-6 py-4 bg-slate-50 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        Menampilkan {(currentPage - 1) * perPage + 1} sampai {Math.min(currentPage * perPage, gudangs.length)} dari {gudangs.length} data
                    </p>
                    <div className="flex items-center gap-2">
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
                                    currentPage === page ? "bg-primary text-white font-bold" : "hover:bg-white text-slate-600"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-base">save</span>
                        Simpan Akses Gudang
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserSettingsDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>("data-pengguna");
    const isNew = params.id === "new";
    const pageTitle = isNew ? "Tambah Pengguna Baru" : `Data Pengguna: ${params.id}`;

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
                                onClick={() => router.push("/settings/user-settings")}
                                className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </button>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                                        {pageTitle}
                                    </h1>
                                    {!isNew && (
                                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-green-200">
                                            Aktif
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                                    {isNew ? "Isi form di bawah untuk membuat pengguna baru." : "Edit informasi, jabatan, dan akses pengguna ini."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tab System Container */}
                    <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 pb-28 md:pb-6 gap-4 md:gap-6">
                        {/* Tabs Selector */}
                        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 shrink-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.key
                                            ? "font-bold border-primary text-primary"
                                            : "text-slate-500 hover:text-slate-700 border-transparent"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === "data-pengguna" && <TabDataPengguna userId={params.id} />}
                        {activeTab === "outlet"        && <TabOutlet />}
                        {activeTab === "gudang"        && <TabGudang />}
                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
