# ERP Page Conventions — Panduan Lengkap

Dokumen ini adalah referensi utama untuk membuat semua halaman dalam aplikasi ERP. Setiap halaman **wajib** mengikuti pola di bawah ini agar tampilan dan perilaku seragam di seluruh modul.

---

## 1. Struktur Layout Root

Setiap halaman menggunakan struktur wrapper berikut tanpa pengecualian:

```tsx
"use client";

export default function XxxPage() {
    return (
        <div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
            {/* Top Navigation Bar */}
            <Navbar />

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <Sidebar />

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
                    {/* ... konten halaman ... */}
                </section>
            </main>

            {/* Footer StatusBar */}
            <StatusBar />
        </div>
    );
}
```

**Aturan:**
- Direktif `"use client"` selalu di baris pertama.
- Import komponen: `Navbar` dari `../components/Navbar`, `Sidebar` dari `../components/Sidebar`, `StatusBar` dari `../components/StatusBar`.
- Untuk halaman di dalam subfolder `[id]/`, path import mundur satu level: `../../components/...`.
- `pb-8` pada wrapper root memberikan ruang untuk StatusBar mobile.

---

## 2. Pola Halaman List

Halaman list (daftar data) menggunakan struktur:

```
section
└── div.flex-1.overflow-y-auto.p-4.md:p-8.pb-28.md:pb-8.space-y-4.md:space-y-8
    ├── div → Title & Actions
    ├── div.bg-white.rounded-xl → Table Container
    │   ├── div.block.md:hidden   → Mobile Card View
    │   ├── div.hidden.md:block   → Desktop Table View
    │   └── div                   → Pagination
```

### 2.1 Title & Actions

```tsx
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Daftar [Nama Modul]
        </h2>
        <p className="text-slate-500 mt-1">
            [Deskripsi singkat modul ini.]
        </p>
    </div>
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
        <MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
        <Link
            href="/[modul]/new"
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-3 md:px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Tambah [Item] Baru
        </Link>
    </div>
</div>
```

**Aturan:**
- Judul halaman menggunakan `h2` dengan class `text-2xl md:text-3xl font-black tracking-tight text-slate-900`.
- Tombol tambah baru selalu menggunakan `bg-primary text-white` dengan ikon `add_circle`.
- `MultiFilter` selalu ditampilkan di sebelah kiri tombol tambah.

### 2.2 MultiFilter & FILTER_FIELDS

Setiap halaman list mendefinisikan array `FILTER_FIELDS` bertipe `FilterField[]` di luar komponen:

```tsx
import MultiFilter, { FilterField, FilterRule } from "../components/MultiFilter";

const FILTER_FIELDS: FilterField[] = [
    { key: "namaField", label: "Label Field", type: "text" },
    {
        key: "status", label: "Status", type: "select", options: [
            { label: "Aktif", value: "Aktif" },
            { label: "Nonaktif", value: "Nonaktif" },
        ]
    },
];
```

Handler filter didefinisikan di dalam komponen dengan pola string matching:

```tsx
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
```

State untuk data yang difilter:

```tsx
const [filteredData, setFilteredData] = useState<TipeData[]>(allData);
```

### 2.3 Table Container

Container tabel menggunakan class:

```tsx
<div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden">
```

### 2.4 Mobile Card View

Digunakan hanya pada layar kecil (`block md:hidden`). Setiap baris data menjadi sebuah card:

```tsx
<div className="block md:hidden divide-y divide-primary/5">
    {filteredData.map((item) => (
        <div key={item.id} className="p-4 space-y-3">
            {/* Row atas: identifier + status */}
            <div className="flex justify-between items-start">
                <div>
                    <Link
                        href={`/[modul]/${item.id}`}
                        className="font-semibold text-primary text-sm hover:underline"
                    >
                        {item.noIdentifier}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{item.tanggal}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                    {item.status}
                </span>
            </div>
            {/* Row tengah: info utama */}
            <div>
                <p className="text-sm font-medium text-slate-900">{item.namaUtama}</p>
                <p className="text-xs text-slate-500">{item.infoSekunder}</p>
            </div>
            {/* Row bawah: nilai + aksi */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900">{item.nilai}</span>
                <div className="flex items-center gap-1">
                    <Link href={`/[modul]/${item.id}`} className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">edit_square</span>
                    </Link>
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">print</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            </div>
        </div>
    ))}
</div>
```

