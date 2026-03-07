"use client";

export interface ProductItem {
    name: string;
    sku: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
}

interface ProductTableProps {
    items: ProductItem[];
}

export default function ItemTable({ items }: ProductTableProps) {
    const totalRows = items.length;
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-primary/5 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-slate-900">Product Items</h3>
                <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all">
                    <span className="material-symbols-outlined text-base">add</span>
                    Add Product
                </button>
            </div>

            {/* Table Wrapper */}
            <div className="flex-1 overflow-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Item/Product
                            </th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24">
                                Qty
                            </th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 text-right">
                                Unit Price
                            </th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 text-right">
                                Subtotal
                            </th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-primary/5 transition-colors group"
                            >
                                <td className="px-5 py-3">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {item.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">SKU: {item.sku}</p>
                                </td>
                                <td className="px-5 py-3">
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium"
                                        type="number"
                                        defaultValue={item.qty}
                                    />
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <span className="text-sm font-medium">
                                        ${item.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <span className="text-sm font-bold text-slate-900">
                                        ${item.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">
                                            delete
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* Quick add row */}
                        <tr className="bg-slate-50/50">
                            <td className="px-5 py-4" colSpan={5}>
                                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-sm">
                                        add_circle
                                    </span>
                                    Insert quick row (Enter)
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Rows:
                        </span>
                        <span className="text-xs font-bold">{totalRows}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Qty:
                        </span>
                        <span className="text-xs font-bold">{totalQty}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 italic">
                        Press &apos;Tab&apos; for next cell, &apos;Ins&apos; for new row
                    </span>
                </div>
            </div>
        </div>
    );
}
