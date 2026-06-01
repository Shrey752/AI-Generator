-- ============================================================
-- NEMIDEEP weaves — Supabase database schema + RLS policies
-- Run this in your Supabase SQL editor (Dashboard → SQL editor)
-- ============================================================

-- Enable UUID extension (already enabled on Supabase by default)
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Storage bucket for product images
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow anyone to read images (public catalog)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated admin to upload/delete
create policy "Admin can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' AND
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

create policy "Admin can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images' AND
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- ─────────────────────────────────────────────
-- BUYERS
-- ─────────────────────────────────────────────
create table if not exists buyers (
  id           uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  gst_number   text,
  contact_name text not null,
  phone        text not null,
  email        text not null unique,
  city         text not null,
  status       text not null default 'active' check (status in ('active', 'suspended')),
  created_at   timestamptz not null default now()
);

alter table buyers enable row level security;

-- Buyers can read/update only their own row
create policy "Buyers: own row select" on buyers for select using (auth.uid() = id);
create policy "Buyers: own row insert" on buyers for insert with check (auth.uid() = id);
create policy "Buyers: own row update" on buyers for update using (auth.uid() = id);

-- Admin sees all buyers
create policy "Admin: all buyers" on buyers for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

create policy "Anyone can read categories" on categories for select using (true);
create policy "Admin: manage categories" on categories for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
create table if not exists products (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text not null unique,
  description         text,
  category_id         uuid references categories(id) on delete set null,
  fabric_composition  text,
  weave_type          text,
  width               text,
  gsm                 integer,
  status              text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at          timestamptz not null default now()
);

alter table products enable row level security;

create policy "Anyone can read active products" on products for select using (status = 'active');
create policy "Admin: all products" on products for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- PRODUCT COLORS
-- ─────────────────────────────────────────────
create table if not exists product_colors (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  color_name  text not null,
  color_hex   text
);

alter table product_colors enable row level security;

create policy "Anyone can read product colors" on product_colors for select using (true);
create policy "Admin: manage product colors" on product_colors for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- PRODUCT IMAGES
-- ─────────────────────────────────────────────
create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  image_url   text not null,
  sort_order  integer not null default 0
);

alter table product_images enable row level security;

create policy "Anyone can read product images" on product_images for select using (true);
create policy "Admin: manage product images" on product_images for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- ENQUIRIES
-- ─────────────────────────────────────────────
create table if not exists enquiries (
  id           uuid primary key default uuid_generate_v4(),
  buyer_id     uuid not null references buyers(id) on delete cascade,
  status       text not null default 'new' check (status in ('new', 'called', 'quoted', 'closed')),
  submitted_at timestamptz not null default now(),
  admin_notes  text
);

alter table enquiries enable row level security;

create policy "Buyers: own enquiries select" on enquiries for select using (auth.uid() = buyer_id);
create policy "Buyers: create enquiry" on enquiries for insert with check (auth.uid() = buyer_id);
create policy "Admin: all enquiries" on enquiries for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- ENQUIRY ITEMS
-- ─────────────────────────────────────────────
create table if not exists enquiry_items (
  id              uuid primary key default uuid_generate_v4(),
  enquiry_id      uuid not null references enquiries(id) on delete cascade,
  product_id      uuid not null references products(id) on delete restrict,
  quantity        text,
  preferred_shade text,
  buyer_notes     text
);

alter table enquiry_items enable row level security;

create policy "Buyers: own enquiry items select" on enquiry_items for select
  using (exists (select 1 from enquiries e where e.id = enquiry_id and e.buyer_id = auth.uid()));

create policy "Buyers: insert enquiry items" on enquiry_items for insert
  with check (exists (select 1 from enquiries e where e.id = enquiry_id and e.buyer_id = auth.uid()));

create policy "Admin: all enquiry items" on enquiry_items for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────
-- SEED DATA — 3 categories + 6 products
-- ─────────────────────────────────────────────
insert into categories (name, slug) values
  ('Cotton', 'cotton'),
  ('Silk', 'silk'),
  ('Linen', 'linen')
on conflict (slug) do nothing;

insert into products (name, slug, description, category_id, fabric_composition, weave_type, width, gsm, status)
select
  'Handloom Cotton Saree',
  'handloom-cotton-saree',
  'Classic handloom weave in pure cotton. Breathable, comfortable, and perfect for daily wear.',
  id, '100% Cotton', 'Plain weave', '44 inches', 100, 'active'
