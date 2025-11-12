'use server';

import { saveSettings } from '@/lib/data/settings';
import { SettingsRecord } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface SettingsFormState {
  success?: boolean;
  error?: string;
}

export async function saveSettingsAction(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const payload = {
    company_name: String(formData.get('company_name') || ''),
    phone: String(formData.get('phone') || ''),
    email: String(formData.get('email') || ''),
    address: String(formData.get('address') || ''),
    theme: (formData.get('theme') || 'light') as SettingsRecord['theme'],
    palette: (formData.get('palette') || 'default') as SettingsRecord['palette'],
  };

  const result = await saveSettings({ ...payload });
  if (!result.success) {
    return { error: result.error || 'No se pudo guardar la configuración' };
  }

  revalidatePath('/settings');
  revalidatePath('/dashboard');
  return { success: true };
}
