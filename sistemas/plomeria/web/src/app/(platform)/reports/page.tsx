import { getDashboardSnapshot } from '@/lib/data/dashboard';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 300;

export default async function ReportsPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Análisis</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reportes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Usa esta vista para generar resultados financieros rápidos antes de exportar desde Supabase o BI.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ingresos del día</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(snapshot.stats.revenueToday)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Órdenes activas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{snapshot.stats.inProgress}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{snapshot.stats.pending}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Exporta tus reportes conectando Supabase con herramientas favoritas (Metabase, PowerBI, Looker). Esta sección
        sirve como recordatorio del pipeline y base para futuras gráficas.
      </div>
    </div>
  );
}
