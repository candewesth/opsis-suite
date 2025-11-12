import { getOrders } from '@/lib/data/orders';
import { getCustomers } from '@/lib/data/customers';
import { OrdersClient } from './_components/orders-client';
import { NewOrderForm } from './_components/new-order-form';

export const revalidate = 30;

export default async function OrdersPage() {
  const [orders, customers] = await Promise.all([getOrders(), getCustomers()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Operación</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Órdenes de trabajo</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div>
          <OrdersClient orders={orders} />
        </div>
        <NewOrderForm customers={customers} />
      </div>
    </div>
  );
}
