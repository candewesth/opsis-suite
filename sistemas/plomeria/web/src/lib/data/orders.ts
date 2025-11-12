import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { demoOrders } from '@/lib/demo-data';
import { OrderPriority, OrderRecord, OrderStatus } from '@/lib/types';

export interface CreateOrderInput {
  customer_id: string;
  service_type: string;
  priority: OrderPriority;
  address_text?: string;
  window_start?: string | null;
  notes_internal?: string | null;
}

export async function getOrders(): Promise<OrderRecord[]> {
  type OrderRow = {
    id: string;
    customer_id: string;
    status: OrderStatus;
    priority: OrderPriority;
    service_type: string;
    address_text: string | null;
    geo_lat: number | null;
    geo_lng: number | null;
    total_final: number | null;
    window_start: string | null;
    window_end: string | null;
    created_at: string;
    updated_at: string | null;
    labor_rate_per_hour: number | null;
    labor_hours: number | null;
    materials_subtotal: number | null;
    notes_internal: string | null;
    // joined customers come back as arrays when selected
    customers?: {
      name?: string | null;
      phone?: string | null;
      email?: string | null;
    }[] | null;
  };

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoOrders;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `id,status,priority,service_type,address_text,geo_lat,geo_lng,total_final,window_start,window_end,created_at,updated_at,notes_internal,customers(name,phone,email)`,
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) throw error;

    return (data as OrderRow[]).map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      customer_name: row.customers?.[0]?.name ?? undefined,
      customer_phone: row.customers?.[0]?.phone,
      customer_email: row.customers?.[0]?.email,
      status: row.status,
      priority: row.priority,
      service_type: row.service_type,
      address_text: row.address_text,
      geo_lat: row.geo_lat,
      geo_lng: row.geo_lng,
      window_start: row.window_start,
      window_end: row.window_end,
      total_final: Number(row.total_final || 0),
      labor_rate_per_hour: Number(row.labor_rate_per_hour || 0),
      labor_hours: Number(row.labor_hours || 0),
      materials_subtotal: Number(row.materials_subtotal || 0),
      created_at: row.created_at,
      updated_at: row.updated_at ?? undefined,
      notes_internal: row.notes_internal,
    }));
  } catch (error) {
    console.warn('Falling back to demo orders', error);
    return demoOrders;
  }
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { success: false, error: 'Supabase credentials missing' };
  }

  const payload = {
    ...input,
    status: 'draft',
    total_final: 0,
    labor_rate_per_hour: 0,
    labor_hours: 0,
    materials_subtotal: 0,
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/orders');
  return { success: true, id: data.id };
}