### 2.5 Desktop Table View

Digunakan hanya pada layar md ke atas (`hidden md:block`):

```tsx
<div className="hidden md:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
        <thead>
            <tr className="bg-slate-50 border-b border-primary/10">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Nama Kolom
                </th>
                {/* ... kolom lain ... */}
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Aksi
                </th>
            </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
            {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                        <Link
                            href={`/[modul]/${item.id}`}
                            className="font-semibold text-primary text-sm tracking-tight hover:underline"
                        >
                            {item.noIdentifier}
                        </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">{item.tanggal}</td>
                    <td className="px-6 py-4 text-sm font-medium">{item.namaUtama}</td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Link
                                href={`/[modul]/${item.id}`}
                                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                title="View/Edit"
                            >
                                <span className="material-symbols-outlined text-lg">edit_square</span>
                            </Link>
                            <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Print">
                                <span className="material-symbols-outlined text-lg">print</span>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
```

**Aturan kolom tabel:**
- Header: `px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500`
- Cell standar: `px-6 py-4 text-sm`
- Cell identifier (link): `font-semibold text-primary text-sm tracking-tight hover:underline`
- Cell nilai uang: `px-6 py-4 text-sm font-bold`
- Kolom Aksi: header `text-right`, cell `text-right`

### 2.6 Pagination

```tsx
<div className="px-4 md:px-6 py-4 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
    <p className="text-sm text-slate-500 text-center md:text-left">
        Menampilkan 1 sampai {perPage} dari {total} data
    </p>
    <div className="flex flex-wrap justify-center items-center gap-1">
        <button className="p-2 border border-primary/10 rounded hover:bg-white disabled:opacity-50" disabled>
            <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
        <button className="px-3 py-1 hover:bg-white text-sm font-medium rounded transition-colors">2</button>
        <span className="px-2 text-slate-400">...</span>
        <button className="p-2 border border-primary/10 rounded hover:bg-white">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
    </div>
</div>
```

---

## 3. Pola Halaman Detail / Form

Halaman detail (create/edit) menggunakan struktur dua bagian utama di dalam `<section>`: **Action Header** dan **Tab System Container**.

```
section
├── div → Action Header (shrink-0, border bawah)
└── div → Tab System Container (flex-1, overflow-hidden)
    ├── div → Tabs Selector
    └── div → Tab Content (aktif ditampilkan)
```

### 3.1 Action Header

```tsx
<div className="px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 bg-white/50 backdrop-blur-sm shrink-0">
    {/* Kiri: Back button + judul + status badge */}
    <div className="flex items-start md:items-center gap-3 md:gap-4 w-full md:w-auto">
        <button
            onClick={() => router.push("/[modul]")}
            className="size-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-white mt-1 md:mt-0"
        >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                    [Nama Dokumen/Modul]
                </h1>
                <span className="px-2 md:px-3 py-0.5 md:py-1 bg-yellow-100 text-yellow-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-yellow-200">
                    Draft
                </span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                [Deskripsi singkat halaman ini.]
            </p>
        </div>
    </div>
    {/* Kanan: Action buttons */}
    <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
        <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-200/50 rounded-lg transition-all border border-slate-200 md:border-transparent">
            Save Draft
        </button>
        <button className="flex-1 md:flex-none justify-center px-3 md:px-4 py-2 text-xs md:text-sm font-semibold bg-white text-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">print</span>
            Print
        </button>
        <button className="w-full md:w-auto justify-center px-4 md:px-5 py-2 text-xs md:text-sm font-bold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Approve [Nama]
        </button>
    </div>
</div>
```

