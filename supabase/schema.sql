-- Our Love Space: user-private profile and music storage.
-- Run this once in Supabase Dashboard > SQL Editor.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  image_paths jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

grant select, insert, update on public.user_profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.user_profiles;
create policy "Users can read their own profile"
  on public.user_profiles for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own profile" on public.user_profiles;
create policy "Users can create their own profile"
  on public.user_profiles for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile"
  on public.user_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.user_music (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  object_path text not null unique,
  title text not null,
  artist text not null default 'Nhạc tải lên cá nhân',
  content_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create index if not exists user_music_user_created_idx
  on public.user_music(user_id, created_at);

alter table public.user_music enable row level security;

grant select, insert, delete on public.user_music to authenticated;

drop policy if exists "Users can read their own music metadata" on public.user_music;
create policy "Users can read their own music metadata"
  on public.user_music for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can add their own music metadata" on public.user_music;
create policy "Users can add their own music metadata"
  on public.user_music for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own music metadata" on public.user_music;
create policy "Users can delete their own music metadata"
  on public.user_music for delete to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-media',
  'user-media',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/flac']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read files in their own folder" on storage.objects;
create policy "Users can read files in their own folder"
  on storage.objects for select to authenticated
  using (bucket_id = 'user-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can upload files in their own folder" on storage.objects;
create policy "Users can upload files in their own folder"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'user-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update files in their own folder" on storage.objects;
create policy "Users can update files in their own folder"
  on storage.objects for update to authenticated
  using (bucket_id = 'user-media' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'user-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete files in their own folder" on storage.objects;
create policy "Users can delete files in their own folder"
  on storage.objects for delete to authenticated
  using (bucket_id = 'user-media' and (storage.foldername(name))[1] = auth.uid()::text);
