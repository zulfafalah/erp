export interface MenuItem {
    label: string;
    icon: string;
    href: string;
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

export interface ModuleConfig {
    key: string;
    label: string;
    icon: string;
    href: string;
    sidebarSections: MenuSection[];
}

export const modules: ModuleConfig[] = [
    {
        key: "pembelian",
        label: "Pembelian",
        icon: "shopping_cart",
        href: "/purchase/order",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Pemasok", icon: "local_shipping", href: "/master-data/supplier" },
                ],
            },
            {
                title: "Transaksi Pembelian",
                items: [
                    { label: "Permintaan", icon: "assignment", href: "/purchase/request" },
                    { label: "Pesanan Pembelian", icon: "shopping_cart", href: "/purchase/order" },
                    { label: "Penerimaan", icon: "inventory_2", href: "/purchase/receipt" },
                    { label: "Faktur Pembelian", icon: "receipt_long", href: "/purchase/invoice" },
                    { label: "Retur Pembelian", icon: "assignment_return", href: "/purchase/return" },
                ],
            },
        ],
    },
    {
        key: "penjualan",
        label: "Penjualan",
        icon: "storefront",
        href: "/sales/order",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Outlet", icon: "store", href: "/master-data/outlet" },
                    { label: "Negara", icon: "public", href: "/master-data/country" },
                    { label: "Kota", icon: "location_city", href: "/master-data/city" },
                    { label: "Wilayah", icon: "map", href: "/master-data/region" },
                    { label: "Harga Barang", icon: "sell", href: "#" },
                    { label: "Penjual", icon: "badge", href: "/master-data/seller" },
                    { label: "Pelanggan", icon: "group", href: "/master-data/customer" },
                ],
            },
            {
                title: "Transaksi Penjualan",
                items: [
                    { label: "Pesanan Penjualan", icon: "shopping_bag", href: "/sales/order" },
                    { label: "Faktur Penjualan", icon: "receipt", href: "/sales/invoice" },
                    { label: "Retur Penjualan", icon: "assignment_return", href: "/sales/return" },
                ],
            },
            {
                title: "Penjualan Sample",
                items: [
                    { label: "Pesanan Sample", icon: "science", href: "#" },
                    { label: "Penjualan Sample", icon: "lab_profile", href: "#" },
                ],
            },
            {
                title: "Penjualan Reject",
                items: [
                    { label: "Pesanan Reject", icon: "remove_shopping_cart", href: "#" },
                    { label: "Penjualan Reject", icon: "cancel", href: "#" },
                ],
            },
            {
                title: "Lainnya",
                items: [
                    { label: "Komisi Penjualan", icon: "payments", href: "/sales/commission" },
                ],
            },
        ],
    },
    {
        key: "persediaan",
        label: "Persediaan Barang",
        icon: "inventory_2",
        href: "#",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Grup Produk", icon: "category", href: "/master-data/product-category" },
                    { label: "Produk", icon: "inventory", href: "/master-data/product" },
                    { label: "Gudang", icon: "warehouse", href: "/master-data/warehouse" },
                ],
            },
            {
                title: "Persediaan",
                items: [
                    { label: "Alasan Penyesuaian", icon: "edit_note", href: "/master-data/adjustment-reason" },
                    { label: "Penyesuaian Stok", icon: "tune", href: "/inventory/adjustment" },
                ],
            },
            {
                title: "Perpindahan Gudang",
                items: [
                    { label: "Transfer Gudang (Kirim)", icon: "local_shipping", href: "/inventory/stock-transfer-outbound" },
                    { label: "Transfer Gudang (Terima)", icon: "move_to_inbox", href: "/inventory/stock-transfer-inbound" },
                ],
            },
        ],
    },
    {
        key: "keuangan",
        label: "Keuangan",
        icon: "account_balance_wallet",
        href: "#",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Mata Uang", icon: "currency_exchange", href: "/master-data/currency" },
                ],
            },
            {
                title: "Hutang (AP)",
                items: [
                    { label: "Saldo Awal Hutang", icon: "account_balance", href: "/finance/accounts-payable/opening-balance" },
                    { label: "Debit Memo", icon: "description", href: "/finance/accounts-payable/debit-memo" },
                    { label: "Pembayaran Pemasok", icon: "payments", href: "/finance/accounts-payable/vendor-payments" },
                    { label: "Alokasi Pembayaran Hutang", icon: "assignment", href: "/finance/accounts-payable/payment-allocation" },
                ],
            },
            {
                title: "Piutang (AR)",
                items: [
                    { label: "Saldo Awal Piutang", icon: "account_balance_wallet", href: "/finance/accounts-receivable/opening-balance" },
                    { label: "Credit Memo", icon: "note_add", href: "/finance/accounts-receivable/credit-memo" },
                    { label: "Penerimaan Pembayaran", icon: "point_of_sale", href: "/finance/accounts-receivable/customer-receipts" },
                    { label: "Alokasi Penerimaan", icon: "assignment_turned_in", href: "/finance/accounts-receivable/payment-allocation" },
                ],
            },
            {
                title: "Komisi",
                items: [
                    { label: "Pembayaran Komisi", icon: "paid", href: "/finance/sales-commissions" },
                ],
            },
        ],
    },
    {
        key: "akunting",
        label: "Akunting",
        icon: "receipt_long",
        href: "#",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Mata Uang", icon: "currency_exchange", href: "/master-data/currency" },
                    { label: "Chart of Accounts", icon: "account_tree", href: "/accounting/chart-of-accounts" },
                ],
            },
            {
                title: "Saldo Awal",
                items: [
                    { label: "Saldo Awal Bulanan", icon: "calendar_month", href: "/accounting/monthly-opening-balance" },
                    { label: "Saldo Awal Tahunan", icon: "event_note", href: "/accounting/yearly-opening-balance" },
                ],
            },
            {
                title: "Jurnal",
                items: [
                    { label: "Jurnal Umum", icon: "menu_book", href: "/accounting/general-journal" },
                    { label: "Jurnal Transaksi", icon: "receipt", href: "/accounting/transaction-journal" },
                ],
            },
            {
                title: "Kas & Permintaan Dana",
                items: [
                    { label: "Permintaan Dana", icon: "request_quote", href: "/accounting/fund-request" },
                ],
            },
            {
                title: "Posting",
                items: [
                    { label: "Posting Bulanan", icon: "publish", href: "/accounting/monthly-posting" },
                ],
            },
        ],
    },
    {
        key: "laporan",
        label: "Laporan",
        icon: "bar_chart",
        href: "#",
        sidebarSections: [
            {
                title: "Pembelian",
                items: [
                    { label: "Detil Nota Pembelian (PIV)", icon: "receipt_long", href: "/reports/purchase?report=purchase-invoice-detail" },
                    { label: "Rekap Nota Pembelian (PIV)", icon: "summarize", href: "/reports/purchase?report=purchase-invoice-summary" },
                    { label: "Detil Retur Pembelian", icon: "assignment_return", href: "/reports/purchase?report=purchase-return-detail" },
                    { label: "Rekap Retur Pembelian", icon: "undo", href: "/reports/purchase?report=purchase-return-summary" },
                    { label: "Rekap Pesanan Pembelian (POB)", icon: "shopping_cart", href: "/reports/purchase?report=purchase-order-summary" },
                    { label: "Rekap Penerimaan Barang (BPB)", icon: "inventory_2", href: "/reports/purchase?report=goods-receipt-summary" },
                    { label: "Detil Penerimaan Barang (BPB)", icon: "fact_check", href: "/reports/purchase?report=goods-receipt-detail" },
                ],
            },
            {
                title: "Penjualan",
                items: [
                    { label: "Detil Penjualan", icon: "receipt", href: "#" },
                    { label: "Rekap Penjualan", icon: "bar_chart", href: "#" },
                    { label: "Detil Retur Penjualan", icon: "assignment_return", href: "#" },
                    { label: "Rekap Retur Penjualan", icon: "undo", href: "#" },
                    { label: "Rekap Pesanan Penjualan", icon: "shopping_bag", href: "#" },
                ],
            },
            {
                title: "Hutang",
                items: [
                    { label: "Detil Hutang", icon: "money_off", href: "#" },
                    { label: "Rekap Hutang", icon: "account_balance", href: "#" },
                ],
            },
            {
                title: "Piutang",
                items: [
                    { label: "Detil Piutang", icon: "request_quote", href: "#" },
                    { label: "Rekap Piutang", icon: "account_balance_wallet", href: "#" },
                    { label: "Umur Piutang", icon: "hourglass_top", href: "#" },
                ],
            },
            {
                title: "Persediaan",
                items: [
                    { label: "Kartu Stok", icon: "style", href: "#" },
                    { label: "Rekap Stok", icon: "inventory", href: "#" },
                    { label: "Rekap Transaksi Stok", icon: "swap_horiz", href: "#" },
                    { label: "Mutasi Stok", icon: "compare_arrows", href: "#" },
                    { label: "Daftar Harga Jual", icon: "sell", href: "#" },
                ],
            },
            {
                title: "Keuangan",
                items: [
                    { label: "Alokasi Deposit Pelanggan", icon: "savings", href: "#" },
                    { label: "Alokasi Deposit Pemasok", icon: "paid", href: "#" },
                ],
            },
            {
                title: "Akuntansi",
                items: [
                    { label: "Buku Besar", icon: "menu_book", href: "#" },
                    { label: "Jurnal Harian", icon: "today", href: "#" },
                    { label: "Jurnal Umum", icon: "auto_stories", href: "#" },
                    { label: "Daftar Akun", icon: "account_tree", href: "#" },
                    { label: "Laba Rugi Perpetual", icon: "trending_up", href: "#" },
                    { label: "Laba Rugi Harian", icon: "show_chart", href: "#" },
                    { label: "Neraca", icon: "balance", href: "#" },
                    { label: "Neraca Saldo Bulanan", icon: "calendar_month", href: "#" },
                    { label: "Neraca Saldo 3 Bulan", icon: "date_range", href: "#" },
                ],
            },
            {
                title: "Utilitas",
                items: [
                    { label: "Katalog Barcode", icon: "qr_code_scanner", href: "#" },
                    { label: "Log Sistem", icon: "terminal", href: "#" },
                ],
            },
        ],
    },
    {
        key: "pengaturan",
        label: "Pengaturan",
        icon: "settings",
        href: "#",
        sidebarSections: [
            {
                title: "Sistem",
                items: [
                    { label: "Pengaturan Program", icon: "tune", href: "/settings/system" },
                ],
            },
            {
                title: "Pengguna",
                items: [
                    { label: "Pengguna", icon: "person", href: "/settings/user-settings" },
                    { label: "Grup Pengguna", icon: "group", href: "/settings/user-group-settings" },
                    { label: "Hak Akses Grup", icon: "admin_panel_settings", href: "/settings/user-group-permissions" },
                ],
            },
            {
                title: "Data Sistem",
                items: [
                    { label: "Data Outlet", icon: "store", href: "/master-data/outlet" },
                    { label: "Daftar Form", icon: "list_alt", href: "/settings/form-management" },
                ],
            },
            {
                title: "Lainnya",
                items: [
                    { label: "Tentang E-Smart", icon: "info", href: "/settings/about" },
                ],
            },
        ],
    },
];

export function getModuleByKey(key: string): ModuleConfig | undefined {
    return modules.find((m) => m.key === key);
}

export function getModuleByPath(currentFullPath: string): ModuleConfig | undefined {
    const [pathname] = currentFullPath.split('?');

    const matchesPath = (href: string) => {
        if (href === "#") return false;
        if (currentFullPath === href) return true;
        if (pathname === href && !href.includes("?")) return true;
        return pathname.startsWith(href + "/") || (pathname.startsWith(href + "?") && !href.includes("?"));
    };

    // Check module-level href first
    const byHref = modules.find((m) => matchesPath(m.href));
    if (byHref) return byHref;

    // Then check all sidebar items for a matching href
    return modules.find((m) =>
        m.sidebarSections.some((section) =>
            section.items.some((item) => matchesPath(item.href))
        )
    );
}