from categories where slug = 'cotton'
on conflict (slug) do nothing;

insert into products (name, slug, description, category_id, fabric_composition, weave_type, width, gsm, status)
select
  'Cotton Shirting Fabric',
  'cotton-shirting-fabric',
  'Fine cotton shirting with a crisp finish. Ideal for formal and semi-formal garments.',
  id, '100% Egyptian Cotton', 'Twill weave', '58 inches', 130, 'active'
from categories where slug = 'cotton'
on conflict (slug) do nothing;

insert into products (name, slug, description, category_id, fabric_composition, weave_type, width, gsm, status)
select
  'Banarasi Silk Brocade',
  'banarasi-silk-brocade',
  'Heritage Banarasi brocade with gold zari motifs. Rich, lustrous, and ceremonially significant.',
  id, '100% Pure Silk', 'Brocade', '44 inches', 200, 'active'
from categories where slug = 'silk'
on conflict (slug) do nothing;

insert into products (name, slug, description, category_id, fabric_composition, weave_type, width, gsm, status)
select
  'Tussar Silk Fabric',
  'tussar-silk-fabric',
  'Natural Tussar silk with characteristic texture and sheen. Perfect for ethnic wear.',
  id, '100% Tussar Silk', 'Plain weave', '44 inches', 150, 'active'
from categories where slug = 'silk'
on conflict (slug) do nothing;

insert into products (name, slug, description, category_id, fabric_composition, weave_type, width, gsm, status)
select
  'Belgian Linen Suiting',
  'belgian-linen-suiting',
  'Premium Belgian linen with a natural texture. Lightweight yet structured, ideal for formal suiting.',
  id, '100% Belgian Linen', 'Plain weave', '58 inches', 180, 'active'
from categories where slug = 'linen'
on conflict (slug) do nothing;

insert into products (name, slug, description, category_id, fabric_composition, weave_type, width, gsm, status)
select
  'Linen Blend Kurta Fabric',
  'linen-blend-kurta-fabric',
  'Soft linen-cotton blend. Easy to drape, easy to maintain — ideal for kurta and ethnic wear.',
  id, '60% Linen, 40% Cotton', 'Plain weave', '44 inches', 140, 'active'
from categories where slug = 'linen'
on conflict (slug) do nothing;

-- Add sample colors for each product
insert into product_colors (product_id, color_name, color_hex)
select id, 'White', '#FFFFFF' from products where slug = 'handloom-cotton-saree' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Ivory', '#FFFFF0' from products where slug = 'handloom-cotton-saree' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Sage Green', '#8FBC8F' from products where slug = 'handloom-cotton-saree' on conflict do nothing;

insert into product_colors (product_id, color_name, color_hex)
select id, 'White', '#FFFFFF' from products where slug = 'cotton-shirting-fabric' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Sky Blue', '#87CEEB' from products where slug = 'cotton-shirting-fabric' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Pale Yellow', '#FFFFE0' from products where slug = 'cotton-shirting-fabric' on conflict do nothing;

insert into product_colors (product_id, color_name, color_hex)
select id, 'Gold', '#C79A3E' from products where slug = 'banarasi-silk-brocade' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Maroon', '#800000' from products where slug = 'banarasi-silk-brocade' on conflict do nothing;

insert into product_colors (product_id, color_name, color_hex)
select id, 'Natural', '#D2B48C' from products where slug = 'tussar-silk-fabric' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Champagne', '#F7E7CE' from products where slug = 'tussar-silk-fabric' on conflict do nothing;

insert into product_colors (product_id, color_name, color_hex)
select id, 'Natural', '#D2B48C' from products where slug = 'belgian-linen-suiting' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Stone Grey', '#8B8682' from products where slug = 'belgian-linen-suiting' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Navy', '#003153' from products where slug = 'belgian-linen-suiting' on conflict do nothing;

insert into product_colors (product_id, color_name, color_hex)
select id, 'White', '#FFFFFF' from products where slug = 'linen-blend-kurta-fabric' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Off White', '#FAF9F6' from products where slug = 'linen-blend-kurta-fabric' on conflict do nothing;
insert into product_colors (product_id, color_name, color_hex)
select id, 'Beige', '#F5F5DC' from products where slug = 'linen-blend-kurta-fabric' on conflict do nothing;
