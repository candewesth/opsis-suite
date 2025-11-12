import { getCustomers } from '@/lib/data/customers';
import { CustomersGrid } from './customers-grid';

export const revalidate = 60;

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Relaciones</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clientes</h1>
      </div>
      <CustomersGrid customers={customers} />
    </div>
  );
}
