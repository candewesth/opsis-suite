import { getSettings } from '@/lib/data/settings';
import { SettingsForm } from './settings-form';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ajustes</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Preferencias</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Información de la empresa</h2>
          <p className="text-xs text-slate-500">Se sincroniza con tus cotizaciones y reportes.</p>
          <div className="mt-4">
            <SettingsForm settings={settings} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tarifas</h2>
          <p className="text-xs text-slate-500">Define precios frecuentes para seleccionarlos en órdenes.</p>
          <div className="mt-4 space-y-3">
            {settings.customRates.map((rate) => (
              <div key={rate.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{rate.concept}</p>
                    <p className="text-xs uppercase text-slate-500">{rate.type}</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(rate.price)}</p>
                </div>
                {rate.description && <p className="mt-2 text-xs text-slate-500">{rate.description}</p>}
              </div>
            ))}
            {!settings.customRates.length && (
              <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800">
                Aún no registras tarifas personalizadas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
