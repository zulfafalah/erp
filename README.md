# ERP Falah

Sistem **Enterprise Resource Planning (ERP)** berbasis web yang dibangun menggunakan [Next.js](https://nextjs.org), TypeScript, dan Tailwind CSS. Aplikasi ini mencakup modul-modul bisnis utama mulai dari pembelian, penjualan, inventaris, akuntansi, hingga keuangan.

## Teknologi

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com)
- **Bahasa**: TypeScript
- **Ikon**: Material Symbols Outlined

## Modul

### 🛒 Purchase (Pembelian)
- **Order** — Purchase Order ke supplier
- **Request** — Purchase Request internal
- **Receipt** — Penerimaan barang
- **Invoice** — Faktur pembelian
- **Return** — Retur pembelian

### 💰 Sales (Penjualan)
- **Order** — Sales Order ke pelanggan
- **Commission** — Komisi penjualan
- **Invoice** — Faktur penjualan
- **Return** — Retur penjualan

### 📦 Inventory (Inventaris)
- **Adjustment** — Penyesuaian stok
- **Stock Transfer Inbound** — Transfer stok masuk
- **Stock Transfer Outbound** — Transfer stok keluar

### 📒 Accounting (Akuntansi)
- **Chart of Accounts** — Daftar akun
- **General Journal** — Jurnal umum
- **Transaction Journal** — Jurnal transaksi
- **Monthly Posting** — Posting bulanan
- **Monthly Opening Balance** — Saldo awal bulanan
- **Yearly Opening Balance** — Saldo awal tahunan
- **Fund Request** — Permintaan dana

### 💳 Finance (Keuangan)
- **Accounts Payable** — Hutang usaha
- **Accounts Receivable** — Piutang usaha
- **Sales Commissions** — Komisi penjualan

### 🗂️ Master Data
- **Product & Product Category** — Produk dan kategori
- **Customer** — Data pelanggan
- **Supplier** — Data supplier
- **Seller** — Data penjual
- **Warehouse** — Data gudang
- **Currency** — Mata uang
- **Country, City, Region** — Lokasi
- **Adjustment Reason** — Alasan penyesuaian

## Menjalankan Proyek

Install dependensi:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Halaman akan otomatis diarahkan ke modul Purchase Order.

## Scripts

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint |
