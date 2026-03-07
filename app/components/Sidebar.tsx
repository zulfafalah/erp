export default function Sidebar() {
    return (
        <aside className="w-16 lg:w-60 border-r border-primary/10 bg-white flex flex-col shrink-0">
            <div className="p-4 space-y-2 flex-1 overflow-y-auto no-scrollbar">
                <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
                    href="#"
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="hidden lg:inline text-sm font-medium">
                        Overview
                    </span>
                </a>
                <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-md shadow-primary/20"
                    href="#"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    <span className="hidden lg:inline text-sm font-medium">
                        Purchase Orders
                    </span>
                </a>
                <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
                    href="#"
                >
                    <span className="material-symbols-outlined">local_shipping</span>
                    <span className="hidden lg:inline text-sm font-medium">
                        Suppliers
                    </span>
                </a>
                <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
                    href="#"
                >
                    <span className="material-symbols-outlined">analytics</span>
                    <span className="hidden lg:inline text-sm font-medium">
                        Reports
                    </span>
                </a>
                <div className="my-4 border-t border-slate-100"></div>
                <a
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
                    href="#"
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span className="hidden lg:inline text-sm font-medium">
                        Settings
                    </span>
                </a>
            </div>
            <div className="p-4 border-t border-slate-100">
                <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span className="hidden lg:inline text-sm font-semibold">Exit</span>
                </button>
            </div>
        </aside>
    );
}
