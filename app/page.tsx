"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { useActiveMenu } from "./context/ActiveMenuContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
    id: string;
    label: string;
    icon: string;
    total: number;
    value: number;
    gradient: string;
    iconBg: string;
}

interface SalesDataPoint {
    x: number;
    visits: number;
    pagesPerVisit: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
    {
        id: "pembelian",
        label: "PEMBELIAN BULAN INI",
        icon: "shopping_bag",
        total: 0,
        value: 0,
        gradient: "from-blue-500 to-blue-700",
        iconBg: "bg-blue-400/30",
    },
    {
        id: "penjualan",
        label: "PENJUALAN BULAN INI",
        icon: "storefront",
        total: 0,
        value: 0,
        gradient: "from-purple-500 to-purple-700",
        iconBg: "bg-purple-400/30",
    },
    {
        id: "hutang",
        label: "SISA HUTANG",
        icon: "account_balance_wallet",
        total: 0,
        value: 0,
        gradient: "from-slate-500 to-slate-700",
        iconBg: "bg-slate-400/30",
    },
    {
        id: "piutang",
        label: "SISA PIUTANG",
        icon: "notifications",
        total: 0,
        value: 0,
        gradient: "from-emerald-500 to-emerald-600",
        iconBg: "bg-emerald-400/30",
    },
];

const SALES_DATA: SalesDataPoint[] = [
    { x: 0.0, visits: 9.5, pagesPerVisit: 7.5 },
    { x: 0.5, visits: 8.0, pagesPerVisit: 7.0 },
    { x: 1.0, visits: 12.5, pagesPerVisit: 9.5 },
    { x: 1.5, visits: 7.5, pagesPerVisit: 6.5 },
    { x: 2.0, visits: 5.0, pagesPerVisit: 4.0 },
    { x: 2.5, visits: 7.5, pagesPerVisit: 8.5 },
    { x: 3.0, visits: 8.5, pagesPerVisit: 7.5 },
    { x: 3.5, visits: 7.5, pagesPerVisit: 6.5 },
    { x: 4.0, visits: 12.0, pagesPerVisit: 11.0 },
    { x: 4.5, visits: 5.5, pagesPerVisit: 10.5 },
    { x: 5.0, visits: 10.0, pagesPerVisit: 9.5 },
    { x: 5.5, visits: 9.5, pagesPerVisit: 9.0 },
    { x: 6.0, visits: 13.5, pagesPerVisit: 10.0 },
];

const PIE_DATA = [
    { label: "Seri 1", value: 25, color: "#818cf8" },
    { label: "Seri 2", value: 42, color: "#38bdf8" },
    { label: "Seri 3", value: 33, color: "#a78bfa" },
];

// ─── Area Chart ───────────────────────────────────────────────────────────────

