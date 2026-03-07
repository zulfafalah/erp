export default function StatusBar() {
    return (
        <footer className="fixed bottom-0 left-0 w-full h-8 bg-slate-900 text-slate-400 flex items-center justify-between px-6 shrink-0 text-[10px] uppercase font-bold tracking-widest z-50">
            <div className="flex gap-6">
                <span className="flex items-center gap-1.5">
                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>{" "}
                    System Connected
                </span>
                <span>Server: ASIA-SOUTH-1</span>
                <span>DB: PROD_ERP_01</span>
            </div>
            <div className="flex gap-4">
                <span>Shortcut Keys: F2-Save, F5-Refresh, F8-Print</span>
                <span className="text-slate-200">User: Alex T. | Time: 14:22:10</span>
            </div>
        </footer>
    );
}
