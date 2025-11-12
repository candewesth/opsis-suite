import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CustomerAddress, CustomerRecord } from '@/lib/types';
import { demoCustomerAddresses, demoCustomers } from '@/lib/demo-data';

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address_text: string | null;
  tags: string[] | null;
  created_at: string;
};

export async function getCustomers(): Promise<CustomerRecord[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoCustomers;
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) throw error;

    return (data as CustomerRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      address_text: row.address_text,
      tags: row.tags ?? [],
      created_at: row.created_at,
    }));
  } catch (error) {
    console.warn('Falling back to demo customers', error);
    return demoCustomers;
  }
}

export async function getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
  if (!customerId) return [];
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return demoCustomerAddresses.filter((addr) => addr.customer_id === customerId);
  }

  try {
    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error || !data) throw error;
    return data;
  } catch (error) {
    console.warn('Falling back to demo addresses', error);
    return demoCustomerAddresses.filter((addr) => addr.customer_id === customerId);
  }
}
