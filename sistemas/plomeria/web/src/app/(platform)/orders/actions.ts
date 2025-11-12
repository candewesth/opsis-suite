'use server';

import { createOrder, CreateOrderInput } from '@/lib/data/orders';
import { OrderPriority } from '@/lib/types';

export interface OrderFormState {
  success?: boolean;
  error?: string;
}

export async function createOrderAction(
  _prevState: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const customer_id = String(formData.get('customer_id') || '');
  const service_type = String(formData.get('service_type') || '');
  const priority = (formData.get('priority') || 'normal') as OrderPriority;
  const address_text = String(formData.get('address_text') || '');
  const window_start = String(formData.get('window_start') || '') || null;
  const notes_internal = String(formData.get('notes_internal') || '') || null;

  if (!customer_id || !service_type) {
    return { error: 'Cliente y servicio son obligatorios' };
  }

  const payload: CreateOrderInput = {
    customer_id,
    service_type,
    priority,
    address_text,
    window_start,
    notes_internal,
  };

  const result = await createOrder(payload);
  if (!result.success) {
    return { error: result.error || 'No se pudo crear la orden' };
  }

  return { success: true };
}
