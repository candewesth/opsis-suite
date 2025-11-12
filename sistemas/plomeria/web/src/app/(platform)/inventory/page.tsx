import { getInventory } from '@/lib/data/inventory';
import { formatDateTime } from '@/lib/utils';

export const revalidate = 120;

export default async function InventoryPage() {
  const inventory = await getInventory();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Inventario</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Material en camionetas</h1>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Camioneta</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Umbral</th>
              <th className="px-4 py-3">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-50 text-slate-600 dark:border-slate-800 dark:text-slate-300"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{item.item_name}</td>
                <td className="px-4 py-3">{item.truck_name || item.truck_id}</td>
                <td className="px-4 py-3">{item.qty_on_hand}</td>
                <td className="px-4 py-3">{item.min_threshold}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(item.updated_at)}</td>
              </tr>
            ))}
            {!inventory.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                  Sin inventario registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
