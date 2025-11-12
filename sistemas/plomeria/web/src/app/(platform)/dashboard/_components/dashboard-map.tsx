'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { MapJob } from '@/lib/types';

const LeafletMap = dynamic(() => import('./leaflet-map'), { ssr: false });

const filters = [
  { id: 'active', label: 'Activos', states: ['en_route', 'on_site'] },
  { id: 'future', label: 'Futuros', states: ['draft', 'scheduled'] },
  { id: 'history', label: 'Historial', states: ['job_done', 'invoiced', 'paid', 'archived'] },
];

export function DashboardMap({ jobs }: { jobs: MapJob[] }) {
  const [filter, setFilter] = useState('active');

  const filtered = useMemo(() => {
    if (filter === 'history') {
      const { states } = filters.find((f) => f.id === filter)!;
      return jobs.filter((job) => states.includes(job.status));
    }
    if (filter === 'future') {
      const { states } = filters.find((f) => f.id === filter)!;
      return jobs.filter((job) => states.includes(job.status));
    }
    return jobs.filter((job) => ['en_route', 'on_site'].includes(job.status));
  }, [jobs, filter]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Mapa de trabajos</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Filtra trabajos activos, futuros o históricos.</p>
        </div>
        <div className="flex gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-full border px-4 py-1 text-sm font-semibold transition ${
                filter === item.id
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[360px] overflow-hidden rounded-xl">
        <LeafletMap jobs={filtered} fallback={jobs} />
      </div>
    </div>
  );
}
