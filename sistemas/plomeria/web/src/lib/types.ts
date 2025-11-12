export type OrderStatus =
  | 'draft'
  | 'scheduled'
  | 'en_route'
  | 'on_site'
  | 'job_done'
  | 'invoiced'
  | 'paid'
  | 'archived';

export type OrderPriority = 'low' | 'normal' | 'high' | 'emergency';

export interface CustomerRecord {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address_text?: string | null;
  tags?: string[];
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  customer_id: string;
  label: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
}

export interface OrderRecord {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string | null;
  customer_email?: string | null;
  status: OrderStatus;
  priority: OrderPriority;
  service_type: string;
  address_text?: string | null;
  geo_lat?: number | null;
  geo_lng?: number | null;
  window_start?: string | null;
  window_end?: string | null;
  total_final: number;
  labor_rate_per_hour?: number | null;
  labor_hours?: number | null;
  materials_subtotal?: number | null;
  created_at: string;
  updated_at?: string;
  notes_internal?: string | null;
}

export interface OrderMaterial {
  id: string;
  order_id: string;
  item_name: string;
  qty_used: number;
  unit_cost: number;
  source_location: string;
  created_at: string;
}

export interface OrderPhoto {
  id: string;
  order_id: string;
  url: string;
  kind: string;
  caption?: string | null;
  created_at: string;
}

export interface OrderTimelineEvent {
  id: string;
  label: string;
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface OrderDetail extends OrderRecord {
  materials: OrderMaterial[];
  photos: OrderPhoto[];
  customer?: CustomerRecord;
  addresses?: CustomerAddress[];
  timeline: OrderTimelineEvent[];
}

export interface DashboardStats {
  pending: number;
  inProgress: number;
  completedToday: number;
  revenueToday: number;
  criticalMaterials: number;
}

export interface MapJob {
  id: string;
  lat: number;
  lng: number;
  status: OrderStatus;
  address: string;
  service_type?: string;
  priority?: OrderPriority;
}

export interface InventoryItem {
  id: string;
  truck_id: string;
  truck_name?: string;
  item_name: string;
  qty_on_hand: number;
  min_threshold: number;
  updated_at: string;
}

export type RateType = 'hourly' | 'fixed' | 'unit' | 'emergency' | 'other';

export interface RateRecord {
  id: string;
  concept: string;
  type: RateType;
  price: number;
  description?: string | null;
}

export interface SettingsRecord {
  id: string;
  company_name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  theme: 'light' | 'dark';
  palette: 'default' | 'ocean' | 'forest' | 'sunset';
  customRates: RateRecord[];
  updated_at?: string;
}

export interface DashboardSnapshot {
  stats: DashboardStats;
  recentOrders: OrderRecord[];
  mapJobs: MapJob[];
}
