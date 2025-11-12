import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SettingsRecord } from '@/lib/types';
import { demoSettings } from '@/lib/demo-data';

const SETTINGS_ROW_ID = 'tenant';

export async function getSettings(): Promise<SettingsRecord> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoSettings;
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', SETTINGS_ROW_ID)
      .single();

    if (error || !data) throw error;

    return {
      id: data.id,
      company_name: data.company_name || demoSettings.company_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      theme: (data.theme as SettingsRecord['theme']) || demoSettings.theme,
      palette: (data.palette as SettingsRecord['palette']) || demoSettings.palette,
      customRates: (data.custom_rates as SettingsRecord['customRates']) || [],
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.warn('Falling back to demo settings', error);
    return demoSettings;
  }
}

export type SaveSettingsInput = Partial<SettingsRecord>;

export async function saveSettings(input: SaveSettingsInput) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: 'Supabase credentials missing' };
  }

  const payload = {
    company_name: input.company_name,
    phone: input.phone,
    email: input.email,
    address: input.address,
    theme: input.theme,
    palette: input.palette,
    custom_rates: input.customRates,
  };

  const { error } = await supabase
    .from('settings')
    .upsert({ id: SETTINGS_ROW_ID, ...payload })
    .eq('id', SETTINGS_ROW_ID);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
