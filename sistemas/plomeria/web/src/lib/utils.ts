import { format, formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { OrderPriority, OrderStatus } from './types';
import { ORDER_STATE_CONFIG, PRIORITY_CONFIG } from './constants';

export const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value || 0);
}

export function formatDate(value?: string | null, locale: 'es' | 'en' = 'es') {
  if (!value) return '—';
  const date = new Date(value);
  return format(date, 'dd MMM yyyy', { locale: locale === 'es' ? es : enUS });
}

export function formatDateTime(
  value?: string | null,
  locale: 'es' | 'en' = 'es',
) {
  if (!value) return '—';
  const date = new Date(value);
  return format(date, 'dd MMM yyyy • HH:mm', {
    locale: locale === 'es' ? es : enUS,
  });
}

export function formatRelative(value?: string | null, locale: 'es' | 'en' = 'es') {
  if (!value) return '—';
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: locale === 'es' ? es : enUS,
  });
}

export function getStateBadge(status: OrderStatus) {
  return ORDER_STATE_CONFIG[status] ?? ORDER_STATE_CONFIG.draft;
}

export function getPriorityBadge(priority: OrderPriority) {
  return PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.normal;
}

export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}
