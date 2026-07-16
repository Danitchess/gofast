-- Go Fast Logistics — Neon Postgres schema
-- Run this once against your Neon database (Neon SQL editor, or `psql $DATABASE_URL -f db/schema.sql`).

create extension if not exists pgcrypto;

create table if not exists vehicles (
  id text primary key,
  name text not null,
  total_units integer not null default 3,
  available_units integer not null default 3
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  token uuid not null default gen_random_uuid(),
  status text not null default 'new', -- new | quoted | accepted | declined
  transport_type text not null,
  vehicle_id text references vehicles(id),
  pickup_city text not null,
  pickup_country text not null,
  dropoff_city text not null,
  dropoff_country text not null,
  transport_date date not null,
  transport_time text not null,
  weight_kg numeric,
  volume_m3 numeric,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  notes text,
  price_eur numeric,
  created_at timestamptz not null default now(),
  quoted_at timestamptz,
  responded_at timestamptz
);

create index if not exists quotes_status_idx on quotes (status);
create index if not exists quotes_token_idx on quotes (token);

-- Seed the fleet with 3 units each — keep these ids in sync with lib/vehicles.js
insert into vehicles (id, name, total_units, available_units) values
  ('citan', 'Mercedes Citan', 3, 3),
  ('sprinter-14', 'Mercedes Sprinter 14 m³', 3, 3),
  ('sprinter-18', 'Mercedes Sprinter 18 m³', 3, 3),
  ('atego', 'Mercedes Atego 45 m³', 3, 3),
  ('antos', 'Mercedes Antos 45 m³', 3, 3),
  ('actros', 'Mercedes Actros 45 m³', 3, 3),
  ('semi-standard', 'Semi-remorque Fourgon / Bâché', 3, 3),
  ('semi-mega', 'Semi-remorque MEGA', 3, 3)
on conflict (id) do nothing;
