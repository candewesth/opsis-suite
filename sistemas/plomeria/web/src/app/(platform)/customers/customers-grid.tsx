'use client';

import { useMemo, useState } from 'react';
import { CustomerRecord } from '@/lib/types';
import { useLanguage } from '@/contexts/language-context';
import { translate } from '@/lib/i18n';

export function CustomersGrid({ customers }: { customers: CustomerRecord[] }) {
  const { locale } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(needle)),
    );
  }, [customers, query]);

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={translate(locale, 'customersSearch')}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((customer) => (
          <div key={customer.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{customer.tags?.join(', ')}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {customer.phone && <p>📞 {customer.phone}</p>}
              {customer.email && <p>✉️ {customer.email}</p>}
              {customer.address_text && <p>📍 {customer.address_text}</p>}
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {translate(locale, 'noData')}
          </div>
        )}
      </div>
    </div>
  );
}
