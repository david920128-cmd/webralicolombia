create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  subtitle text,
  welcome_title text,
  welcome_description text,
  about_text text,
  mission text,
  vision text,
  values_text text,
  whatsapp text,
  phone_1 text,
  phone_2 text,
  address text,
  neighborhood text,
  city text,
  website text,
  email text,
  logo_url text,
  hero_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price text,
  category text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.settings enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "public can read settings"
on public.settings for select
using (true);

create policy "authenticated can manage settings"
on public.settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "public can read active products"
on public.products for select
using (active = true or auth.role() = 'authenticated');

create policy "authenticated can manage products"
on public.products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "public can read product images"
on public.product_images for select
using (true);

create policy "authenticated can manage product images"
on public.product_images for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