**Aturan:**
- Back button: `size-8`, ikon `arrow_back`, navigasi ke halaman list menggunakan `useRouter`.
- Status badge mengikuti warna **Status Badge** (lihat bagian 6).
- Urutan tombol aksi: Save Draft (ghost) → Print (outline) → Approve (primary solid).

### 3.2 Tab System Container

```tsx
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
                {tab.badge && (
                    <span className="size-5 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">
                        {tab.badge}
                    </span>
                )}
            </button>
        ))}
    </div>

    {/* Tab Content */}
    {activeTab === "header" && ( ... )}
    {activeTab === "order-details" && ( ... )}
    {activeTab === "attachments" && ( ... )}
</div>
```

Definisi tabs di luar komponen:

```tsx
type TabKey = "header" | "order-details" | "attachments";

const tabs: { key: TabKey; label: string; icon: string; badge?: string }[] = [
    { key: "header", label: "Header Info", icon: "description" },
    { key: "order-details", label: "Order Details", icon: "list_alt", badge: "3" },
    { key: "attachments", label: "Attachments", icon: "attachment" },
];
```

State tab:

```tsx
const [activeTab, setActiveTab] = useState<TabKey>("header");
```

### 3.3 Tab Header — Layout Grid

Tab "header" menggunakan grid dua kolom: kiri (form cards) dan kanan (sidebar ringkasan):

```tsx
<div className="flex-1 overflow-y-auto no-scrollbar pb-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Kiri: 2/3 lebar — form cards */}
        <div className="lg:col-span-2 space-y-6">
            {/* Card Informasi Dasar */}
            {/* Card Data Relasi (Pemasok / Pelanggan / dll.) */}
        </div>
        {/* Kanan: 1/3 lebar — ringkasan & aksi */}
        <div className="space-y-6">
            {/* Card Ringkasan Biaya */}
        </div>
    </div>
</div>
```

### 3.4 Form Card

Setiap kartu form menggunakan struktur berikut:

```tsx
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    {/* Card Header */}
    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">[icon]</span>
        <h3 className="font-bold text-slate-800">[Judul Kartu]</h3>
    </div>
    {/* Card Body */}
    <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <FormField label="Label Field">
            <FormInput defaultValue="..." />
        </FormField>
        <FormField label="Label Select">
            <FormSelect>
                <option>Pilihan 1</option>
            </FormSelect>
        </FormField>
        <FormField label="Textarea" className="sm:col-span-2">
            <FormTextarea placeholder="..." rows={3} />
        </FormField>
    </div>
</div>
```

**Ikon card header yang disarankan:**
| Konten | Ikon |
|---|---|
| Informasi Dasar | `info` |
| Data Pemasok | `local_shipping` |
| Data Pelanggan | `person` |
| Pembayaran | `payments` |
| Ringkasan Biaya | `receipt_long` |
| Pengiriman | `local_shipping` |
| Lampiran | `attachment` |

### 3.5 Sidebar Ringkasan Biaya

```tsx
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-0">
    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">receipt_long</span>
        <h3 className="font-bold text-slate-800">Ringkasan Biaya</h3>
    </div>
    <div className="p-4 md:p-6 space-y-4">
        {/* Sub Total, Diskon, PPN */}
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Sub Total</span>
            <span className="font-semibold">IDR 0,00</span>
        </div>
        {/* Grand Total */}
        <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
                <span className="text-sm md:text-base font-bold text-slate-900">Grand Total</span>
                <span className="text-lg md:text-xl font-black text-primary">IDR 0,00</span>
            </div>
        </div>
    </div>
    {/* Action Buttons Grid */}
    <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button className="col-span-2 py-3 bg-primary text-white rounded font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">save</span> SIMPAN
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
        <button className="col-span-1 py-2 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-1">
            <span className="material-symbols-outlined !text-sm">question_answer</span> ASK CONFIRM
        </button>
    </div>
</div>
```

