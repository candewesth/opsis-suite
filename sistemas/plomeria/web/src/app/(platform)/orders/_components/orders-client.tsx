'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { OrderRecord, OrderStatus } from '@/lib/types';
import { ORDER_STATE_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { translate } from '@/lib/i18n';

const FILTERS: Array<{ id: 'all' | OrderStatus; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'draft', label: 'Borrador' },
  { id: 'scheduled', label: 'Programado' },
  { id: 'en_route', label: 'En camino' },
  { id: 'on_site', label: 'En sitio' },
  { id: 'job_done', label: 'Completado' },
  { id: 'invoiced', label: 'Facturado' },
  { id: 'paid', label: 'Pagado' },
];

export function OrdersClient({ orders }: { orders: OrderRecord[] }) {
  const { locale } = useLanguage();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | OrderStatus>('all');

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const needle = search.toLowerCase();
      const matchesSearch =
        order.customer_name?.toLowerCase().includes(needle) ||
        order.service_type?.toLowerCase().includes(needle) ||
        order.address_text?.toLowerCase().includes(needle) ||
        order.id.toLowerCase().includes(needle);
      const matchesStatus = status === 'all' || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={translate(locale, 'searchOrders')}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatus(filter.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              status === filter.id
                ? 'bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">{translate(locale, 'tableCustomer')}</th>
              <th className="px-4 py-3">{translate(locale, 'tableService')}</th>
              <th className="px-4 py-3">{translate(locale, 'tableAddress')}</th>
              <th className="px-4 py-3">{translate(locale, 'tableStatus')}</th>
              <th className="px-4 py-3">{translate(locale, 'tablePriority')}</th>
              <th className="px-4 py-3 text-right">{translate(locale, 'tableTotal')}</th>
              <th className="px-4 py-3 text-right"> </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const state = ORDER_STATE_CONFIG[order.status];
              const priority = PRIORITY_CONFIG[order.priority];
              return (
                <tr
                  key={order.id}
                  className="border-t border-slate-50 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-400">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{order.customer_name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{formatDate(order.created_at, locale)}</div>
                  </td>
                  <td className="px-4 py-3">{order.service_type}</td>
                  <td className="px-4 py-3">{order.address_text}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ color: state.color, backgroundColor: state.bg }}
                    >
                      {state.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ color: priority.color, backgroundColor: priority.bg }}
                    >
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(order.total_final)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                  {translate(locale, 'noData')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
