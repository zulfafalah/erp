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
        href: "/purchase-order",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Pemasok", icon: "local_shipping", href: "#" },
                ],
            },
            {
                title: "Transaksi Pembelian",
                items: [
                    { label: "Permintaan", icon: "assignment", href: "#" },
                    { label: "Pesanan Pembelian", icon: "shopping_cart", href: "/purchase-order" },
                    { label: "Penerimaan", icon: "inventory_2", href: "#" },
                    { label: "Faktur Pembelian", icon: "receipt_long", href: "#" },
                    { label: "Retur Pembelian", icon: "assignment_return", href: "#" },
                ],
            },
        ],
    },
    {
        key: "penjualan",
        label: "Penjualan",
        icon: "storefront",
        href: "/sales",
        sidebarSections: [
            {
                title: "Master",
                items: [
                    { label: "Negara", icon: "public", href: "#" },
                    { label: "Kota", icon: "location_city", href: "#" },
                    { label: "Wilayah", icon: "map", href: "#" },
                    { label: "Harga Barang", icon: "sell", href: "#" },
                    { label: "Penjual", icon: "badge", href: "#" },
                    { label: "Pelanggan", icon: "group", href: "#" },
                ],
            },
            {
                title: "Transaksi Penjualan",
                items: [
                    { label: "Pesanan Penjualan", icon: "shopping_bag", href: "/sales" },
                    { label: "Faktur Penjualan", icon: "receipt", href: "#" },
                    { label: "Retur Penjualan", icon: "assignment_return", href: "#" },
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
                    { label: "Komisi Penjualan", icon: "payments", href: "#" },
                ],
            },
        ],
    },
    {
        key: "persediaan",
        label: "Persediaan Barang",
        icon: "inventory_2",
        href: "#",
        sidebarSections: [],
    },
    {
        key: "keuangan",
        label: "Keuangan",
        icon: "account_balance_wallet",
        href: "#",
        sidebarSections: [],
    },
    {
        key: "akunting",
        label: "Akunting",
        icon: "receipt_long",
        href: "#",
        sidebarSections: [],
    },
    {
        key: "laporan",
        label: "Laporan",
        icon: "bar_chart",
        href: "#",
        sidebarSections: [],
    },
    {
        key: "pengaturan",
        label: "Pengaturan",
        icon: "settings",
        href: "#",
        sidebarSections: [],
    },
];

export function getModuleByKey(key: string): ModuleConfig | undefined {
    return modules.find((m) => m.key === key);
}

export function getModuleByPath(pathname: string): ModuleConfig | undefined {
    return modules.find(
        (m) => m.href !== "#" && pathname.startsWith(m.href)
    );
}
