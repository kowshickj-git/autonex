-- =====================================================================
-- AUTONEX SOLUTIONS - Gallery schema
-- Run once in the Supabase SQL editor (or via `supabase db push`).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------------
create table if not exists public.gallery_images (
  id                uuid primary key default gen_random_uuid(),
  title             text        not null,
  description       text,
  category          text        not null default 'Other',
  -- 'image' | 'video' | 'audio'. image_url is the optimised photo for images,
  -- or the original file as uploaded for video/audio (neither is re-encoded).
  media_type        text        not null default 'image'
                        check (media_type in ('image', 'video', 'audio')),
  image_url         text        not null,
  thumb_url         text        not null,
  storage_path      text        not null unique,
  -- Null for audio (shares one bundled cover asset) and for a video whose
  -- frame extraction failed (falls back to a bundled poster) - nothing was
  -- actually stored for those rows, so there is nothing to delete.
  thumb_path        text,
  width             integer,
  height            integer,
  -- Video/audio runtime in whole seconds. Null for photos.
  duration_seconds  integer,
  display_order     integer     not null default 0,
  is_visible        boolean     not null default true,
  uploaded_by       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Existing databases created before video/audio support: add the columns
-- without disturbing any photo rows already in place. `ADD CONSTRAINT IF NOT
-- EXISTS` is not valid Postgres syntax, so the check constraint is guarded
-- with a catalog lookup instead.
alter table public.gallery_images
  add column if not exists media_type text not null default 'image';
alter table public.gallery_images
  add column if not exists duration_seconds integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'gallery_images_media_type_check'
  ) then
    alter table public.gallery_images
      add constraint gallery_images_media_type_check
        check (media_type in ('image', 'video', 'audio'));
  end if;
end $$;

-- The public gallery sorts by display_order ASC, created_at DESC and filters
-- on is_visible, so index exactly that access path.
create index if not exists gallery_images_public_idx
  on public.gallery_images (is_visible, display_order asc, created_at desc);

create index if not exists gallery_images_category_idx
  on public.gallery_images (category);

-- Keep updated_at honest even for writes made outside the app.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_images_touch on public.gallery_images;
create trigger gallery_images_touch
  before update on public.gallery_images
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- admin_users (staff sign-ins)
--
-- These sit ALONGSIDE the bootstrap owner in .env.local, never replacing it.
-- A fresh deploy has an empty table, so the environment account is what stops
-- you being locked out with no way to create the first staff login.
--
-- Passwords are stored ONLY as a scrypt hash (scrypt:<salt-b64>:<key-b64>).
-- There is no code path anywhere that can read a password back out.
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  id             uuid primary key default gen_random_uuid(),
  -- Lowercased on write; the login lookup depends on it.
  email          text        not null unique,
  name           text        not null,
  role           text        not null default 'editor'
                     check (role in ('owner', 'editor')),
  password_hash  text        not null,
  -- Revokes access without destroying who-uploaded-what history.
  is_active      boolean     not null default true,
  last_login_at  timestamptz,
  created_by     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists admin_users_email_idx on public.admin_users (email);

drop trigger if exists admin_users_touch on public.admin_users;
create trigger admin_users_touch
  before update on public.admin_users
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- enquiries (contact form)
-- ---------------------------------------------------------------------
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null,
  subject    text,
  message    text not null,
  source     text default 'website',
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_idx
  on public.enquiries (created_at desc);

-- =====================================================================
-- Row Level Security
--
-- The application talks to Postgres with the SERVICE ROLE key, which
-- bypasses RLS. These policies exist as a second line of defence: if the
-- anon key is ever used from a browser, it can read visible photos and
-- nothing else. No anonymous role can insert, update or delete anywhere.
-- =====================================================================

alter table public.gallery_images enable row level security;
alter table public.enquiries      enable row level security;
alter table public.admin_users    enable row level security;

drop policy if exists "gallery: public reads visible rows" on public.gallery_images;
create policy "gallery: public reads visible rows"
  on public.gallery_images
  for select
  to anon, authenticated
  using (is_visible = true);

-- Deliberately no anon insert/update/delete policies on any table.
--
-- admin_users has NO policy of any kind, deliberately. RLS with zero policies
-- denies everything, so the anon key cannot read a single row - and those rows
-- contain password hashes and the email addresses of everyone with access.
-- Only the service role (server-side, never in the browser) can touch it.

-- =====================================================================
-- Storage bucket
--
-- In the Supabase dashboard: Storage -> New bucket
--   name:   gallery
--   public: yes   (images are meant to be publicly viewable)
--
-- Uploads and deletes go through the service role from the server, so no
-- storage write policy for anon is needed - and none should be added.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "gallery objects are publicly readable" on storage.objects;
create policy "gallery objects are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'gallery');
