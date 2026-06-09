import { useState, useEffect, useCallback } from "react";
import {
    ReturnPODetail,
    ExtendedReturnItem,
    defaultItemForm,
    ItemDetailForm,
    WarehouseDropdownItem,
    CurrencyItem,
} from "../types";
import { SupplierListItem } from "@/app/purchase/order/types";

interface UseReturnFormProps {
    productItems: ExtendedReturnItem[];
    setProductItems: React.Dispatch<React.SetStateAction<ExtendedReturnItem[]>>;
    router: ReturnType<typeof import("next/navigation").useRouter>;
    id: string; // "new" or the actual rcvid as string
}

export function useReturnForm({ productItems, setProductItems, router, id }: UseReturnFormProps) {
    const isNew = id === "new";
    const today = new Date().toISOString().split("T")[0];

    // ── Header form state ─────────────────────────────────────────────────────
    const [rcvdate, setRcvdate]               = useState(today);
    const [supplierIdForm, setSupplierIdForm] = useState<number | "">("");
    const [currencyid, setCurrencyid]         = useState("RP");
    const [rcvwhs, setRcvwhs]                 = useState<number | "">("");
    const [kursbeli, setKursbeli]             = useState("1.0000");
    const [iscashrcv, setIscashrcv]           = useState(0);
    const [apod, setApod]                     = useState(0);
    const [rcvnote, setRcvnote]               = useState("");
    const [fpajaknorcv, setFpajaknorcv]       = useState("");
    const [fpajaktglrcv, setFpajaktglrcv]     = useState("");
    const [invNoSupplier, setInvNoSupplier]   = useState("");
    const [sjNoSupplier, setSjNoSupplier]     = useState("");

    // ── Save / API state ──────────────────────────────────────────────────────
    const [isSaving, setIsSaving]             = useState(false);
    const [supplierError, setSupplierError]   = useState<string | null>(null);
    const [rcvwhsError, setRcvwhsError]       = useState<string | null>(null);
    const [itemsError, setItemsError]         = useState<string | null>(null);
    const [itemDetailErrors, setItemDetailErrors] = useState<string[]>([]);
    const [apiError, setApiError]             = useState<string | null>(null);

    // ── Detail fetch (edit mode) ──────────────────────────────────────────────
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailLoadError, setDetailLoadError] = useState<string | null>(null);
    const [rcvDetail, setRcvDetail]             = useState<ReturnPODetail | null>(null);

    const populateFromDetail = useCallback((detail: ReturnPODetail) => {
        setRcvDetail(detail);
        if (detail.rcvdate)            setRcvdate(detail.rcvdate);
        if (detail.supplierid != null) setSupplierIdForm(detail.supplierid);
        if (detail.currencyid)         setCurrencyid(detail.currencyid);
        if (detail.rcvwhs)             setRcvwhs(detail.rcvwhs);
        if (detail.kursbeli)           setKursbeli(detail.kursbeli);
        setIscashrcv(detail.iscashrcv ?? 0);
        setApod(detail.apod ?? 0);
        setRcvnote(detail.rcvnote ?? "");
        setFpajaknorcv(detail.fpajaknorcv ?? "");
        setFpajaktglrcv(detail.fpajaktglrcv ?? "");
        setInvNoSupplier(detail.inv_no_supplier ?? "");
        setSjNoSupplier(detail.sj_no_supplier ?? "");

        // Map API items → ExtendedReturnItem[]
        if (Array.isArray(detail.items) && detail.items.length > 0) {
            const mapped: ExtendedReturnItem[] = detail.items.map((it: Record<string, unknown>) => {
                const hargaDasar = parseFloat(String(it.hargadasar      ?? "0")) || 0;
                const qty        = parseFloat(String(it.qtyrcv           ?? "0")) || 0;
                const disc1Pct   = parseFloat(String(it.rcvd_disc_pct_1 ?? "0")) || 0;
                const disc2Pct   = parseFloat(String(it.rcvd_disc_pct_2 ?? "0")) || 0;
                const disc3Pct   = parseFloat(String(it.rcvd_disc_pct_3 ?? "0")) || 0;
                const disc4Pct   = parseFloat(String(it.rcvd_disc_pct_4 ?? "0")) || 0;
                const ppnPct     = parseFloat(String(it.rcvd_ppn_pct    ?? "0")) || 0;

                const a1 = hargaDasar * (1 - disc1Pct / 100);
                const a2 = a1         * (1 - disc2Pct / 100);
                const a3 = a2         * (1 - disc3Pct / 100);
                const afterDisc  = a3 * (1 - disc4Pct / 100);
                const discVal    = hargaDasar - afterDisc;
                const ppnVal     = afterDisc * (ppnPct / 100);
                const hargaFinal = afterDisc + ppnVal;

                return {
                    name:        String(it.productname ?? it.ketbarang ?? ""),
                    barcode:     String(it.productcode ?? ""),
                    uom:         String(it.uomname ?? it.uom ?? ""),
                    qty,
                    hargaDasar,
                    discount:    discVal,
                    ppn:         ppnVal,
                    hargaFinal,
                    jumlah:      hargaFinal * qty,
                    productid:   typeof it.productid === "number" ? it.productid  : undefined,
                    uomid:       typeof it.uom_idf   === "number" ? it.uom_idf    : undefined,
                    expireddate: it.expireddate ? String(it.expireddate) : undefined,
                };
            });
            setProductItems(mapped);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isNew) return;
        setIsLoadingDetail(true);
        setDetailLoadError(null);
        fetch(`/api/purchase/returns/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && json.data) {
                    populateFromDetail(json.data as ReturnPODetail);
                } else {
                    setDetailLoadError(json.message ?? "Gagal memuat data retur pembelian.");
                }
            })
            .catch(() => setDetailLoadError("Terjadi kesalahan jaringan saat memuat data."))
            .finally(() => setIsLoadingDetail(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ── Warehouses ────────────────────────────────────────────────────────────
    const [warehouses, setWarehouses]               = useState<WarehouseDropdownItem[]>([]);
    const [loadingWarehouses, setLoadingWarehouses] = useState(false);

    useEffect(() => {
        setLoadingWarehouses(true);
        fetch("/api/master-data/warehouses?limit=200")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) {
                    setWarehouses(
                        json.data.map((w: { whsid: number; whsname: string }) => ({
                            whsid: w.whsid,
                            whsname: w.whsname,
                        }))
                    );
                }
            })
            .catch((err) => console.error("[warehouses fetch]", err))
            .finally(() => setLoadingWarehouses(false));
    }, []);

    // ── Currencies ────────────────────────────────────────────────────────────
    const [currencies, setCurrencies]               = useState<CurrencyItem[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(false);

    useEffect(() => {
        setLoadingCurrencies(true);
        fetch("/api/master-data/currencies")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) setCurrencies(json.data);
            })
            .catch((err) => console.error("[currencies fetch]", err))
            .finally(() => setLoadingCurrencies(false));
    }, []);

    // ── Suppliers ─────────────────────────────────────────────────────────────
    const [suppliers, setSuppliers]               = useState<SupplierListItem[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    useEffect(() => {
        setLoadingSuppliers(true);
        const qs = isNew ? "?limit=500&isactive=1&ordering=companyname" : "?limit=500&ordering=companyname";
        fetch(`/api/master-data/suppliers${qs}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) setSuppliers(json.data);
            })
            .catch((err) => console.error("[suppliers fetch]", err))
            .finally(() => setLoadingSuppliers(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNew]);

    // ── Handle Save ───────────────────────────────────────────────────────────
    const handleSave = async () => {
        setSupplierError(null);
        setRcvwhsError(null);
        setItemsError(null);
        setItemDetailErrors([]);
        setApiError(null);

        if (!supplierIdForm) {
            setSupplierError("Pilih pemasok terlebih dahulu.");
            return;
        }
        if (!rcvwhs) {
            setRcvwhsError("Pilih gudang asal retur.");
            return;
        }
        if (productItems.length === 0) {
            setItemsError("Tambahkan minimal satu item barang.");
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                rcvdate,
                supplierid: supplierIdForm as number,
                currencyid,
                rcvwhs: rcvwhs as number,
                kursbeli,
                iscashrcv,
                apod,
                rcvnote,
                fpajaknorcv,
                fpajaktglrcv: fpajaktglrcv || null,
                inv_no_supplier: invNoSupplier,
                sj_no_supplier: sjNoSupplier,
                bdp_refid: 0,
                items: productItems.map((item) => ({
                    productid:  item.productid ?? 0,
                    qtyrcv:     String(item.qty.toFixed(4)),
                    uom_idf:    item.uomid ?? 0,
                    hargadasar: String(item.hargaDasar.toFixed(4)),
                    noteline:   "",
                    rcvd_disc_pct_1: item.discount > 0 && item.hargaDasar > 0
                        ? String(((item.discount / item.hargaDasar) * 100).toFixed(4))
                        : "0.0000",
                    rcvd_disc_pct_2: "0.0000",
                    rcvd_disc_pct_3: "0.0000",
                    rcvd_disc_pct_4: "0.0000",
                    rcvd_disc_pct_5: "0.0000",
                    rcvd_disc_pct_6: "0.0000",
                    rcvd_ppn_pct: item.ppn > 0 && item.hargaFinal > 0
                        ? String(((item.ppn / (item.hargaFinal - item.ppn)) * 100).toFixed(4))
                        : "0.0000",
                    expireddate: item.expireddate || null,
                })),
            };

            const res = isNew
                ? await fetch("/api/purchase/returns", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                : await fetch(`/api/purchase/returns/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                const detail = json.detail as Record<string, unknown> | undefined;
                if (detail) {
                    const supplierErrs = detail["supplierid"] as string[] | undefined;
                    if (Array.isArray(supplierErrs) && supplierErrs.length > 0) {
                        setSupplierError(supplierErrs[0]);
                    }
                    const itemsDetailArr = detail["items"] as Record<string, string[]>[] | undefined;
                    if (Array.isArray(itemsDetailArr)) {
                        const fieldLabels: Record<string, string> = {
                            qtyrcv:      "Kuantitas",
                            hargadasar:  "Harga Dasar",
                            productid:   "Produk",
                            uom_idf:     "Satuan",
                            rcvd_ppn_pct: "PPN",
                        };
                        const msgs: string[] = [];
                        itemsDetailArr.forEach((itemErr, idx) => {
                            Object.entries(itemErr).forEach(([field, errs]) => {
                                const label = fieldLabels[field] ?? field;
                                (errs as string[]).forEach((msg) => {
                                    msgs.push(`Item ${idx + 1} — ${label}: ${msg}`);
                                });
                            });
                        });
                        if (msgs.length > 0) setItemDetailErrors(msgs);
                    }
                    const hasFieldErrors =
                        (Array.isArray(supplierErrs) && supplierErrs.length > 0) ||
                        (Array.isArray(itemsDetailArr) && itemsDetailArr.some((e) => Object.keys(e).length > 0));
                    if (!hasFieldErrors) {
                        setApiError(json.message ?? "Gagal menyimpan. Silakan coba lagi.");
                    }
                } else {
                    setApiError(json.message ?? "Gagal menyimpan. Silakan coba lagi.");
                }
                return;
            }

            if (isNew) {
                const newId = json.data?.rcvid ?? "new";
                router.push(`/purchase/return/${newId}`);
            } else {
                populateFromDetail(json.data as ReturnPODetail);
            }
        } catch (err) {
            console.error("[handleSave return]", err);
            setApiError("Terjadi kesalahan jaringan. Silakan coba lagi.");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Item modal helpers ────────────────────────────────────────────────────
    const [itemForm, setItemFormState] = useState<ItemDetailForm>(defaultItemForm);
    const setItemField = <K extends keyof ItemDetailForm>(key: K, val: ItemDetailForm[K]) =>
        setItemFormState((f) => ({ ...f, [key]: val }));
    const resetItemForm = () => setItemFormState(defaultItemForm);

    return {
        isNew,
        rcvDetail,
        isLoadingDetail,
        detailLoadError,
        // header fields
        rcvdate,    setRcvdate,
        supplierIdForm, setSupplierIdForm,
        currencyid, setCurrencyid,
        rcvwhs,     setRcvwhs,
        kursbeli,   setKursbeli,
        iscashrcv,  setIscashrcv,
        apod,       setApod,
        rcvnote,    setRcvnote,
        fpajaknorcv,  setFpajaknorcv,
        fpajaktglrcv, setFpajaktglrcv,
        invNoSupplier, setInvNoSupplier,
        sjNoSupplier,  setSjNoSupplier,
        // save
        isSaving,
        supplierError, clearSupplierError: () => setSupplierError(null),
        rcvwhsError,   clearRcvwhsError:   () => setRcvwhsError(null),
        itemsError,
        itemDetailErrors,
        apiError,
        handleSave,
        // dropdowns
        suppliers,     loadingSuppliers,
        warehouses,    loadingWarehouses,
        currencies,    loadingCurrencies,
        // item modal
        itemForm,
        setItemField,
        resetItemForm,
    };
}

// ─── Item calculation hook ────────────────────────────────────────────────────

function applyDiscount(price: number, pct: number) {
    return price - (price * pct) / 100;
}

export function useItemCalc(form: ItemDetailForm) {
    const setelah1   = applyDiscount(form.hargaDasar, form.diskon1Pct);
    const setelah2   = applyDiscount(setelah1,        form.diskon2Pct);
    const setelah3   = applyDiscount(setelah2,        form.diskon3Pct);
    const setelah4   = applyDiscount(setelah3,        form.diskon4Pct);
    const ppnNominal = (setelah4 * form.ppnPct) / 100;
    const hargaFinal = setelah4 + ppnNominal;
    const jumlah     = hargaFinal * form.kuantitas;
    return { setelah1, setelah2, setelah3, setelah4, ppnNominal, hargaFinal, jumlah };
}
