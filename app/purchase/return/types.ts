// ─── Return Purchase Order — shared types ─────────────────────────────────────
// Based on OpenAPI: /api/v1/return-purchase-orders/

export interface ReturnPOListItem {
    rcvid: number;
    rcvno: string;
    rcvdate: string | null;
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
    inv_no_supplier: string;
    sj_no_supplier: string;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
    total_qty_returned: number;
}

export interface ReturnPODetail {
    rcvid: number;
    rcvno: string;
    rcvdate: string | null;
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
    bdp_refid: number;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
    items: Record<string, unknown>[];
}

export interface ReturnPOItemWrite {
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

export interface ReturnPOWrite {
    rcvdate: string;
    supplierid: number;
    currencyid: string;
    rcvwhs: number;
    kursbeli?: string;
    iscashrcv?: number;
    apod?: number;
    isstockawal?: number;
    rcvnote?: string;
    fpajaknorcv?: string;
    fpajaktglrcv?: string | null;
    inv_no_supplier?: string;
    sj_no_supplier?: string;
    bdp_refid?: number;
    items?: ReturnPOItemWrite[];
}

// ─── UI-level types ───────────────────────────────────────────────────────────

import { ProductItem } from "@/app/components/ItemTable";

export interface ExtendedReturnItem extends ProductItem {
    productid?: number;
    uomid?: number;
    expireddate?: string;
}

export type TabKey = "header" | "return-details" | "attachments";

export interface ItemDetailForm {
    namaBarang: string;
    keterangan: string;
    uom: string;
    uomid?: number;
    productid?: number;
    kuantitas: number;
    hargaDasar: number;
    diskon1Pct: number;
    diskon2Pct: number;
    diskon3Pct: number;
    diskon4Pct: number;
    ppnPct: number;
    tglKadaluarsa: string;
}

export const defaultItemForm: ItemDetailForm = {
    namaBarang: "",
    keterangan: "",
    uom: "",
    uomid: undefined,
    productid: undefined,
    kuantitas: 0,
    hargaDasar: 0,
    diskon1Pct: 0,
    diskon2Pct: 0,
    diskon3Pct: 0,
    diskon4Pct: 0,
    ppnPct: 0,
    tglKadaluarsa: "",
};

// ─── Dropdown types ───────────────────────────────────────────────────────────

export interface WarehouseDropdownItem {
    whsid: number;
    whsname: string;
}

export interface CurrencyItem {
    currencyid: string;
    currencyname: string;
}
