import Link from 'next/link';
import { getDashboardSnapshot } from '@/lib/data/dashboard';
import { DashboardMap } from './_components/dashboard-map';
import { DashboardStatCard } from './_components/stat-card';
import { RecentOrders } from './_components/recent-orders';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 60;

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Resumen en vivo
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
        >
          <span>＋</span>
          <span>Nueva orden</span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <DashboardStatCard label="Pendientes" value={snapshot.stats.pending} accent="from-sky-500 to-sky-300" />
        <DashboardStatCard label="En curso" value={snapshot.stats.inProgress} accent="from-amber-500 to-orange-300" />
        <DashboardStatCard label="Completados hoy" value={snapshot.stats.completedToday} accent="from-emerald-500 to-green-300" />
        <DashboardStatCard
          label="Ingresos de hoy"
          value={formatCurrency(snapshot.stats.revenueToday)}
          accent="from-indigo-500 to-sky-400"
        />
        <DashboardStatCard label="Materiales críticos" value={snapshot.stats.criticalMaterials} accent="from-rose-500 to-pink-400" />
      </div>

      <DashboardMap jobs={snapshot.mapJobs} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Órdenes recientes</h2>
          <Link href="/orders" className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300">
            Ver todas →
          </Link>
        </div>
        <RecentOrders orders={snapshot.recentOrders} />
      </div>
    </div>
  );
}
