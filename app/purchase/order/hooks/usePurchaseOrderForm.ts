import { useState, useEffect, useCallback } from "react";
import { SupplierListItem, UnitListItem, ExtendedProductItem, PurchaseOrderDetail } from "../types";

interface UsePurchaseOrderFormProps {
    productItems: ExtendedProductItem[];
    setProductItems: React.Dispatch<React.SetStateAction<ExtendedProductItem[]>>;
    router: any; // using any to avoid import incompatibilities, will work with next/navigation useRouter
    id: string; // "new" or the actual poid as string
}

export function usePurchaseOrderForm({ productItems, setProductItems, router, id }: UsePurchaseOrderFormProps) {
    const isNew = id === "new";
    const today = new Date().toISOString().split("T")[0];
    
    // ── Header Form State ─────────────────────────────────────────────────────
    const [podate, setPodate] = useState(today);
    const [ispolokal, setIspolokal] = useState(0); // 0 = lokal, 1 = import
    const [supplierIdForm, setSupplierIdForm] = useState<number | "">("");
    const [tipePengirimanId, setTipePengirimanId] = useState<number | "">("");
    const [poket1, setPoket1] = useState("");
    const [potop, setPotop] = useState(0);
    const [pocurr] = useState("IDR");
    const [porate] = useState("1.00");
    const [poInvNo, setPoInvNo] = useState("");
    const [poSjNo, setPoSjNo] = useState("");
    const [poFpajaktno, setPoFpajaktno] = useState("");
    const [poFpajaktgl, setPoFpajaktgl] = useState("");

    // ── Save state ────────────────────────────────────────────────────────────
    const [isSaving, setIsSaving] = useState(false);
    const [supplierError, setSupplierError] = useState<string | null>(null);
    const [tipePengirimanError, setTipePengirimanError] = useState<string | null>(null);
    const [itemsError, setItemsError] = useState<string | null>(null);
    const [itemDetailErrors, setItemDetailErrors] = useState<string[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);

    const [saveToast, setSaveToast] = useState<string | null>(null);

    // ── Detail fetch (edit mode) ──────────────────────────────────────────────
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailLoadError, setDetailLoadError] = useState<string | null>(null);
    const [poDetail, setPoDetail] = useState<PurchaseOrderDetail | null>(null);

    const populateFromDetail = useCallback((detail: PurchaseOrderDetail) => {
        setPoDetail(detail);
        if (detail.podate)       setPodate(detail.podate);
        if (detail.ispolokal != null) setIspolokal(detail.ispolokal);
        if (detail.supplierid != null) setSupplierIdForm(detail.supplierid);
        if (detail.tipebiaya != null)  setTipePengirimanId(detail.tipebiaya);
        setPoket1(detail.poket1 ?? "");
        setPotop(detail.potop ?? 0);
        setPoInvNo(detail.po_inv_no_supplier ?? "");
        setPoSjNo(detail.po_sj_no_supplier ?? "");
        setPoFpajaktno(detail.po_fpajaknorcv ?? "");
        setPoFpajaktgl(detail.po_fpajaktglrcv ?? "");

        // Map API items → ExtendedProductItem[]
        if (Array.isArray(detail.items) && detail.items.length > 0) {
            const mapped: ExtendedProductItem[] = detail.items.map((it: Record<string, unknown>) => {
                const price = parseFloat(String(it.pricepod ?? "0")) || 0;
                const qty   = parseFloat(String(it.qtypod  ?? "0")) || 0;
                const discPct  = parseFloat(String(it.discpctpod ?? "0")) || 0;
                const ppnPct   = parseFloat(String(it.pod_ppn_pct ?? "0")) || 0;
                const discVal  = price * (discPct / 100);
                const afterDisc = price - discVal;
                const ppnVal   = afterDisc * (ppnPct / 100);
                const hargaFinal = afterDisc + ppnVal;
                const jumlah = hargaFinal * qty;
                return {
                    name:      String(it.ketbarang ?? it.productname ?? ""),
                    barcode:   String(it.productcode ?? ""),
                    uom:       String(it.uomname ?? it.uom ?? ""),
                    qty,
                    hargaDasar:  price,
                    discount:    discVal,
                    ppn:         ppnVal,
                    hargaFinal,
                    jumlah,
                    productid:   typeof it.productid === "number" ? it.productid : undefined,
                    uomid:       typeof it.uomid     === "number" ? it.uomid     : undefined,
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
        fetch(`/api/purchase/orders/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && json.data) {
                    populateFromDetail(json.data as PurchaseOrderDetail);
                } else {
                    setDetailLoadError(json.message ?? "Gagal memuat data purchase order.");
                }
            })
            .catch(() => setDetailLoadError("Terjadi kesalahan jaringan saat memuat data."))
            .finally(() => setIsLoadingDetail(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ── Suppliers ─────────────────────────────────────────────────────────────
    const [suppliers, setSuppliers] = useState<SupplierListItem[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    useEffect(() => {
        setLoadingSuppliers(true);
        fetch("/api/master-data/suppliers?limit=200")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) {
                    setSuppliers(json.data);
                }
            })
            .catch((err) => console.error("[suppliers fetch]", err))
            .finally(() => setLoadingSuppliers(false));
    }, []);

    // ── Tipe Pengiriman (Units isplat=1) ───────────────────────────────────────
    const [tipePengiriman, setTipePengiriman] = useState<UnitListItem[]>([]);
    const [loadingTipePengiriman, setLoadingTipePengiriman] = useState(false);

    useEffect(() => {
        setLoadingTipePengiriman(true);
        fetch("/api/master-data/units?isplat=1")
            .then((res) => res.json())
            .then((json) => {
                if (json.ok && Array.isArray(json.data)) {
                    setTipePengiriman(json.data);
                }
            })
            .catch((err) => console.error("[tipePengiriman fetch]", err))
            .finally(() => setLoadingTipePengiriman(false));
    }, []);

    const handleSave = async () => {
        // Clear all errors first
        setSupplierError(null);
        setTipePengirimanError(null);
        setItemsError(null);
        setItemDetailErrors([]);
        setApiError(null);

        if (!supplierIdForm) {
            setSupplierError("Pilih pemasok terlebih dahulu.");
            return;
        }
        if (productItems.length === 0) {
            setItemsError("Tambahkan minimal satu item barang.");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                podate,
                supplierid: supplierIdForm as number,
                ispolokal,
                pocurr,
                porate,
                potop,
                tipebiaya: tipePengirimanId || 0,
                poket1,
                poket2: "",
                pokontrakno: "",
                po_inv_no_supplier: poInvNo,
                po_sj_no_supplier: poSjNo,
                po_fpajaknorcv: poFpajaktno,
                po_fpajaktglrcv: poFpajaktgl || podate,
                items: productItems.map((item) => ({
                    productid: item.productid ?? 0,
                    uomid: item.uomid ?? 0,
                    qtypod: String(item.qty.toFixed(2)),
                    pricepod: String(item.hargaDasar.toFixed(4)),
                    ketbarang: item.name,
                    kettambahan: "",
                    discpctpod: String(item.discount > 0 ? ((item.discount / item.hargaDasar) * 100).toFixed(4) : "0.0000"),
                    pod_disc_pct_2: "0.0000",
                    pod_disc_pct_3: "0.0000",
                    pod_disc_pct_4: "0.0000",
                    pod_disc_pct_5: "0.0000",
                    pod_disc_pct_6: "0.0000",
                    pod_ppn_pct: String(item.ppn > 0 && item.hargaFinal > 0 ? ((item.ppn / (item.hargaFinal - item.ppn)) * 100).toFixed(4) : "0.0000"),
                    estpod: podate,
                })),
            };

            const res = isNew
                ? await fetch("/api/purchase/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
                : await fetch(`/api/purchase/orders/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                // Parse structured field errors from `detail`
                const detail = json.detail as Record<string, unknown> | undefined;
                if (detail) {
                    // Field: tipebiaya
                    const tipebiayaErrors = detail["tipebiaya"] as string[] | undefined;
                    if (Array.isArray(tipebiayaErrors) && tipebiayaErrors.length > 0) {
                        setTipePengirimanError(tipebiayaErrors[0]);
                    }
                    // Field: items (array of per-item error objects)
                    const itemsDetailArr = detail["items"] as Record<string, string[]>[] | undefined;
                    if (Array.isArray(itemsDetailArr)) {
                        const fieldLabels: Record<string, string> = {
                            qtypod: "Kuantitas",
                            pricepod: "Harga",
                            productid: "Produk",
                            uomid: "Satuan",
                            ketbarang: "Nama Barang",
                            discpctpod: "Diskon",
                            pod_ppn_pct: "PPN",
                            estpod: "Tanggal Estimasi",
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
                    // If any field errors were found, don't show the generic apiError
                    const hasFieldErrors =
                        (Array.isArray(tipebiayaErrors) && tipebiayaErrors.length > 0) ||
                        (Array.isArray(itemsDetailArr) && itemsDetailArr.some((e) => Object.keys(e).length > 0));
                    if (!hasFieldErrors) {
                        setApiError(json.message ?? "Gagal menyimpan. Silakan coba lagi.");
                    }
                } else {
                    setApiError(json.message ?? "Gagal menyimpan. Silakan coba lagi.");
                }
                return;
            }

            const label = (json.data?.pono as string | undefined) ?? "PO";
            setSaveToast(`${label} berhasil disimpan`);
            setTimeout(() => setSaveToast(null), 3000);

            if (isNew) {
                const newId = json.data?.poid ?? "new";
                router.push(`/purchase/order/${newId}`);
            }
        } catch (err) {
            console.error("[handleSave]", err);
            setApiError("Terjadi kesalahan jaringan. Silakan coba lagi.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        isNew,
        poDetail,
        populateFromDetail,
        isLoadingDetail,
        detailLoadError,
        podate,
        setPodate,
        ispolokal,
        setIspolokal,
        supplierIdForm,
        setSupplierIdForm,
        tipePengirimanId,
        setTipePengirimanId,
        poket1,
        setPoket1,
        potop,
        setPotop,
        pocurr,
        porate,
        poInvNo,
        setPoInvNo,
        poSjNo,
        setPoSjNo,
        poFpajaktno,
        setPoFpajaktno,
        poFpajaktgl,
        setPoFpajaktgl,
        isSaving,
        supplierError,
        tipePengirimanError,
        itemsError,
        itemDetailErrors,
        apiError,
        clearSupplierError: () => setSupplierError(null),
        clearTipePengirimanError: () => setTipePengirimanError(null),
        suppliers,
        loadingSuppliers,
        tipePengiriman,
        loadingTipePengiriman,
        handleSave,
        saveToast,
    };
}
