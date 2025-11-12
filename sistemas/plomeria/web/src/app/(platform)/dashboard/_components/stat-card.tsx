interface DashboardStatCardProps {
  label: string;
  value: string | number;
  accent: string;
  helper?: string;
}

export function DashboardStatCard({ label, value, accent, helper }: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={`mt-3 text-3xl font-bold text-slate-900 dark:text-white`}>
        {value}
      </div>
      {helper && <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</div>}
      <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${accent}`}></div>
    </div>
  );
}
