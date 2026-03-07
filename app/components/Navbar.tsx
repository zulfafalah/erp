export default function Navbar() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 bg-white px-6 py-3 shrink-0">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-primary">
                    <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                    <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">
                        ERP Purchase
                    </h2>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <a
                        className="text-slate-600 text-sm font-medium hover:text-primary transition-colors"
                        href="#"
                    >
                        Dashboard
                    </a>
                    <a
                        className="text-primary text-sm font-semibold border-b-2 border-primary py-1"
                        href="#"
                    >
                        Orders
                    </a>
                    <a
                        className="text-slate-600 text-sm font-medium hover:text-primary transition-colors"
                        href="#"
                    >
                        Inventory
                    </a>
                    <a
                        className="text-slate-600 text-sm font-medium hover:text-primary transition-colors"
                        href="#"
                    >
                        Reports
                    </a>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                        search
                    </span>
                    <input
                        className="bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64"
                        placeholder="Quick Search (Ctrl+K)"
                        type="text"
                    />
                </div>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-bold text-slate-900">Alex Thompson</p>
                        <p className="text-[10px] text-slate-500">Procurement Manager</p>
                    </div>
                    <div className="size-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">
                            person
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
