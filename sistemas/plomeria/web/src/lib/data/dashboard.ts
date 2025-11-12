import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  DashboardSnapshot,
  DashboardStats,
  MapJob,
  OrderRecord,
  OrderPriority,
  OrderStatus,
} from '@/lib/types';
import { demoDashboardSnapshot } from '@/lib/demo-data';

function buildStats(orders: OrderRecord[]): DashboardStats {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  let pending = 0;
  let inProgress = 0;
  let completedToday = 0;
  let revenueToday = 0;

  orders.forEach((order) => {
    if (['draft', 'scheduled'].includes(order.status)) pending += 1;
    if (['en_route', 'on_site'].includes(order.status)) inProgress += 1;

    const created = order.created_at?.split('T')[0];
    if (['job_done', 'paid', 'invoiced'].includes(order.status) && created === today) {
      completedToday += 1;
    }
    if (order.status === 'paid' && created === today) {
      revenueToday += order.total_final;
    }
  });

  return {
    pending,
    inProgress,
    completedToday,
    revenueToday,
    criticalMaterials: 0,
  };
}

function mapJobsFromOrders(orders: OrderRecord[]): MapJob[] {
  return orders
    .filter((order) => typeof order.geo_lat === 'number' && typeof order.geo_lng === 'number')
    .map((order) => ({
      id: order.id,
      lat: Number(order.geo_lat),
      lng: Number(order.geo_lng),
      status: order.status,
      address: order.address_text || 'Sin dirección',
      service_type: order.service_type,
      priority: order.priority,
    }));
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoDashboardSnapshot;
  }

  type DashboardOrderRow = {
    id: string;
    customer_id: string;
    status: OrderStatus;
    priority: OrderPriority;
    service_type: string;
    address_text: string | null;
    geo_lat: number | null;
    geo_lng: number | null;
    window_start: string | null;
    total_final: number | null;
    labor_rate_per_hour: number | null;
    labor_hours: number | null;
    materials_subtotal: number | null;
    created_at: string;
    updated_at: string | null;
    notes_internal: string | null;
    // Supabase returns joined rows as arrays when using `!inner`/`!left`, so
    // customers will be an array (or null) — model that here.
    customers?: {
      name?: string | null;
      phone?: string | null;
      email?: string | null;
    }[] | null;
  };

  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(
        `id,status,priority,service_type,address_text,geo_lat,geo_lng,window_start,total_final,created_at,updated_at,notes_internal,customers!inner(name,phone,email)`,
      )
      .order('created_at', { ascending: false })
      .limit(25);

    if (error || !ordersData) {
      throw error;
    }

    const orders: OrderRecord[] = (ordersData as DashboardOrderRow[]).map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      // convert possible `null` to `undefined` so it matches OrderRecord.customer_name
      // customers is an array from the join; take the first entry if present
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
      total_final: Number(row.total_final || 0),
      labor_rate_per_hour: Number(row.labor_rate_per_hour || 0),
      labor_hours: Number(row.labor_hours || 0),
      materials_subtotal: Number(row.materials_subtotal || 0),
      created_at: row.created_at,
      // convert possible `null` to `undefined` to match OrderRecord.updated_at
      updated_at: row.updated_at ?? undefined,
      notes_internal: row.notes_internal,
    }));

    const countResp = await supabase
      .from('inventory_truck')
      .select('*', { count: 'exact', head: true })
      .lt('qty_on_hand', 'min_threshold');

    const criticalMaterials = Number((countResp.count ?? 0) || 0);

    const stats = buildStats(orders);
    stats.criticalMaterials = criticalMaterials;

    return {
      stats,
      recentOrders: orders.slice(0, 5),
      mapJobs: mapJobsFromOrders(orders),
    };
  } catch (error) {
    console.warn('Falling back to demo dashboard data', error);
    return demoDashboardSnapshot;
  }
}
