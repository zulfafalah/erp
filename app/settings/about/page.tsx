"use client";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatusBar from "../../components/StatusBar";

// ─── Data Konten ──────────────────────────────────────────────────────────────

const features = [
    {
        icon: "cloud",
        title: "Akses Dari Mana Saja",
        desc: "Dapat diakses dari manapun via internet atau WiFi, tanpa perlu install aplikasi di komputer Anda.",
    },
    {
        icon: "payments",
        title: "Tanpa Biaya Awal",
        desc: "Tidak ada biaya untuk mulai atau upgrade. Dapatkan update gratis secara otomatis dan tidak perlu kontrak.",
    },
    {
        icon: "verified",
        title: "Aman & Handal",
        desc: "Layanan software akuntansi online yang aman & handal untuk usaha kecil dan menengah di Indonesia.",
    },
    {
        icon: "speed",
        title: "Efisiensi Waktu",
        desc: "Jauh lebih hemat waktu dalam proses administrasi & operasional bisnis Anda sehari-hari.",
    },
];

const timeline = [
    { year: "2010", label: "Berdiri", desc: "E-Smart pertama kali hadir sebagai solusi software akuntansi lokal." },
    { year: "2014", label: "Online", desc: "Migrasi ke platform cloud, memungkinkan akses dari mana saja." },
    { year: "2018", label: "Berkembang", desc: "Lebih dari 500 pelanggan aktif di seluruh Indonesia." },
    { year: "2024", label: "Modern", desc: "Peluncuran antarmuka terbaru dengan fitur E-Smart generasi terkini." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-28 md:pb-8 space-y-8 md:space-y-12">

                        {/* ── Hero Section ───────────────────────────────── */}
                        <div className="relative bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                            {/* Decorative gradient blob */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl" />
                            </div>

                            <div className="relative px-6 md:px-12 py-10 md:py-16 text-center max-w-3xl mx-auto">
                                {/* Badge */}
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest mb-5">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    Tentang E-Smart
                                </span>

                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                                    Kami ingin membuat proses administrasi usaha{" "}
                                    <span className="text-primary">menjadi lebih mudah &amp; cepat</span>{" "}
                                    untuk semua pemilik bisnis.
                                </h1>

                                <p className="text-base md:text-lg font-bold text-emerald-600">
                                    Kami Mau Menjadi Bagian Dari Visi &amp; Kekuatan Pebisnis
                                </p>
                            </div>
                        </div>

                        {/* ── Siapa Kami ─────────────────────────────────── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">people</span>
                                <h2 className="font-bold text-slate-800">Siapa Kami</h2>
                            </div>
                            <div className="p-6 md:p-8 space-y-4 text-sm md:text-base text-slate-700 leading-relaxed">
                                <p>
                                    <strong className="text-slate-900">E-Smart</strong> menyediakan layanan software akunting online yang aman &amp; handal untuk usaha kecil dan menengah di Indonesia. Kami berjuang untuk memberi para pengusaha kebebasan dari kerumitan administrasi, operasional, dan perpajakan supaya bisa fokus melakukan hal yang paling penting untuk mengembangkan bisnis mereka. Ini akan dicapai dengan membuat teknologi efektif yang sangat mudah untuk di pakai.
                                </p>
                                <p>
                                    <strong className="text-slate-900">E-Smart</strong> tersedia sebagai layanan yang dapat di akses dari manapun dengan koneksi via internet atau WiFi. Dengan <strong className="text-slate-900">E-Smart</strong>, tidak perlu lagi download atau install apapun di komputer Anda. Tidak ada biaya untuk mulai atau upgrade, dapatkan update gratis secara otomatis, dan tidak perlu kontrak. Anda hanya perlu daftar, login, dan mulai mengerjakan pembukuan usaha Anda kapanpun, dimanapun. Usaha yang memakai <strong className="text-slate-900">E-Smart</strong> berjalan lebih baik karena jauh lebih hemat waktu dalam proses administrasi &amp; operasional.
                                </p>
                                <p>
                                    <strong className="text-slate-900">E-Smart</strong> hadir sebagai Simple &amp; Modern Application for Online Trading untuk menunjang kesuksesan pebisnis. Dengan motto <em>"Connecting Business and Accounting"</em>, <strong className="text-slate-900">E-Smart</strong> ingin memudahkan pembukuan serta proses akuntansi pemilik bisnis. Kami bekerja keras untuk berinovasi demi hasil yang maksimal. <strong className="text-slate-900">E-Smart</strong> terus berupaya agar pebisnis dapat menggunakan produk dengan mudah serta hasil yang optimal. Komitmen kami adalah memastikan solusi pembukuan dan akuntansi bisnis selalu terpenuhi.
                                </p>
                            </div>
                        </div>

                        {/* ── Keunggulan ─────────────────────────────────── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">stars</span>
                                <h2 className="font-bold text-slate-800">Keunggulan E-Smart</h2>
                            </div>
                            <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {features.map((f) => (
                                    <div
                                        key={f.title}
                                        className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:border-primary/20 hover:bg-primary/5 transition-all"
                                    >
                                        <div className="size-10 flex items-center justify-center rounded-xl bg-primary/10 shrink-0">
                                            <span className="material-symbols-outlined text-primary">{f.icon}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{f.title}</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Timeline ───────────────────────────────────── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                <h2 className="font-bold text-slate-800">Perjalanan Kami</h2>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/10" />
                                    <div className="space-y-6">
                                        {timeline.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-5 relative">
                                                <div className="size-12 flex items-center justify-center rounded-full bg-primary text-white text-xs font-black shrink-0 z-10 shadow-lg shadow-primary/20">
                                                    {item.year}
                                                </div>
                                                <div className="pt-2">
                                                    <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Informasi Versi ────────────────────────────── */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <h2 className="font-bold text-slate-800">Informasi Aplikasi</h2>
                            </div>
                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Nama Aplikasi", value: "E-Smart ERP" },
                                        { label: "Versi", value: "v2.5.0" },
                                        { label: "Motto", value: "Connecting Business and Accounting" },
                                        { label: "Platform", value: "Web-Based (Cloud)" },
                                        { label: "Target Pengguna", value: "UKM Indonesia" },
                                        { label: "Bahasa", value: "Indonesia" },
                                    ].map((row) => (
                                        <div key={row.label} className="flex flex-col gap-0.5 py-3 border-b border-slate-50 last:border-0">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{row.label}</span>
                                            <span className="text-sm font-medium text-slate-800">{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Footer note ────────────────────────────────── */}
                        <div className="text-center py-4">
                            <p className="text-xs text-slate-400">
                                © {new Date().getFullYear()} E-Smart. All rights reserved. — Built with ❤️ for Indonesian businesses.
                            </p>
                        </div>

                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
