-- Shared conversation themes and per-viewer message hiding.
-- Additive migration: existing messages are never deleted or modified.

create table if not exists public.chat_thread_settings (
  user_low uuid not null,
  user_high uuid not null,
  background_theme text not null default 'rose',
  updated_by uuid not null references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (user_low, user_high),
  constraint chat_thread_settings_canonical_order check (user_low < user_high),
  constraint chat_thread_settings_theme_valid check (
    background_theme in ('rose', 'lavender', 'peach', 'mint', 'sky')
  ),
  constraint chat_thread_settings_editor_is_participant check (updated_by in (user_low, user_high)),
  constraint chat_thread_settings_friendship_fk foreign key (user_low, user_high)
    references public.chat_friendships(user_low, user_high) on delete cascade
);

alter table public.chat_thread_settings enable row level security;
grant select, insert, update on public.chat_thread_settings to authenticated;

drop policy if exists "Friends can read shared chat theme" on public.chat_thread_settings;
create policy "Friends can read shared chat theme"
  on public.chat_thread_settings for select to authenticated
  using (
    auth.uid() in (user_low, user_high)
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low = chat_thread_settings.user_low
        and f.user_high = chat_thread_settings.user_high
    )
  );

drop policy if exists "Friends can set shared chat theme" on public.chat_thread_settings;
create policy "Friends can set shared chat theme"
  on public.chat_thread_settings for insert to authenticated
  with check (
    auth.uid() in (user_low, user_high)
    and updated_by = auth.uid()
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low = chat_thread_settings.user_low
        and f.user_high = chat_thread_settings.user_high
    )
  );

drop policy if exists "Friends can update shared chat theme" on public.chat_thread_settings;
create policy "Friends can update shared chat theme"
  on public.chat_thread_settings for update to authenticated
  using (
    auth.uid() in (user_low, user_high)
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low = chat_thread_settings.user_low
        and f.user_high = chat_thread_settings.user_high
    )
  )
  with check (
    auth.uid() in (user_low, user_high)
    and updated_by = auth.uid()
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low = chat_thread_settings.user_low
        and f.user_high = chat_thread_settings.user_high
    )
  );

-- A hide record is per viewer. It only hides a message in that viewer's own inbox;
-- the original chat_messages row and the other participant's view stay untouched.
create table if not exists public.chat_message_hides (
  message_id uuid not null references public.chat_messages(id) on delete cascade,
  viewer_id uuid not null references auth.users(id) on delete cascade,
  user_low uuid not null,
  user_high uuid not null,
  hidden_at timestamptz not null default now(),
  primary key (message_id, viewer_id),
  constraint chat_message_hides_canonical_order check (user_low < user_high),
  constraint chat_message_hides_viewer_is_participant check (viewer_id in (user_low, user_high)),
  constraint chat_message_hides_friendship_fk foreign key (user_low, user_high)
    references public.chat_friendships(user_low, user_high) on delete cascade
);

create index if not exists chat_message_hides_viewer_thread_idx
  on public.chat_message_hides (viewer_id, user_low, user_high, hidden_at desc);

alter table public.chat_message_hides enable row level security;
grant select, insert on public.chat_message_hides to authenticated;

drop policy if exists "Users can read their own hidden chat messages" on public.chat_message_hides;
create policy "Users can read their own hidden chat messages"
  on public.chat_message_hides for select to authenticated
  using (viewer_id = auth.uid() and auth.uid() in (user_low, user_high));

drop policy if exists "Users can hide messages only in their own view" on public.chat_message_hides;
create policy "Users can hide messages only in their own view"
  on public.chat_message_hides for insert to authenticated
  with check (
    viewer_id = auth.uid()
    and auth.uid() in (user_low, user_high)
    and exists (
      select 1 from public.chat_messages m
      where m.id = chat_message_hides.message_id
        and m.user_low = chat_message_hides.user_low
        and m.user_high = chat_message_hides.user_high
    )
  );

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chat_thread_settings'
    ) then
      execute 'alter publication supabase_realtime add table public.chat_thread_settings';
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chat_message_hides'
    ) then
      execute 'alter publication supabase_realtime add table public.chat_message_hides';
    end if;
  end if;
end;
$$;
