import { BarChart2 } from "lucide-react";

export default function Reports() {
  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Analytics &amp; insights coming soon</p>
      </div>
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-center"
        style={{ background: "rgba(13,17,23,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-12 h-12 rounded-2xl gradient-violet flex items-center justify-center glow-violet-sm">
          <BarChart2 size={22} className="text-white" />
        </div>
        <p className="text-sm font-medium text-slate-300">Analytics dashboard</p>
        <p className="text-xs text-slate-600 max-w-xs">Detailed reports and charts will appear here once you have tasks and projects set up.</p>
      </div>
    </div>
  );
}
