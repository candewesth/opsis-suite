create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address_text text,
  tags text[] default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  label text not null,
  address text not null,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  role text not null default 'tech',
  assigned_tech_id uuid references users(id),
  customer_id uuid references customers(id),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists trucks (
  id uuid primary key default gen_random_uuid(),
  plate text,
  nickname text,
  tech_id_owner uuid references users(id),
  created_at timestamptz not null default timezone('utc', now())
);

create type order_status as enum ('draft','scheduled','en_route','on_site','job_done','invoiced','paid','archived');
create type order_priority as enum ('low','normal','high','emergency');

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  status order_status not null default 'draft',
  customer_id uuid not null references customers(id) on delete restrict,
  address_text text,
  geo_lat double precision,
  geo_lng double precision,
  service_type text not null,
  priority order_priority not null default 'normal',
  window_start timestamptz,
  window_end timestamptz,
  assigned_tech_id uuid references users(id),
  assigned_truck_id uuid references trucks(id),
  labor_rate_per_hour numeric not null default 0,
  labor_hours numeric not null default 0,
  materials_subtotal numeric not null default 0,
  total_estimated numeric not null default 0,
  total_final numeric not null default 0,
  notes_internal text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists order_materials (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  item_name text not null,
  qty_used numeric not null default 0,
  unit_cost numeric not null default 0,
  source_location text not null default 'warehouse',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  kind text not null,
  url text not null,
  caption text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists inventory_truck (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid not null references trucks(id) on delete cascade,
  item_name text not null,
  qty_on_hand numeric not null default 0,
  min_threshold numeric not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists settings (
  id text primary key default 'tenant',
  company_name text,
  phone text,
  email text,
  address text,
  theme text not null default 'light',
  palette text not null default 'default',
  custom_rates jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table customers enable row level security;
alter table customer_addresses enable row level security;
alter table users enable row level security;
alter table trucks enable row level security;
alter table orders enable row level security;
alter table order_materials enable row level security;
alter table photos enable row level security;
alter table inventory_truck enable row level security;
alter table settings enable row level security;

create policy if not exists "public_read_customers" on customers for select using (true);
create policy if not exists "public_write_customers" on customers for insert with check (true);
create policy if not exists "public_update_customers" on customers for update using (true) with check (true);

create policy if not exists "public_read_addresses" on customer_addresses for select using (true);
create policy if not exists "public_write_addresses" on customer_addresses for insert with check (true);
create policy if not exists "public_update_addresses" on customer_addresses for update using (true) with check (true);

create policy if not exists "public_read_users" on users for select using (true);
create policy if not exists "public_write_users" on users for insert with check (true);
create policy if not exists "public_update_users" on users for update using (true) with check (true);

create policy if not exists "public_read_trucks" on trucks for select using (true);
create policy if not exists "public_write_trucks" on trucks for insert with check (true);
create policy if not exists "public_update_trucks" on trucks for update using (true) with check (true);

create policy if not exists "public_read_orders" on orders for select using (true);
create policy if not exists "public_write_orders" on orders for insert with check (true);
create policy if not exists "public_update_orders" on orders for update using (true) with check (true);

create policy if not exists "public_read_materials" on order_materials for select using (true);
create policy if not exists "public_write_materials" on order_materials for insert with check (true);
create policy if not exists "public_update_materials" on order_materials for update using (true) with check (true);

create policy if not exists "public_read_photos" on photos for select using (true);
create policy if not exists "public_write_photos" on photos for insert with check (true);

create policy if not exists "public_read_inventory" on inventory_truck for select using (true);
create policy if not exists "public_write_inventory" on inventory_truck for insert with check (true);
create policy if not exists "public_update_inventory" on inventory_truck for update using (true) with check (true);

create policy if not exists "public_read_settings" on settings for select using (true);
create policy if not exists "public_write_settings" on settings for insert with check (true);
create policy if not exists "public_update_settings" on settings for update using (true) with check (true);

insert into settings (id, company_name, phone, email, address, theme, palette)
values ('tenant', 'Opsis Plumbing', '+52 55 1234 5678', 'contacto@opsis.mx', 'CDMX, México', 'light', 'default')
on conflict (id) do nothing;