function AreaChart({ data }: { data: SalesDataPoint[] }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dims, setDims] = useState({ w: 600, h: 220 });

    useEffect(() => {
        const el = svgRef.current;
        if (!el) return;
        const obs = new ResizeObserver((entries) => {
            const r = entries[0].contentRect;
            setDims({ w: r.width, h: r.height });
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const pad = { top: 20, right: 20, bottom: 40, left: 44 };
    const W = dims.w - pad.left - pad.right;
    const H = dims.h - pad.top - pad.bottom;

    const xs = data.map((d) => d.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const allY = [...data.map((d) => d.visits), ...data.map((d) => d.pagesPerVisit)];
    const minY = 0;
    const maxY = Math.ceil(Math.max(...allY) / 2.5) * 2.5;

    const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * W;
    const scaleY = (y: number) => H - ((y - minY) / (maxY - minY)) * H;

    const buildPath = (series: number[]) =>
        series.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(xs[i])},${scaleY(v)}`).join(" ");

    const buildArea = (series: number[]) => {
        const line = buildPath(series);
        return `${line} L${scaleX(xs[xs.length - 1])},${H} L${scaleX(xs[0])},${H} Z`;
    };

    const yTicks = [];
    for (let v = minY; v <= maxY; v += 2.5) yTicks.push(v);

    const xTicks = xs.filter((v, i) => i % 2 === 0);

    return (
        <svg ref={svgRef} className="w-full h-full" viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="grad-visits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="grad-pages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <g transform={`translate(${pad.left},${pad.top})`}>
                {/* Grid lines */}
                {yTicks.map((v) => (
                    <g key={v}>
                        <line
                            x1={0} x2={W}
                            y1={scaleY(v)} y2={scaleY(v)}
                            stroke="#e2e8f0" strokeWidth={1}
                        />
                        <text x={-8} y={scaleY(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
                            {v.toFixed(1)}
                        </text>
                    </g>
                ))}

                {/* X axis ticks */}
                {xTicks.map((v) => (
                    <text key={v} x={scaleX(v)} y={H + 18} textAnchor="middle" fontSize={10} fill="#94a3b8">
                        {v.toFixed(1)}
                    </text>
                ))}

                {/* Area fills */}
                <path d={buildArea(data.map((d) => d.pagesPerVisit))} fill="url(#grad-pages)" />
                <path d={buildArea(data.map((d) => d.visits))} fill="url(#grad-visits)" />

                {/* Lines */}
                <path d={buildPath(data.map((d) => d.pagesPerVisit))} fill="none" stroke="#a78bfa" strokeWidth={2} />
                <path d={buildPath(data.map((d) => d.visits))} fill="none" stroke="#60a5fa" strokeWidth={2} />

                {/* Dots */}
                {data.map((d, i) => (
                    <g key={i}>
                        <circle cx={scaleX(d.x)} cy={scaleY(d.visits)} r={4} fill="#60a5fa" stroke="white" strokeWidth={1.5} />
                        <circle cx={scaleX(d.x)} cy={scaleY(d.pagesPerVisit)} r={4} fill="#a78bfa" stroke="white" strokeWidth={1.5} />
                    </g>
                ))}
            </g>
        </svg>
    );
}

// ─── Pie Chart ────────────────────────────────────────────────────────────────

function PieChart({ data }: { data: typeof PIE_DATA }) {
    const cx = 110;
    const cy = 110;
    const r = 85;
    const inner = 40;

    const total = data.reduce((s, d) => s + d.value, 0);
    let cumAngle = -Math.PI / 2;

    const slices = data.map((d) => {
        const startAngle = cumAngle;
        const angle = (d.value / total) * 2 * Math.PI;
        cumAngle += angle;
        const endAngle = cumAngle;
        const midAngle = startAngle + angle / 2;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const xi1 = cx + inner * Math.cos(startAngle);
        const yi1 = cy + inner * Math.sin(startAngle);
        const xi2 = cx + inner * Math.cos(endAngle);
        const yi2 = cy + inner * Math.sin(endAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const labelX = cx + (r + 22) * Math.cos(midAngle);
        const labelY = cy + (r + 22) * Math.sin(midAngle);
        return { ...d, path: `M${xi1},${yi1} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${largeArc},0 ${xi1},${yi1} Z`, labelX, labelY };
    });

    return (
        <svg viewBox="0 0 220 220" className="w-full max-w-[220px] mx-auto">
            {slices.map((s, i) => (
                <g key={i}>
                    <path d={s.path} fill={s.color} stroke="white" strokeWidth={2} />
                    <text x={s.labelX} y={s.labelY - 4} textAnchor="middle" fontSize={9} fill="#475569" fontWeight="600">
                        {s.label}
                    </text>
                    <text x={s.labelX} y={s.labelY + 7} textAnchor="middle" fontSize={9} fill="#94a3b8">
                        {s.value}%
                    </text>
                </g>
            ))}
        </svg>
    );
}

// ─── Summary Row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <p className="text-xl font-black text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
    );
}

// ─── Client-Only Wrapper ──────────────────────────────────────────────────────

function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <>{fallback ?? null}</>;
    return <>{children}</>;
}

// ─── Chart Card ───────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">bar_chart</span>
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">bar_chart</span>
                    </button>
                    <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">settings</span>
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { setActiveModule } = useActiveMenu();
    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">


                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-28 md:pb-8 space-y-4 md:space-y-6">

                        {/* ── Stat Cards ───────────────────────────────── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {STAT_CARDS.map((card) => (
                                <div
                                    key={card.id}
                                    className={`bg-gradient-to-br ${card.gradient} rounded-xl p-4 md:p-5 text-white shadow-md relative overflow-hidden`}
                                >
                                    {/* Background glow */}
                                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/5" />

                                    <div className="relative z-10">
                                        {/* Icon + Total row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className={`size-10 md:size-12 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                                                <span className="material-symbols-outlined text-white text-xl md:text-2xl">
                                                    {card.icon}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl md:text-2xl font-black leading-none">
                                                    {card.total.toFixed(2)}
                                                </p>
                                                <p className="text-[11px] text-white/70 mt-0.5">Total</p>
                                            </div>
                                        </div>

                                        {/* Label */}
                                        <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
                                            <p className="text-[11px] md:text-xs font-bold uppercase tracking-wide text-white/90">
                                                {card.label}
                                            </p>
                                            <p className="text-sm font-black">{card.value.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Charts Row ───────────────────────────────── */}
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 md:gap-6">

                            {/* Sales Area Chart — 3/5 */}
                            <div className="xl:col-span-3">
                                <ChartCard title="Statistik Penjualan">
                                    {/* Legend */}
                                    <div className="px-4 pt-3 flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="inline-block size-3 rounded-sm bg-blue-400" />
                                            <span className="text-xs text-slate-500">Visits</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="inline-block size-3 rounded-sm bg-purple-400" />
                                            <span className="text-xs text-slate-500">Pages/Visit</span>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <div className="px-2 pt-2 pb-2" style={{ height: 260 }}>
                                        <ClientOnly fallback={<div className="w-full h-full bg-slate-50 rounded animate-pulse" />}>
                                            <AreaChart data={SALES_DATA} />
                                        </ClientOnly>
                                    </div>

                                    {/* Summary */}
                                    <div className="px-4 py-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                                        <SummaryRow label="Weekly Report" value="0.00" />
                                        <SummaryRow label="Monthly Report" value="0.00" />
                                        <SummaryRow label="Yearly Report" value="0.00" />
                                    </div>
                                </ChartCard>
                            </div>

                            {/* Donut / Pie Chart — 2/5 */}
                            <div className="xl:col-span-2">
                                <ChartCard title="Top 3 Most Wanted Products">
                                    {/* Legend */}
                                    <div className="px-4 pt-3 flex flex-wrap gap-3">
                                        {PIE_DATA.map((d) => (
                                            <div key={d.label} className="flex items-center gap-1.5">
                                                <span
                                                    className="inline-block size-3 rounded-sm"
                                                    style={{ backgroundColor: d.color }}
                                                />
                                                <span className="text-xs text-slate-500">{d.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart */}
                                    <div className="flex items-center justify-center px-4 py-4">
                                        <ClientOnly fallback={<div className="size-[220px] bg-slate-50 rounded-full animate-pulse" />}>
                                            <PieChart data={PIE_DATA} />
                                        </ClientOnly>
                                    </div>

                                    {/* Summary */}
                                    <div className="px-4 py-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                                        <SummaryRow label="Weekly Report" value="0.00" />
                                        <SummaryRow label="Monthly Report" value="0.00" />
                                    </div>
                                </ChartCard>
                            </div>
                        </div>

                        {/* ── Quick Links ──────────────────────────────── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {([
                                { label: "Purchase Order", href: "/purchase/order", icon: "shopping_cart", color: "text-blue-500 bg-blue-50", module: "pembelian" },
                                { label: "Sales Order",    href: "/sales/order",    icon: "storefront",    color: "text-purple-500 bg-purple-50", module: "penjualan" },
                                { label: "Produk",         href: "/master-data/product", icon: "inventory_2", color: "text-amber-500 bg-amber-50", module: "persediaan" },
                                { label: "Reports",        href: null,              icon: "bar_chart",     color: "text-emerald-500 bg-emerald-50", module: "laporan" },
                            ] as { label: string; href: string | null; icon: string; color: string; module: string }[]).map((link) =>
                                link.href ? (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setActiveModule(link.module)}
                                        className="bg-white rounded-xl border border-primary/10 shadow-sm p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                    >
                                        <div className={`size-12 rounded-xl ${link.color} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 text-center group-hover:text-primary transition-colors">
                                            {link.label}
                                        </span>
                                    </Link>
                                ) : (
                                    <button
                                        key={link.label}
                                        onClick={() => setActiveModule(link.module)}
                                        className="bg-white rounded-xl border border-primary/10 shadow-sm p-4 flex flex-col items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                                    >
                                        <div className={`size-12 rounded-xl ${link.color} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 text-center group-hover:text-primary transition-colors">
                                            {link.label}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>

                    </div>
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
