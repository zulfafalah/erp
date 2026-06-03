import { useState, useEffect } from "react";
import { ItemDetailForm, defaultItemForm, UnitListItem, ExtendedProductItem } from "../types";
import { ProductSearchResult } from "@/app/components/ProductSearchBar";

function applyDiscount(price: number, pct: number) {
    return price - (price * pct) / 100;
}

export function calcItem(form: ItemDetailForm) {
    const setelah1 = applyDiscount(form.hargaDasar, form.diskon1Pct);
    const setelah2 = applyDiscount(setelah1, form.diskon2Pct);
    const setelah3 = applyDiscount(setelah2, form.diskon3Pct);
    const setelah4 = applyDiscount(setelah3, form.diskon4Pct);
    const ppnNominal = (setelah4 * form.ppnPct) / 100;
    const hargaFinal = setelah4 + ppnNominal;
    const jumlah = hargaFinal * form.kuantitas;
    return { setelah1, setelah2, setelah3, setelah4, ppnNominal, hargaFinal, jumlah };
}

export function useItemModal() {
    const [itemForm, setItemForm] = useState<ItemDetailForm>(defaultItemForm);
    const [selectedProductCode, setSelectedProductCode] = useState("");
    const [activeModalTab, setActiveModalTab] = useState<"rincian" | "info">("rincian");
    const [itemPpnChecked, setItemPpnChecked] = useState(true);
    const [itemDiskonPct, setItemDiskonPct] = useState(0);
    const [itemGudang, setItemGudang] = useState("");

    // ── Units (UOM) for modal ─────────────────────────────────────────────────
    const [units, setUnits] = useState<UnitListItem[]>([]);
    const [loadingUnits, setLoadingUnits] = useState(false);

    useEffect(() => {
        setLoadingUnits(true);
        fetch("/api/master-data/units?limit=200")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) {
                    setUnits(json.data);
                }
            })
            .catch((err) => console.error("[units fetch]", err))
            .finally(() => setLoadingUnits(false));
    }, []);

    const calc = calcItem(itemForm);

    const setItemField = <K extends keyof ItemDetailForm>(key: K, val: ItemDetailForm[K]) =>
        setItemForm((f) => ({ ...f, [key]: val }));

    const handleProductSelected = (p: ProductSearchResult) => {
        setItemField("namaBarang", p.productname);
        setItemField("productDescription", p.productname2 ?? "");
        if (p.uom_id_prod) setItemField("uomid", p.uom_id_prod);
        if (p.produnit) setItemField("uom", p.produnit);
        if (p.productid) setItemField("productid", p.productid);
        setItemField("qtyOuter", p.qty_outer ?? "0");
        setItemField("qtyInner", p.qty_inner ?? "0");
        setItemField("uomInnerName", p.uom_inner_outer_name ?? "");
        setSelectedProductCode(p.productcode);
    };

    const resetModalState = () => {
        setItemForm(defaultItemForm);
        setSelectedProductCode("");
        setActiveModalTab("rincian");
        setItemDiskonPct(0);
        setItemGudang("");
        setItemPpnChecked(true);
    };

    const itemDiskonRp = (itemForm.hargaDasar * itemDiskonPct) / 100;
    const itemTotalHarga =
        (itemForm.hargaDasar - itemDiskonRp) * itemForm.kuantitas * (1 + (itemPpnChecked ? 0.11 : 0));

    return {
        itemForm,
        setItemForm,
        setItemField,
        selectedProductCode,
        setSelectedProductCode,
        activeModalTab,
        setActiveModalTab,
        itemPpnChecked,
        setItemPpnChecked,
        itemDiskonPct,
        setItemDiskonPct,
        itemGudang,
        setItemGudang,
        units,
        loadingUnits,
        calc,
        handleProductSelected,
        resetModalState,
        itemDiskonRp,
        itemTotalHarga,
    };
}
