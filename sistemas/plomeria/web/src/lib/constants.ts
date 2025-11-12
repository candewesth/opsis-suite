import { OrderPriority, OrderStatus } from './types';

export const ORDER_STATE_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; step: number }
> = {
  draft: { label: 'Borrador', color: '#6b7280', bg: '#f3f4f6', step: 0 },
  scheduled: { label: 'Programado', color: '#2563eb', bg: '#dbeafe', step: 1 },
  en_route: { label: 'En camino', color: '#d97706', bg: '#fef3c7', step: 2 },
  on_site: { label: 'En sitio', color: '#7c3aed', bg: '#ede9fe', step: 3 },
  job_done: { label: 'Completado', color: '#10b981', bg: '#d1fae5', step: 4 },
  invoiced: { label: 'Facturado', color: '#0ea5e9', bg: '#cffafe', step: 5 },
  paid: { label: 'Pagado', color: '#047857', bg: '#a7f3d0', step: 6 },
  archived: { label: 'Archivado', color: '#475569', bg: '#e2e8f0', step: 7 },
};

export const PRIORITY_CONFIG: Record<
  OrderPriority,
  { label: string; color: string; bg: string }
> = {
  low: { label: 'Baja', color: '#0ea5e9', bg: '#e0f2fe' },
  normal: { label: 'Normal', color: '#2563eb', bg: '#dbeafe' },
  high: { label: 'Alta', color: '#f97316', bg: '#ffedd5' },
  emergency: { label: 'Emergencia', color: '#ef4444', bg: '#fee2e2' },
};

export const ORDER_STEP_SEQUENCE: OrderStatus[] = [
  'draft',
  'scheduled',
  'en_route',
  'on_site',
  'job_done',
  'invoiced',
  'paid',
  'archived',
];

export const SERVICE_TYPES = [
  'Instalación',
  'Reparación',
  'Mantenimiento',
  'Emergencia',
  'Inspección',
];

export const LANG_OPTIONS = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
];

export const THEME_PALETTES = ['default', 'ocean', 'forest', 'sunset'] as const;
