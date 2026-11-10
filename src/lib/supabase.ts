import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema for Supabase Setup.
 * Users can execute this in their Supabase SQL editor to create all required tables.
 */
export const SUPABASE_SQL_SCHEMA = `-- Homemade Cakes Trichy Supabase Database Schema
-- Run this script in your Supabase SQL Editor

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Categories Table
create table if not exists public.categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text,
  image text,
  display_order int default 1,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products Table
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  sku text,
  category_id text references public.categories(id) on delete set null,
  category_name text,
  subcategory text,
  description text,
  short_description text,
  price numeric not null,
  original_price numeric,
  discount_percentage numeric,
  stock int default 0,
  low_stock_threshold int default 5,
  weight text,
  ingredients jsonb default '[]'::jsonb,
  allergens jsonb default '[]'::jsonb,
  prep_time text,
  images jsonb default '[]'::jsonb,
  thumbnail text,
  badge text,
  variants jsonb default '[]'::jsonb,
  addons jsonb default '[]'::jsonb,
  flavours jsonb default '[]'::jsonb,
  status text default 'active',
  rating numeric default 5.0,
  review_count int default 0,
  seo_title text,
  seo_description text,
  tags jsonb default '[]'::jsonb,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders Table
create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  customer_id text,
  customer jsonb not null,
  address jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  discount numeric default 0,
  coupon_code text,
  delivery_option jsonb not null,
  delivery_fee numeric default 0,
  tax numeric default 0,
  total numeric not null,
  status text default 'pending',
  payment_status text default 'pending',
  payment_method text not null,
  payment_id text,
  internal_notes text,
  timeline jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Customers Table
create table if not exists public.customers (
  id text primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  total_orders int default 0,
  total_spent numeric default 0,
  last_order_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Coupons Table
create table if not exists public.coupons (
  id text primary key,
  code text unique not null,
  discount_type text not null,
  discount_value numeric not null,
  min_order_amount numeric default 0,
  max_discount numeric,
  start_date text,
  expiry_date text,
  usage_limit int default 100,
  used_count int default 0,
  per_user_limit int default 1,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Reviews Table
create table if not exists public.reviews (
  id text primary key,
  product_id text references public.products(id) on delete cascade,
  product_name text,
  customer_name text not null,
  customer_email text,
  rating int not null,
  title text,
  comment text not null,
  images jsonb default '[]'::jsonb,
  verified_purchase boolean default true,
  status text default 'approved',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Contact Enquiries Table
create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text default 'unread',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Site Settings Table
create table if not exists public.site_settings (
  id text primary key default 'main',
  settings jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

-- Public Read Policies for Storefront
create policy "Allow public read active categories" on public.categories for select using (true);
create policy "Allow public read active products" on public.products for select using (true);
create policy "Allow public read approved reviews" on public.reviews for select using (status = 'approved');
create policy "Allow public insert contact messages" on public.contact_messages for insert with check (true);
create policy "Allow public insert orders" on public.orders for insert with check (true);
create policy "Allow public insert reviews" on public.reviews for insert with check (true);
`;

export const SUPABASE_SCHEMA_SQL = SUPABASE_SQL_SCHEMA;
