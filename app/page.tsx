"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import ItemTable, { ProductItem } from "./components/ItemTable";
import FormField from "./components/FormField";
import FormInput from "./components/FormInput";
import FormSelect from "./components/FormSelect";
import FormTextarea from "./components/FormTextarea";

const productItems: ProductItem[] = [
  {
    name: "Intel Core i9-13900K",
    sku: "CPU-INT-13900K",
    qty: 10,
    unitPrice: 589.0,
    subtotal: 5890.0,
  },
  {
    name: "ASUS ROG Maximus Z790",
    sku: "MB-ASUS-Z790",
    qty: 5,
    unitPrice: 629.0,
    subtotal: 3145.0,
  },
  {
    name: "Corsair Dominator 64GB DDR5",
    sku: "RAM-COR-64DDR5",
    qty: 12,
    unitPrice: 284.58,
    subtotal: 3415.0,
  },
];

type TabKey = "header" | "order-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
  { key: "header", label: "Header Info", icon: "description" },
  { key: "order-details", label: "Order Details", icon: "list_alt", badge: "3" },
  { key: "attachments", label: "Attachments", icon: "attachment" },
];

export default function PurchaseOrderPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("header");

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
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-4">
              <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white">
                <span className="material-symbols-outlined text-lg">
                  arrow_back
                </span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">
                    Pemesanan Pembelian Barang
                  </h1>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-widest border border-yellow-200">
                    Draft
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Buat dan kelola pesanan pembelian ke pemasok Anda.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all">
                Save Draft
              </button>
              <button className="px-4 py-2 text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">print</span>
                Print
              </button>
              <button className="px-5 py-2 text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                Approve Order
              </button>
            </div>
          </div>

          {/* Tab System Container */}
          <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200 shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.key
                    ? "font-bold border-primary text-primary"
                    : "text-slate-500 hover:text-slate-700 border-transparent"
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {tab.icon}
                  </span>
                  {tab.label}
                  {tab.badge && (
                    <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "header" && (
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Section: Basic & Supplier Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        <h3 className="font-bold text-slate-800">Informasi Dasar</h3>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="No. Purchase Order">
                          <FormInput defaultValue="POB 2603-0001" />
                        </FormField>
                        <FormField label="Tanggal">
                          <FormInput type="date" defaultValue="2023-10-27" />
                        </FormField>
                        <FormField label="Tipe Pembelian">
                          <FormSelect>
                            <option>Lokal</option>
                            <option>Import</option>
                          </FormSelect>
                        </FormField>
                        <FormField label="Mata Uang">
                          <div className="flex gap-2">
                            <FormSelect>
                              <option>IDR</option>
                              <option>USD</option>
                            </FormSelect>
                            <FormInput placeholder="Kurs" defaultValue="1.00" />
                          </div>
                        </FormField>
                      </div>
                    </div>

                    {/* Supplier Info Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">local_shipping</span>
                        <h3 className="font-bold text-slate-800">Data Pemasok &amp; Pengiriman</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <FormField label="Pemasok (Supplier)">
                              <div className="relative">
                                <FormInput defaultValue="Carrefour Denpasar" />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                                  <span className="material-symbols-outlined">search</span>
                                </button>
                              </div>
                            </FormField>
                          </div>
                          <FormField label="No. Invoice Supplier">
                            <FormInput placeholder="Masukkan no. invoice..." />
                          </FormField>
                          <FormField label="No. Faktur Pajak">
                            <FormInput placeholder="Masukkan no. faktur pajak..." />
                          </FormField>
                          <FormField label="Tipe Pengiriman">
                            <FormSelect>
                              <option>Normal</option>
                              <option>Express</option>
                              <option>Cargo</option>
                            </FormSelect>
                          </FormField>
                          <FormField label="Tempo Pembayaran (Hari)">
                            <div className="flex items-center gap-2">
                              <FormInput type="number" defaultValue="10" />
                              <span className="text-sm text-slate-500">Hari</span>
                            </div>
                          </FormField>
                        </div>
                        <FormField label="Keterangan">
                          <FormTextarea
                            placeholder="Tambahkan catatan untuk pesanan ini..."
                            rows={3}
                            defaultValue="Pemesanan Pembelian ke Carrefour Denpasar untuk stok gudang utama..."
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Financial Summary & Actions */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
                      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">receipt_long</span>
                          <h3 className="font-bold text-slate-800">Ringkasan Biaya</h3>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500">Sub Total</span>
                          <span className="font-semibold">IDR 12.500.000,00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Diskon</span>
                            <input
                              className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border-slate-200 rounded text-xs"
                              type="text"
                              defaultValue="0"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                          <span className="font-semibold text-red-500">0,00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">PPN</span>
                            <input
                              className="w-12 h-7 py-0 px-1 text-center bg-slate-50 border-slate-200 rounded text-xs"
                              type="text"
                              defaultValue="11"
                            />
                            <span className="text-slate-400">%</span>
                          </div>
                          <span className="font-semibold text-slate-700">1.375.000,00</span>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-base font-bold text-slate-900">Grand Total</span>
                            <span className="text-xl font-black text-primary">IDR 13.875.000,00</span>
                          </div>
                        </div>
                        <div className="pt-4 space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uang Muka (DP)</label>
                            <input
                              className="w-full bg-slate-50 border-slate-200 rounded text-right font-bold text-sm text-slate-700 focus:ring-primary"
                              type="text"
                              defaultValue="0,00"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                          <span className="material-symbols-outlined">save</span> SIMPAN PESANAN
                        </button>
                        <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined !text-sm">refresh</span> RESET
                        </button>
                        <button className="py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined !text-sm">help</span> INFO
                        </button>
                        <button className="col-span-1 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined !text-sm">verified</span> APPROVE
                        </button>
                        <button className="col-span-1 py-2 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1 text-center">
                          <span className="material-symbols-outlined !text-sm">question_answer</span> ASK CONFIRM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "order-details" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <ItemTable items={productItems} />
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-300">
                    attachment
                  </span>
                  <p className="mt-2 text-sm text-slate-500">
                    No attachments yet
                  </p>
                  <button className="mt-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
                    <span className="material-symbols-outlined text-sm">
                      upload_file
                    </span>
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer StatusBar */}
      <StatusBar />
    </div>
  );
}


