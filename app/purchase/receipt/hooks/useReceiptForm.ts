import { useState, useEffect, useCallback } from "react";
import {
    GoodsReceivingDetail,
    ExtendedReceiptItem,
    defaultItemForm,
    ItemDetailForm,
    WarehouseDropdownItem,
    PoDropdownItem,
    CurrencyItem,
} from "../types";
import { SupplierListItem } from "@/app/purchase/order/types";

interface UseReceiptFormProps {
    productItems: ExtendedReceiptItem[];
    setProductItems: React.Dispatch<React.SetStateAction<ExtendedReceiptItem[]>>;
    router: any;
    id: string; // "new" or the actual rcvid as string
}

export function useReceiptForm({ productItems, setProductItems, router, id }: UseReceiptFormProps) {
    const isNew = id === "new";
    const today = new Date().toISOString().split("T")[0];

    // ── Header form state ─────────────────────────────────────────────────────
    const [rcvdate, setRcvdate]         = useState(today);
    const [poidh, setPoidh]             = useState<number | "">("");
    const [supplierIdForm, setSupplierIdForm] = useState<number | "">("");
    const [currencyid, setCurrencyid]   = useState("RP");
    const [rcvwhs, setRcvwhs]           = useState<number | "">("");
    const [kursbeli, setKursbeli]       = useState("1.0000");
    const [apod, setApod]               = useState(0);
    const [iscashrcv, setIscashrcv]     = useState(0);
    const [rcvnote, setRcvnote]         = useState("");
    const [fpajaknorcv, setFpajaknorcv] = useState("");
    const [fpajaktglrcv, setFpajaktglrcv] = useState("");
    const [invNoSupplier, setInvNoSupplier] = useState("");
    const [sjNoSupplier, setSjNoSupplier]   = useState("");

    // ── Save / API state ──────────────────────────────────────────────────────
    const [isSaving, setIsSaving]             = useState(false);
    const [supplierError, setSupplierError]   = useState<string | null>(null);
    const [poidhError, setPoidhError]         = useState<string | null>(null);
    const [rcvwhsError, setRcvwhsError]       = useState<string | null>(null);
    const [itemsError, setItemsError]         = useState<string | null>(null);
    const [itemDetailErrors, setItemDetailErrors] = useState<string[]>([]);
    const [apiError, setApiError]             = useState<string | null>(null);

    // ── Detail fetch (edit mode) ──────────────────────────────────────────────
    const [isLoadingDetail, setIsLoadingDetail]   = useState(false);
    const [detailLoadError, setDetailLoadError]   = useState<string | null>(null);
    const [rcvDetail, setRcvDetail]               = useState<GoodsReceivingDetail | null>(null);

    const populateFromDetail = useCallback((detail: GoodsReceivingDetail) => {
        setRcvDetail(detail);
        if (detail.rcvdate)           setRcvdate(detail.rcvdate);
        if (detail.poidh)             setPoidh(detail.poidh);
        if (detail.supplierid != null) setSupplierIdForm(detail.supplierid);
        if (detail.currencyid)        setCurrencyid(detail.currencyid);
        if (detail.rcvwhs)            setRcvwhs(detail.rcvwhs);
        if (detail.kursbeli)          setKursbeli(detail.kursbeli);
        setApod(detail.apod ?? 0);
        setIscashrcv(detail.iscashrcv ?? 0);
        setRcvnote(detail.rcvnote ?? "");
        setFpajaknorcv(detail.fpajaknorcv ?? "");
        setFpajaktglrcv(detail.fpajaktglrcv ?? "");
        setInvNoSupplier(detail.inv_no_supplier ?? "");
        setSjNoSupplier(detail.sj_no_supplier ?? "");

        // Map API items → ExtendedReceiptItem[]
        if (Array.isArray(detail.items) && detail.items.length > 0) {
            const mapped: ExtendedReceiptItem[] = detail.items.map((it: Record<string, unknown>) => {
                const hargaDasar  = parseFloat(String(it.hargadasar  ?? "0")) || 0;
                const qty         = parseFloat(String(it.qtyrcv       ?? "0")) || 0;
                const disc1Pct    = parseFloat(String(it.rcvd_disc_pct_1 ?? "0")) || 0;
                const disc2Pct    = parseFloat(String(it.rcvd_disc_pct_2 ?? "0")) || 0;
                const disc3Pct    = parseFloat(String(it.rcvd_disc_pct_3 ?? "0")) || 0;
                const disc4Pct    = parseFloat(String(it.rcvd_disc_pct_4 ?? "0")) || 0;
                const ppnPct      = parseFloat(String(it.rcvd_ppn_pct  ?? "0")) || 0;
                // Cascade discounts
                const a1 = hargaDasar  * (1 - disc1Pct / 100);
                const a2 = a1          * (1 - disc2Pct / 100);
                const a3 = a2          * (1 - disc3Pct / 100);
                const afterDisc = a3   * (1 - disc4Pct / 100);
                const discVal   = hargaDasar - afterDisc;
                const ppnVal    = afterDisc * (ppnPct / 100);
                const hargaFinal = afterDisc + ppnVal;
                const jumlah = hargaFinal * qty;

                return {
                    name:       String(it.productname ?? it.ketbarang ?? ""),
                    barcode:    String(it.productcode ?? ""),
                    uom:        String(it.uomname ?? it.uom ?? ""),
                    qty,
                    hargaDasar,
                    discount:   discVal,
                    ppn:        ppnVal,
                    hargaFinal,
                    jumlah,
                    productid:  typeof it.productid   === "number" ? it.productid  : undefined,
                    uomid:      typeof it.uom_idf      === "number" ? it.uom_idf    : undefined,
                    poid_d_idf: typeof it.poid_d_idf   === "number" ? it.poid_d_idf : undefined,
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
        fetch(`/api/purchase/receipts/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && json.data) {
                    populateFromDetail(json.data as GoodsReceivingDetail);
                } else {
                    setDetailLoadError(json.message ?? "Gagal memuat data penerimaan barang.");
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

    // ── PO Dropdown (dinamis berdasarkan supplier) ────────────────────────────
    const [poList, setPoList]               = useState<PoDropdownItem[]>([]);
    const [loadingPoList, setLoadingPoList] = useState(false);

    useEffect(() => {
        // Jangan re-fetch PO list saat mode EDIT (PO sudah diketahui)
        if (!isNew) return;
        setLoadingPoList(true);
        setPoList([]);

        const url = supplierIdForm
            ? `/api/purchase/orders/for-receipt?mode=by_supplier&supplier_id=${supplierIdForm}`
            : "/api/purchase/orders/for-receipt?mode=initial";

        fetch(url)
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) setPoList(json.data);
            })
            .catch((err) => console.error("[poList fetch]", err))
            .finally(() => setLoadingPoList(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplierIdForm, isNew]);

    // ── Suppliers ─────────────────────────────────────────────────────────────
    const [suppliers, setSuppliers]             = useState<SupplierListItem[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    useEffect(() => {
        setLoadingSuppliers(true);
        // Mode NEW: hanya supplier yang aktif (isactive=1)
        // Mode EDIT: ambil semua agar data yang sudah dipilih tetap tampil
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

    // ── Auto-fill from PO detail ──────────────────────────────────────────────
    // Ketika user memilih PO dari dropdown, fetch detail PO dan auto-isi field terkait
    const handlePoSelect = useCallback(async (poid: number | "") => {
        setPoidh(poid);
        if (!poid) return;

        try {
            const res  = await fetch(`/api/purchase/orders/${poid}`);
            const json = await res.json();
            if (!json.ok || !json.data) return;

            const po = json.data;
            // Auto-isi field header dari data PO
            if (po.po_fpajaknorcv)   setFpajaknorcv(po.po_fpajaknorcv);
            if (po.po_fpajaktglrcv)  setFpajaktglrcv(po.po_fpajaktglrcv);
            if (po.po_inv_no_supplier) setInvNoSupplier(po.po_inv_no_supplier);
            if (po.po_sj_no_supplier)  setSjNoSupplier(po.po_sj_no_supplier);
            if (typeof po.potop === "number") setApod(po.potop);
            if (po.pocurr) setCurrencyid(po.pocurr);
        } catch (err) {
            console.error("[handlePoSelect detail fetch]", err);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Handle Save ───────────────────────────────────────────────────────────
    const handleSave = async () => {
        // Clear all errors first
        setSupplierError(null);
        setPoidhError(null);
        setRcvwhsError(null);
        setItemsError(null);
        setItemDetailErrors([]);
        setApiError(null);

        // Validation
        if (!supplierIdForm) {
            setSupplierError("Pilih pemasok terlebih dahulu.");
            return;
        }
        if (!poidh) {
            setPoidhError("Pilih nomor PO terlebih dahulu.");
            return;
        }
        if (!rcvwhs) {
            setRcvwhsError("Pilih gudang tujuan.");
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
                poidh: poidh as number,
                supplierid: supplierIdForm as number,
                currencyid,
                rcvwhs: rcvwhs as number,
                kursbeli,
                apod,
                iscashrcv,
                rcvnote,
                fpajaknorcv,
                fpajaktglrcv: fpajaktglrcv || null,
                inv_no_supplier: invNoSupplier,
                sj_no_supplier: sjNoSupplier,
                bdp_refid: 0,
                items: productItems.map((item) => ({
                    poid_d_idf: item.poid_d_idf ?? 0,
                    productid:  item.productid  ?? 0,
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
                ? await fetch("/api/purchase/receipts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                : await fetch(`/api/purchase/receipts/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                // Parse structured field errors
                const detail = json.detail as Record<string, unknown> | undefined;
                if (detail) {
                    const supplierErrs = detail["supplierid"] as string[] | undefined;
                    if (Array.isArray(supplierErrs) && supplierErrs.length > 0) {
                        setSupplierError(supplierErrs[0]);
                    }
                    const itemsDetailArr = detail["items"] as Record<string, string[]>[] | undefined;
                    if (Array.isArray(itemsDetailArr)) {
                        const fieldLabels: Record<string, string> = {
                            qtyrcv:     "Kuantitas",
                            hargadasar: "Harga Dasar",
                            productid:  "Produk",
                            uom_idf:    "Satuan",
                            poid_d_idf: "Referensi PO",
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

            // Navigate to the (new or updated) record
            if (isNew) {
                const newId = json.data?.rcvid ?? "new";
                router.push(`/purchase/receipt/${newId}`);
            } else {
                // Reload detail
                populateFromDetail(json.data as GoodsReceivingDetail);
            }
        } catch (err) {
            console.error("[handleSave receipt]", err);
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
        // identity
        isNew,
        rcvDetail,
        isLoadingDetail,
        detailLoadError,
        // header fields
        rcvdate, setRcvdate,
        poidh, setPoidh,
        supplierIdForm, setSupplierIdForm,
        currencyid, setCurrencyid,
        rcvwhs, setRcvwhs,
        kursbeli, setKursbeli,
        apod, setApod,
        iscashrcv, setIscashrcv,
        rcvnote, setRcvnote,
        fpajaknorcv, setFpajaknorcv,
        fpajaktglrcv, setFpajaktglrcv,
        invNoSupplier, setInvNoSupplier,
        sjNoSupplier, setSjNoSupplier,
        // save
        isSaving,
        supplierError, clearSupplierError: () => setSupplierError(null),
        poidhError,    clearPoidhError:    () => setPoidhError(null),
        rcvwhsError,   clearRcvwhsError:   () => setRcvwhsError(null),
        itemsError,
        itemDetailErrors,
        apiError,
        handleSave,
        // dropdowns
        suppliers,
        loadingSuppliers,
        warehouses,
        loadingWarehouses,
        poList,
        loadingPoList,
        handlePoSelect,
        currencies,
        loadingCurrencies,
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
    const setelah1 = applyDiscount(form.hargaDasar, form.diskon1Pct);
    const setelah2 = applyDiscount(setelah1,        form.diskon2Pct);
    const setelah3 = applyDiscount(setelah2,        form.diskon3Pct);
    const setelah4 = applyDiscount(setelah3,        form.diskon4Pct);
    const ppnNominal  = (setelah4 * form.ppnPct) / 100;
    const hargaFinal  = setelah4 + ppnNominal;
    const jumlah      = hargaFinal * form.kuantitas;
    return { setelah1, setelah2, setelah3, setelah4, ppnNominal, hargaFinal, jumlah };
}
