'use client';

import Link from 'next/link';
import { OrderRecord } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATE_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';
import { useLanguage } from '@/contexts/language-context';
import { translate } from '@/lib/i18n';

export function RecentOrders({ orders }: { orders: OrderRecord[] }) {
  const { locale } = useLanguage();

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        {translate(locale, 'noData')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const state = ORDER_STATE_CONFIG[order.status];
        const priority = PRIORITY_CONFIG[order.priority];
        return (
          <Link
            href={`/orders/${order.id}`}
            key={order.id}
            className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{order.service_type}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{order.address_text}</p>
              </div>
              <div className="text-right text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(order.total_final)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span
                className="rounded-full px-2.5 py-0.5"
                style={{ color: state.color, backgroundColor: state.bg }}
              >
                {state.label}
              </span>
              <span
                className="rounded-full px-2.5 py-0.5"
                style={{ color: priority.color, backgroundColor: priority.bg }}
              >
                {priority.label}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{formatDate(order.created_at, locale)}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
