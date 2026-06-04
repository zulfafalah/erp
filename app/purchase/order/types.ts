// ─── Purchase Order — shared types (used by both API routes and UI pages) ─────

export interface PurchaseOrderListItem {
    poid: number;
    pono: string | null;
    podate: string | null;
    supplierid: number | null;
    supplier_name: string;
    poket1: string | null;
    statuspo: number | null;
    statuspo_display: string;
    pocurr: string | null;
    gtotalpo: string | null;
    treceived_val: string;
    tinvoiced_val: string;
    total_qty_po: number;
    total_qty_received: number;
    total_qty_invoiced: number;
    ispolokal: number | null;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
}

export interface PurchaseOrderDetail {
    poid: number;
    pono: string | null;
    podate: string | null;
    supplierid: number | null;
    supplier_name: string;
    ispolokal: number | null;
    pocurr: string | null;
    porate: string | null;
    potop: number | null;
    tipebiaya: number | null;
    tipebiaya_name: string;
    poket1: string | null;
    poket2: string | null;
    pokontrakno: string | null;
    subtotalpo: string | null;
    discpct: string | null;
    discval: string | null;
    ppnpct: string | null;
    ppnval: string | null;
    gtotalpo: string | null;
    totalkonversipo: string | null;
    totaldppo: string | null;
    totalbayarpo: string | null;
    totalbiaya: string | null;
    totalkarton: string | null;
    totalvolume: string | null;
    totalberat: string | null;
    statuspo: number | null;
    statuspo_display: string;
    sendemailnotif: number;
    viewedby: string | null;
    approvedby: string | null;
    bunitid: number | null;
    po_fpajaknorcv: string | null;
    po_inv_no_supplier: string | null;
    po_sj_no_supplier: string | null;
    po_fpajaktglrcv: string | null;
    treceived_val: string;
    tinvoiced_val: string;
    created: string | null;
    createdby: string | null;
    modified: string | null;
    modifiedby: string | null;
    items: Record<string, unknown>[];
}

export interface PurchaseOrderItemWrite {
    productid: number;
    uomid: number;
    qtypod: string;
    pricepod: string;
    ketbarang?: string;
    kettambahan?: string;
    discpctpod?: string;
    pod_disc_pct_2?: string;
    pod_disc_pct_3?: string;
    pod_disc_pct_4?: string;
    pod_disc_pct_5?: string;
    pod_disc_pct_6?: string;
    pod_ppn_pct?: string;
    estpod?: string | null;
}

export interface PurchaseOrderWrite {
    podate: string;
    supplierid: number;
    ispolokal: number;
    pocurr: string;
    porate?: string;
    potop?: number;
    tipebiaya: number;
    poket1?: string;
    poket2?: string;
    pokontrakno?: string;
    po_inv_no_supplier?: string;
    po_sj_no_supplier?: string;
    po_fpajaknorcv?: string;
    po_fpajaktglrcv?: string | null;
    items?: PurchaseOrderItemWrite[];
}

// ─── Shared form-level types (previously in purchase/request/types.ts) ────────

import { ProductItem } from "@/app/components/ItemTable";

export interface SupplierListItem {
    supplierid: number;
    suppcode: string;
    companyname: string;
}

export interface UnitListItem {
    unitid: number;
    unit: string;
    unitname: string;
}

export interface ExtendedProductItem extends ProductItem {
    productid?: number;
    uomid?: number;
}

export interface ItemDetailForm {
    namaBarang: string;
    productDescription: string;
    uom: string;
    uomid?: number;
    productid?: number;
    qtyOuter: string;
    qtyInner: string;
    uomInnerName: string;
    kuantitas: number;
    hargaDasar: number;
    diskon1Pct: number;
    diskon2Pct: number;
    diskon3Pct: number;
    diskon4Pct: number;
    ppnPct: number;
    additionalNotes: string;
    estpod: string;
}

export const defaultItemForm: ItemDetailForm = {
    namaBarang: "",
    productDescription: "",
    uom: "",
    uomid: undefined,
    productid: undefined,
    qtyOuter: "0",
    qtyInner: "0",
    uomInnerName: "",
    kuantitas: 0,
    hargaDasar: 0,
    diskon1Pct: 0,
    diskon2Pct: 0,
    diskon3Pct: 0,
    diskon4Pct: 0,
    ppnPct: 0,
    additionalNotes: "",
    estpod: "",
};

export type TabKey = "header" | "order-details" | "attachments";
