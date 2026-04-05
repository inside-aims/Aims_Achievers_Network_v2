-- ─────────────────────────────────────────────────────────────────────────────
-- AIMS Achievers Network — Supabase Schema
-- Run this in the Supabase SQL editor BEFORE running the seed script.
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable uuid extension
create extension if not exists "pgcrypto";

-- ─── events ──────────────────────────────────────────────────────────────────
create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  event_id      text unique not null,       -- slug e.g. "fast-awards-2025"
  title         text not null,
  description   text,
  image         text,
  start_date    date not null,
  end_date      date not null,
  location      text,
  organizer     text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── event_categories ────────────────────────────────────────────────────────
create table if not exists event_categories (
  id            uuid primary key default gen_random_uuid(),
  category_id   text unique not null,       -- slug e.g. "fast-student-of-year"
  event_id      text not null references events(event_id) on delete cascade,
  name          text not null,
  description   text,
  vote_price    numeric(10,2) not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_event_categories_event_id on event_categories(event_id);

-- ─── nominees ────────────────────────────────────────────────────────────────
create table if not exists nominees (
  id            uuid primary key default gen_random_uuid(),
  nominee_id    text unique not null,       -- slug e.g. "fast-soy-101"
  nominee_code  text,                       -- display code e.g. "FAST-101"
  category_id   text not null references event_categories(category_id) on delete cascade,
  event_id      text not null references events(event_id) on delete cascade,
  full_name     text not null,
  description   text,
  department    text,
  program       text,
  year          text,
  phone         text,
  image_url     text,
  votes         integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_nominees_category_id on nominees(category_id);
create index if not exists idx_nominees_event_id    on nominees(event_id);

-- ─── nominations ─────────────────────────────────────────────────────────────
create table if not exists nominations (
  id                   uuid primary key default gen_random_uuid(),
  nominator_name       text not null,
  nominator_email      text not null,
  nominator_phone      text,
  nominator_relationship text not null,
  event_id             text not null,
  category_id          text not null,
  nominee_name         text not null,
  nominee_phone        text,
  nominee_department   text,
  nominee_year         text,
  nominee_program      text,
  nominee_photo_url    text,
  nomination_reason    text not null,
  achievements         text,
  status               text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists idx_nominations_event_id    on nominations(event_id);
create index if not exists idx_nominations_category_id on nominations(category_id);
create index if not exists idx_nominations_status      on nominations(status);

-- ─── gallery ─────────────────────────────────────────────────────────────────
create table if not exists gallery (
  id           uuid primary key default gen_random_uuid(),
  urls         text[] not null default '{}',
  category     text not null,
  event_name   text not null,
  university   text,
  description  text not null,
  photographer text,
  upload_date  date not null default current_date,
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_gallery_event_name on gallery(event_name);
create index if not exists idx_gallery_category   on gallery(category);

-- ─── outlets ─────────────────────────────────────────────────────────────────
create table if not exists outlets (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  tagline             text,
  description         text,
  location            text,
  rating              numeric(3,2),
  reviews             integer not null default 0,
  completed_orders    integer not null default 0,
  specialties         text[] not null default '{}',
  phone               text,
  whatsapp            text,
  website             text,
  portfolio_images    text[] not null default '{}',
  featured            boolean not null default false,
  response_time       text,
  years_experience    integer,
  client_satisfaction numeric(5,2),
  verified            boolean not null default false,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── Storage bucket for nominee photos ───────────────────────────────────────
-- Run this separately in the Supabase dashboard → Storage → New Bucket
-- Bucket name: nominee-photos  |  Public: true

-- ─── updated_at trigger ──────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['events','event_categories','nominees','nominations','gallery','outlets']
  loop
    execute format(
      'create trigger set_updated_at before update on %I for each row execute function set_updated_at()',
      t
    );
  end loop;
exception when others then null;
end;
$$;

-- ─── Row-Level Security (RLS) — basic public read ────────────────────────────
alter table events            enable row level security;
alter table event_categories  enable row level security;
alter table nominees          enable row level security;
alter table nominations       enable row level security;
alter table gallery           enable row level security;
alter table outlets           enable row level security;

-- Public read for active content
create policy "public read events"           on events            for select using (is_active = true);
create policy "public read categories"       on event_categories  for select using (is_active = true);
create policy "public read nominees"         on nominees          for select using (is_active = true);
create policy "public read gallery"          on gallery           for select using (true);
create policy "public read outlets"          on outlets           for select using (is_active = true);

-- Anyone can insert a nomination (voting platform — public submissions)
create policy "public insert nominations"    on nominations       for insert with check (true);

-- Nominees are inserted via nominations trigger / admin
create policy "public insert nominees"       on nominees          for insert with check (true);
