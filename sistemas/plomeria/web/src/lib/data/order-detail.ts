import { createSupabaseServerClient } from '@/lib/supabase/server';
import { OrderDetail, OrderTimelineEvent } from '@/lib/types';
import { demoOrderDetail } from '@/lib/demo-data';
import { ORDER_STEP_SEQUENCE } from '@/lib/constants';

type MaterialRow = {
  id: string;
  order_id: string;
  item_name: string;
  qty_used: number;
  unit_cost: number;
  source_location: string;
  created_at: string;
};

type PhotoRow = {
  id: string;
  order_id: string;
  url: string;
  kind: string;
  caption: string | null;
  created_at: string;
};

export async function getOrderDetail(orderId: string): Promise<OrderDetail | null> {
  if (!orderId) return null;
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoOrderDetail;
  }

  try {
    const { data: orderRow, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !orderRow) throw error;

    const [customerRes, materialsRes, photosRes, addressRes] = await Promise.all([
      supabase.from('customers').select('*').eq('id', orderRow.customer_id).maybeSingle(),
      supabase.from('order_materials').select('*').eq('order_id', orderId).order('created_at', { ascending: false }),
      supabase.from('photos').select('*').eq('order_id', orderId).order('created_at', { ascending: false }),
      supabase.from('customer_addresses').select('*').eq('customer_id', orderRow.customer_id),
    ]);

    const timeline: OrderTimelineEvent[] = ORDER_STEP_SEQUENCE.map((status) => ({
      id: `${orderId}-${status}`,
      label: status,
      status,
      timestamp: orderRow.updated_at || orderRow.created_at,
      description: `Estado ${status}`,
    }));

    return {
      id: orderRow.id,
      customer_id: orderRow.customer_id,
      customer_name: customerRes.data?.name,
      status: orderRow.status,
      priority: orderRow.priority,
      service_type: orderRow.service_type,
      address_text: orderRow.address_text,
      geo_lat: orderRow.geo_lat,
      geo_lng: orderRow.geo_lng,
      window_start: orderRow.window_start,
      window_end: orderRow.window_end,
      total_final: Number(orderRow.total_final || 0),
      labor_rate_per_hour: Number(orderRow.labor_rate_per_hour || 0),
      labor_hours: Number(orderRow.labor_hours || 0),
      materials_subtotal: Number(orderRow.materials_subtotal || 0),
      created_at: orderRow.created_at,
      updated_at: orderRow.updated_at,
      notes_internal: orderRow.notes_internal,
      customer: customerRes.data || undefined,
      materials:
        (materialsRes.data as MaterialRow[] | null)?.map((row) => ({
          id: row.id,
          order_id: row.order_id,
          item_name: row.item_name,
          qty_used: Number(row.qty_used || 0),
          unit_cost: Number(row.unit_cost || 0),
          source_location: row.source_location,
          created_at: row.created_at,
        })) || [],
      photos:
        (photosRes.data as PhotoRow[] | null)?.map((row) => ({
          id: row.id,
          order_id: row.order_id,
          url: row.url,
          kind: row.kind,
          caption: row.caption,
          created_at: row.created_at,
        })) || [],
      addresses: addressRes.data || undefined,
      timeline,
    };
  } catch (error) {
    console.warn('Falling back to demo order detail', error);
    return demoOrderDetail;
  }
}