### 3.6 Tab Order Details — ItemTable

```tsx
{activeTab === "order-details" && (
    <div className="flex-1 flex flex-col overflow-hidden">
        <ItemTable items={productItems} />
    </div>
)}
```

Import: `import ItemTable, { ProductItem } from "../../components/ItemTable";`

### 3.7 Tab Attachments — Empty State

```tsx
{activeTab === "attachments" && (
    <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300">attachment</span>
            <p className="mt-2 text-sm text-slate-500">No attachments yet</p>
            <button className="mt-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload File
            </button>
        </div>
    </div>
)}
```

---

## 4. Komponen Shared

Selalu gunakan komponen berikut, jangan membuat elemen form ad-hoc:

### FormField
```tsx
import FormField from "../components/FormField";

<FormField label="Label Field">
    {/* children */}
</FormField>
```
- Label otomatis ditampilkan dengan style `text-xs font-semibold text-slate-500 uppercase`.

### FormInput
```tsx
import FormInput from "../components/FormInput";

<FormInput defaultValue="..." placeholder="..." type="text|date|number" />
```

### FormSelect
```tsx
import FormSelect from "../components/FormSelect";

<FormSelect>
    <option value="pilihan1">Pilihan 1</option>
</FormSelect>
```

### FormTextarea
```tsx
import FormTextarea from "../components/FormTextarea";

<FormTextarea placeholder="..." rows={3} defaultValue="..." />
```

### MultiFilter
```tsx
import MultiFilter, { FilterField, FilterRule } from "../components/MultiFilter";

<MultiFilter fields={FILTER_FIELDS} onApplyFilter={handleApplyFilter} />
```

### ItemTable
```tsx
import ItemTable, { ProductItem } from "../components/ItemTable";

<ItemTable items={items} />
```

---

## 5. Konvensi TypeScript

### Interface Data

Definisikan interface di bagian atas file, setelah import:

```tsx
interface NamaData {
    id: string;
    noIdentifier: string;
    tanggal: string;
    namaUtama: string;
    status: "Approved" | "Pending" | "Draft";
    // ... field lain
}
```

### Status Styles Record

Selalu buat `statusStyles` record untuk mapping status ke class Tailwind:

```tsx
const statusStyles: Record<NamaData["status"], string> = {
    Approved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    Draft:    "bg-slate-100 text-slate-800",
};
```

### Data

Data mock dideklarasikan sebagai `const namaArray: NamaData[] = [...]` di luar komponen.

---

## 6. Status Badge

Badge status menggunakan pola `inline-flex` dengan rounded-full:

```tsx
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}>
    {item.status}
</span>
```

**Warna status standar:**

| Status | Class |
|---|---|
| Approved / Aktif | `bg-green-100 text-green-800` |
| Pending / Menunggu | `bg-yellow-100 text-yellow-800` |
| Draft | `bg-slate-100 text-slate-800` |
| Rejected / Ditolak | `bg-red-100 text-red-800` |
| In Progress | `bg-blue-100 text-blue-800` |
| Closed / Selesai | `bg-emerald-100 text-emerald-800` |

**Badge di Action Header** (lebih besar, dengan border):
```tsx
<span className="px-2 md:px-3 py-0.5 md:py-1 bg-yellow-100 text-yellow-700 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest border border-yellow-200">
    Draft
</span>
```

---

## 7. Ikon

Selalu gunakan **Material Symbols Outlined** dengan tag `<span>`:

```tsx
<span className="material-symbols-outlined text-lg">nama_ikon</span>
```

**Ukuran ikon:**
| Konteks | Class |
|---|---|
| Action header button | `text-sm` |
| Tombol toolbar | `text-lg` |
| Tombol aksi tabel | `text-base` atau `text-lg` |
| Card header | default (tidak perlu class ukuran) |
| Empty state | `text-5xl text-slate-300` |
| Sidebar action kecil | `!text-sm` |

