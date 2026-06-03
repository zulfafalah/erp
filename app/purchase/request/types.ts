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

export type TabKey = "header" | "request-details" | "attachments";
