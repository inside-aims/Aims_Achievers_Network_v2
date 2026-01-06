create table public.outlets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  avatar_image_url text,
  is_platform_global boolean not null,
  created_at timestamptz not null default now()
);

alter table public.outlets enable row level security;

create policy "public read outlets"
on public.outlets
for select
using (true);


