import { createSupabaseServerClient } from '@/lib/supabase/server';
import { InventoryItem } from '@/lib/types';
import { demoInventory } from '@/lib/demo-data';

type InventoryRow = {
  id: string;
  truck_id: string;
  item_name: string;
  qty_on_hand: number;
  min_threshold: number;
  updated_at: string;
  // joined rows come back as arrays when using the `trucks(...)` selection
  trucks?: {
    nickname?: string | null;
  }[] | null;
};

export async function getInventory(): Promise<InventoryItem[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoInventory;
  }

  try {
    const { data, error } = await supabase
      .from('inventory_truck')
      .select('*, trucks(nickname)')
      .order('updated_at', { ascending: false });

    if (error || !data) throw error;
    return (data as InventoryRow[]).map((row) => ({
      id: row.id,
      truck_id: row.truck_id,
      // supabase returns joined rows as arrays for `trucks(...)`
      truck_name: row.trucks?.[0]?.nickname ?? undefined,
      item_name: row.item_name,
      qty_on_hand: Number(row.qty_on_hand || 0),
      min_threshold: Number(row.min_threshold || 0),
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.warn('Falling back to demo inventory', error);
    return demoInventory;
  }
}
