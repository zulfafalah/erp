---
name: erp-page-conventions
description: Konvensi dan aturan desain untuk semua halaman ERP - struktur layout, pola halaman list, pola halaman detail/form, penggunaan komponen, responsivitas, warna, dan ikon. Gunakan skill ini setiap kali membuat atau memodifikasi halaman dalam aplikasi ERP.
user-invocable: true
---

# ERP Page Conventions

Terapkan aturan berikut setiap kali membuat atau memodifikasi halaman dalam aplikasi ERP ini agar semua halaman tampil seragam dan konsisten.

## Aturan Utama

Baca [page-conventions.md](./page-conventions.md) untuk panduan lengkap meliputi:

- **Struktur Layout** — wrapper root, Navbar, Sidebar, StatusBar
- **Halaman List** — judul & tombol aksi, MultiFilter, tabel dual-mode (mobile card / desktop table), pagination
- **Halaman Detail / Form** — action header (back button, status badge, action buttons), sistem tab, form card, ringkasan biaya sidebar
- **Komponen Shared** — FormField, FormInput, FormSelect, FormTextarea, ItemTable, MultiFilter
- **Status Badge** — warna per status (Approved, Pending, Draft, dll.)
- **Ikon** — penggunaan Material Symbols Outlined
- **Responsivitas** — pola mobile-first dengan breakpoint `md:`
- **Konvensi TypeScript** — interface, tipe status, FILTER_FIELDS