**Ikon yang sering digunakan:**

| Aksi | Ikon |
|---|---|
| Tambah | `add_circle` |
| Edit / Detail | `edit_square` |
| Hapus | `delete` |
| Cetak | `print` |
| Kembali | `arrow_back` |
| Simpan | `save` |
| Approve | `check_circle` / `verified` |
| Reset | `refresh` |
| Cari | `search` |
| Upload | `upload_file` |
| Filter | *(dihandle MultiFilter)* |
| Lampiran | `attachment` |
| Navigasi halaman | `chevron_left` / `chevron_right` |

---

## 8. Konvensi Responsivitas

Aplikasi menggunakan pendekatan **mobile-first** dengan breakpoint utama `md:` (768px).

### Padding & Spacing
| Area | Mobile | Desktop |
|---|---|---|
| Page body | `p-4` | `md:p-8` |
| Card body | `p-4` | `md:p-6` |
| Action header | `px-4 py-3` | `md:px-6 md:py-4` |
| Tab container | `p-4` | `md:p-6` |

### Bottom Padding Mobile
- Halaman list: `pb-28` (mobile) / `md:pb-8` (desktop) — untuk clearance StatusBar + safe area.
- Halaman detail: `pb-28 md:pb-6`.

### Typography
| Elemen | Mobile | Desktop |
|---|---|---|
| Page title | `text-2xl` | `md:text-3xl` |
| Detail page title | `text-lg` | `md:text-xl` |
| Button text | `text-xs` | `md:text-sm` |
| Tab label | `text-xs` | `md:text-sm` |

### Layout
- Kolom grid form: `grid-cols-1 sm:grid-cols-2` untuk field, `grid-cols-1 lg:grid-cols-3` untuk layout detail.
- Tombol aksi header: `flex-1` pada mobile (full width), `md:flex-none` pada desktop.
- Tombol "Tambah" pada list: `w-full sm:w-auto`.

---

## 9. Konvensi Warna

| Token | Penggunaan |
|---|---|
| `bg-primary` | Tombol utama, link aktif, ikon aksen |
| `text-primary` | Link, border aktif tab, ikon kartu |
| `border-primary/10` | Border tabel, border container |
| `border-primary/5` | Divider baris tabel, border halus |
| `hover:bg-primary/5` | Hover baris tabel |
| `bg-background-light` | Background halaman |
| `text-slate-900` | Teks utama |
| `text-slate-500` | Teks sekunder, label, deskripsi |
| `text-slate-400` | Ikon aksi non-aktif |
| `bg-white` | Background card |
| `bg-slate-50` | Background header tabel, footer pagination, sidebar action |

---

## 10. Checklist Halaman Baru

Sebelum menganggap sebuah halaman selesai, pastikan:

- [ ] Direktif `"use client"` ada di baris pertama
- [ ] Struktur root: `Navbar` → `Sidebar` → `section` → `StatusBar`
- [ ] (List) Title `h2` dengan `font-black tracking-tight`
- [ ] (List) `MultiFilter` dengan `FILTER_FIELDS` yang sesuai
- [ ] (List) Mobile card view **dan** desktop table view keduanya ada
- [ ] (List) Pagination ada di bawah tabel
- [ ] (Detail) Action header dengan back button, status badge, dan tombol aksi
- [ ] (Detail) Tab system dengan minimal tab Header, Order Details, Attachments
- [ ] (Detail) Form menggunakan `FormField` + `FormInput`/`FormSelect`/`FormTextarea`
- [ ] Status badge menggunakan `statusStyles` record
- [ ] Ikon menggunakan `material-symbols-outlined`
- [ ] `pb-28 md:pb-6` atau `pb-28 md:pb-8` pada area scroll utama
- [ ] Semua tipe TypeScript didefinisikan (interface + status union type)
