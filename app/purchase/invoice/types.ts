// ─── Purchase Invoice (PIV) — shared types ────────────────────────────────────

export interface PurchaseInvoiceListItem {
    rcvid: number;
    rcvno: string;
    rcvdate: string | null;
    poidh: number;
    supplierid: number | null;
    supplier_name: string;
    currencyid: string;
    rcvwhs: number;
    statusrcv: number | null;
    statusrcv_display: string;
    grandtotalrcv: string | null;
    subtotalrcv: string | null;
    paramst_pch: number;
    fpajaknorcv: string | null;
    fpajaktglrcv: string | null;
    inv_no_supplier: string;
    sj_no_supplier: string;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
}

export interface PurchaseInvoiceDetail {
    rcvid: number;
    rcvno: string;
    rcvdate: string | null;
    poidh: number;
    supplierid: number | null;
    supplier_name: string;
    currencyid: string;
    rcvwhs: number;
    kursbeli: string | null;
    apod: number | null;
    iscashrcv: number | null;
    rcvnote: string | null;
    bunitid: number;
    statusrcv: number | null;
    statusrcv_display: string;
    paramst_pch: number;
    isinvoice: number | null;
    subtotalrcv: string | null;
    discvalrcvh: string | null;
    totalpotongan: string | null;
    rcv_subtotal_after_disc: string | null;
    ppnvalue: string | null;
    grandtotalrcv: string | null;
    tkonversibeli: string | null;
    totalrcvq: string;
    fpajaknorcv: string | null;
    fpajaktglrcv: string | null;
    inv_no_supplier: string;
    sj_no_supplier: string;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
    items: Record<string, unknown>[];
}

export interface PurchaseInvoiceItemWrite {
    rinvoiceid: number;
    poid_d_idf: number;
    productid: number;
    qtyrcv: string;
    uom_idf: number;
    hargadasar: string;
    noteline?: string;
    rcvd_disc_pct_1?: string;
    rcvd_disc_pct_2?: string;
    rcvd_disc_pct_3?: string;
    rcvd_disc_pct_4?: string;
    rcvd_disc_pct_5?: string;
    rcvd_disc_pct_6?: string;
    rcvd_ppn_pct?: string;
    expireddate?: string | null;
}

export interface PurchaseInvoiceWrite {
    rcvdate: string;
    poidh: number;
    supplierid: number;
    currencyid: string;
    rcvwhs: number;
    kursbeli?: string;
    apod?: number;
    iscashrcv?: number;
    rcvnote?: string;
    fpajaknorcv?: string;
    fpajaktglrcv?: string | null;
    inv_no_supplier?: string;
    sj_no_supplier?: string;
    items?: PurchaseInvoiceItemWrite[];
}

// ─── UI-level extended item ───────────────────────────────────────────────────

import { ProductItem } from "@/app/components/ItemTable";

export interface ExtendedInvoiceItem extends ProductItem {
    productid?: number;
    uomid?: number;
    poid_d_idf?: number;
    rinvoiceid?: number;
}

// ─── Tab types ────────────────────────────────────────────────────────────────

export type TabKey = "header" | "invoice-details" | "attachments";

// ─── Item modal form ──────────────────────────────────────────────────────────

export interface ItemDetailForm {
    namaBarang: string;
    keterangan: string;
    uom: string;
    uomid?: number;
    productid?: number;
    poid_d_idf?: number;
    rinvoiceid?: number;
    kuantitas: number;
    hargaDasar: number;
    diskon1Pct: number;
    diskon2Pct: number;
    diskon3Pct: number;
    diskon4Pct: number;
    ppnPct: number;
}

// ─── Dropdown-specific types ──────────────────────────────────────────────────

export interface WarehouseDropdownItem {
    whsid: number;
    whsname: string;
}

export interface PoDropdownItem {
    poid: number;
    pono: string;
}

export interface BpbDropdownItem {
    rcvid: number;
    rcvno: string;
}

export interface CurrencyItem {
    currencyid: string;
    currencyname: string;
}

export interface SupplierListItem {
    supplierid: number;
    companyname: string;
}

export const defaultItemForm: ItemDetailForm = {
    namaBarang: "",
    keterangan: "",
    uom: "",
    uomid: undefined,
    productid: undefined,
    poid_d_idf: undefined,
    rinvoiceid: undefined,
    kuantitas: 0,
    hargaDasar: 0,
    diskon1Pct: 0,
    diskon2Pct: 0,
    diskon3Pct: 0,
    diskon4Pct: 0,
    ppnPct: 0,
};
