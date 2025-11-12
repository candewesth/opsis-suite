import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderDetail } from '@/lib/data/order-detail';
import { ORDER_STATE_CONFIG, ORDER_STEP_SEQUENCE, PRIORITY_CONFIG } from '@/lib/constants';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderDetail(params.orderId);

  if (!order) {
    notFound();
  }

  const state = ORDER_STATE_CONFIG[order.status];
  const priority = PRIORITY_CONFIG[order.priority];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/orders" className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300">
            ← Volver a órdenes
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Orden #{order.id.slice(0, 8)}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full px-3 py-1" style={{ color: state.color, backgroundColor: state.bg }}>
            {state.label}
          </span>
          <span className="rounded-full px-3 py-1" style={{ color: priority.color, backgroundColor: priority.bg }}>
            {priority.label}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          {ORDER_STEP_SEQUENCE.map((step) => {
            const config = ORDER_STATE_CONFIG[step];
            const completed = ORDER_STEP_SEQUENCE.indexOf(step) <= ORDER_STEP_SEQUENCE.indexOf(order.status);
            return (
              <div key={step} className="flex items-center gap-2 text-xs font-semibold">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {completed ? '✓' : ORDER_STEP_SEQUENCE.indexOf(step) + 1}
                </span>
                <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Información</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Cliente</dt>
                <dd className="text-sm font-semibold text-slate-900 dark:text-white">{order.customer?.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Servicio</dt>
                <dd className="text-sm font-semibold text-slate-900 dark:text-white">{order.service_type}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Dirección</dt>
                <dd className="text-sm text-slate-600 dark:text-slate-300">{order.address_text}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Programado</dt>
                <dd className="text-sm text-slate-600 dark:text-slate-300">{formatDateTime(order.window_start)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Creado</dt>
                <dd className="text-sm text-slate-600 dark:text-slate-300">{formatDateTime(order.created_at)}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <dt className="text-xs uppercase text-slate-500 dark:text-slate-400">Notas internas</dt>
              <dd className="mt-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                {order.notes_internal || 'Sin notas'}
              </dd>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Materiales</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Material</th>
                    <th className="px-3 py-2">Cantidad</th>
                    <th className="px-3 py-2">Costo</th>
                    <th className="px-3 py-2">Origen</th>
                  </tr>
                </thead>
                <tbody>
                  {order.materials.map((material) => (
                    <tr key={material.id} className="border-t border-slate-50 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                      <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{material.item_name}</td>
                      <td className="px-3 py-2">{material.qty_used}</td>
                      <td className="px-3 py-2">{formatCurrency(material.unit_cost)}</td>
                      <td className="px-3 py-2">{material.source_location}</td>
                    </tr>
                  ))}
                  {!order.materials.length && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-sm text-slate-500">
                        Sin materiales registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Fotos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {order.photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                  <Image
                    src={photo.url}
                    alt={photo.caption || photo.kind}
                    width={640}
                    height={320}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{photo.caption || photo.kind}</p>
                    <p className="text-slate-500">{formatDateTime(photo.created_at)}</p>
                  </div>
                </div>
              ))}
              {!order.photos.length && <p className="text-sm text-slate-500">Sin fotos registradas</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Costos</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Mano de obra</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency((order.labor_hours || 0) * (order.labor_rate_per_hour || 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Materiales</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(order.materials_subtotal || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                <span>Total</span>
                <span>{formatCurrency(order.total_final)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Historial</h2>
            <div className="mt-4 space-y-4">
              {order.timeline.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-slate-400"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{ORDER_STATE_CONFIG[event.status].label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(event.timestamp)}</p>
                    <p className="text-xs text-slate-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
