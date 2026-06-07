import { useState, useCallback } from "react";
import { PurchaseOrderDetail } from "../types";

export type POAction = "submit" | "approve" | "unapprove" | "order" | "on_delivery" | "close" | "reject";

interface UsePOApproveActionProps {
    id: string;
    onSuccess: (updatedDetail: PurchaseOrderDetail) => void;
}

export function usePOApproveAction({ id, onSuccess }: UsePOApproveActionProps) {
    const [isActing, setIsActing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Reject modal state
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectReasonError, setRejectReasonError] = useState<string | null>(null);

    const executeAction = useCallback(async (action: POAction, reason?: string) => {
        setIsActing(true);
        setActionError(null);

        const body: Record<string, string> = { action };
        if (reason) body.reason = reason;

        try {
            const res = await fetch(`/api/purchase/orders/${id}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                const detail = json.detail as string | undefined;
                setActionError(detail ?? json.message ?? "Gagal melakukan aksi. Silakan coba lagi.");
                return;
            }

            onSuccess(json.data as PurchaseOrderDetail);
        } catch {
            setActionError("Terjadi kesalahan jaringan. Silakan coba lagi.");
        } finally {
            setIsActing(false);
        }
    }, [id, onSuccess]);

    const openRejectModal = useCallback(() => {
        setRejectReason("");
        setRejectReasonError(null);
        setIsRejectModalOpen(true);
    }, []);

    const closeRejectModal = useCallback(() => {
        setIsRejectModalOpen(false);
        setRejectReason("");
        setRejectReasonError(null);
    }, []);

    const submitReject = useCallback(async () => {
        if (!rejectReason.trim()) {
            setRejectReasonError("Alasan penolakan wajib diisi.");
            return;
        }
        setIsRejectModalOpen(false);
        await executeAction("reject", rejectReason.trim());
        setRejectReason("");
    }, [rejectReason, executeAction]);

    return {
        isActing,
        actionError,
        clearActionError: () => setActionError(null),
        executeAction,
        // reject modal
        isRejectModalOpen,
        rejectReason,
        setRejectReason,
        rejectReasonError,
        openRejectModal,
        closeRejectModal,
        submitReject,
    };
}
