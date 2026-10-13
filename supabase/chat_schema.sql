-- One-to-one friend chat for Her Private World.
-- Run after schema.sql in Supabase SQL Editor. Idempotent for safe re-runs.

create table if not exists public.chat_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Bạn của mình',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_profiles_display_name_length check (char_length(btrim(display_name)) between 1 and 40)
);

create table if not exists public.chat_invite_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now(),
  constraint chat_invite_codes_format check (code ~ '^[A-F0-9]{10}$')
);

create table if not exists public.chat_friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_friend_requests_not_self check (requester_id <> recipient_id)
);

create unique index if not exists chat_friend_requests_pending_pair_idx
  on public.chat_friend_requests (
    (least(requester_id, recipient_id)),
    (greatest(requester_id, recipient_id))
  ) where status = 'pending';
create index if not exists chat_friend_requests_recipient_idx
  on public.chat_friend_requests (recipient_id, status, created_at desc);
create index if not exists chat_friend_requests_requester_idx
  on public.chat_friend_requests (requester_id, status, created_at desc);

create table if not exists public.chat_friendships (
  user_low uuid not null references auth.users(id) on delete cascade,
  user_high uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_low, user_high),
  constraint chat_friendships_canonical_order check (user_low < user_high)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_low uuid not null,
  user_high uuid not null,
  sender_id uuid not null references auth.users(id) on delete cascade,
  message_type text not null check (message_type in ('text', 'sticker', 'heart', 'voice')),
  content text,
  media_path text,
  created_at timestamptz not null default now(),
  constraint chat_messages_canonical_order check (user_low < user_high),
  constraint chat_messages_sender_is_participant check (sender_id in (user_low, user_high)),
  constraint chat_messages_friendship_fk foreign key (user_low, user_high)
    references public.chat_friendships(user_low, user_high) on delete cascade,
  constraint chat_messages_content_valid check (
    (message_type = 'text' and content is not null and char_length(btrim(content)) between 1 and 2000 and media_path is null)
    or (message_type = 'sticker' and content in ('💖', '💕', '🥰', '🐻', '🐱', '🌸', '🧸', '😽', '😘', '🥹', '😍', '❤️‍🔥', '🎀', '🍓', '💌', '✨') and media_path is null)
    or (message_type = 'heart' and content = '💖' and media_path is null)
    or (message_type = 'voice' and content is null and media_path is not null)
  )
);

create index if not exists chat_messages_thread_created_idx
  on public.chat_messages (user_low, user_high, created_at desc);

alter table public.chat_profiles enable row level security;
alter table public.chat_invite_codes enable row level security;
alter table public.chat_friend_requests enable row level security;
alter table public.chat_friendships enable row level security;
alter table public.chat_messages enable row level security;

grant select, insert, update on public.chat_profiles to authenticated;
grant select on public.chat_invite_codes to authenticated;
grant select, update (status) on public.chat_friend_requests to authenticated;
grant select on public.chat_friendships to authenticated;
grant select, insert on public.chat_messages to authenticated;

-- A minimal chat-only display card is visible only to the account owner,
-- pending request participants, or accepted friends.
drop policy if exists "Chat profiles visible to owner and chat contacts" on public.chat_profiles;
create policy "Chat profiles visible to owner and chat contacts"
  on public.chat_profiles for select to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.chat_friendships f
      where (f.user_low = auth.uid() and f.user_high = chat_profiles.user_id)
         or (f.user_high = auth.uid() and f.user_low = chat_profiles.user_id)
    )
    or exists (
      select 1 from public.chat_friend_requests r
      where r.status = 'pending'
        and ((r.requester_id = auth.uid() and r.recipient_id = chat_profiles.user_id)
          or (r.recipient_id = auth.uid() and r.requester_id = chat_profiles.user_id))
    )
  );

drop policy if exists "Users manage their own chat card" on public.chat_profiles;
create policy "Users manage their own chat card"
  on public.chat_profiles for insert to authenticated
  with check (auth.uid() = user_id);
drop policy if exists "Users update their own chat card" on public.chat_profiles;
create policy "Users update their own chat card"
  on public.chat_profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Invite codes are only readable by their owner. Sharing/lookup happens through RPCs.
drop policy if exists "Users read their own chat invite code" on public.chat_invite_codes;
create policy "Users read their own chat invite code"
  on public.chat_invite_codes for select to authenticated
  using (auth.uid() = user_id);

-- Participants may read requests, but only the recipient may change a pending request's status.
drop policy if exists "Chat request participants can read requests" on public.chat_friend_requests;
create policy "Chat request participants can read requests"
  on public.chat_friend_requests for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);
drop policy if exists "Recipient can respond to pending chat request" on public.chat_friend_requests;
create policy "Recipient can respond to pending chat request"
  on public.chat_friend_requests for update to authenticated
  using (auth.uid() = recipient_id and status = 'pending')
  with check (auth.uid() = recipient_id and status in ('accepted', 'declined'));

-- A friendship row is created only by the request-acceptance trigger.
drop policy if exists "Friends can read their friendship row" on public.chat_friendships;
create policy "Friends can read their friendship row"
  on public.chat_friendships for select to authenticated
  using (auth.uid() = user_low or auth.uid() = user_high);

-- Message access is limited to the two members of the accepted friendship.
drop policy if exists "Friends can read their own chat messages" on public.chat_messages;
create policy "Friends can read their own chat messages"
  on public.chat_messages for select to authenticated
  using (
    auth.uid() in (user_low, user_high)
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low = chat_messages.user_low and f.user_high = chat_messages.user_high
    )
  );
drop policy if exists "Friends can send messages in their own chat" on public.chat_messages;
create policy "Friends can send messages in their own chat"
  on public.chat_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and auth.uid() in (user_low, user_high)
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low = chat_messages.user_low and f.user_high = chat_messages.user_high
    )
  );

create or replace function public.create_or_get_chat_invite_code()
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_code text;
begin
  if v_user_id is null then
    raise exception 'Bạn cần đăng nhập để tạo mã kết bạn.';
  end if;
  select c.code into v_code from public.chat_invite_codes c where c.user_id = v_user_id;
  if v_code is not null then return v_code; end if;

  for attempt in 1..8 loop
    v_code := upper(substr(md5(gen_random_uuid()::text), 1, 10));
    insert into public.chat_invite_codes (user_id, code)
      values (v_user_id, v_code)
      on conflict do nothing;
    if found then return v_code; end if;
    select c.code into v_code from public.chat_invite_codes c where c.user_id = v_user_id;
    if v_code is not null then return v_code; end if;
  end loop;
  raise exception 'Không tạo được mã kết bạn. Hãy thử lại.';
end;
$$;
revoke all on function public.create_or_get_chat_invite_code() from public;
grant execute on function public.create_or_get_chat_invite_code() to authenticated;

create or replace function public.request_chat_friend_by_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_recipient_id uuid;
  v_request_id uuid;
begin
  if v_user_id is null then
    raise exception 'Bạn cần đăng nhập để gửi lời mời.';
  end if;
  select c.user_id into v_recipient_id
    from public.chat_invite_codes c
    where c.code = upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  if v_recipient_id is null then raise exception 'Mã kết bạn không tồn tại.'; end if;
  if v_recipient_id = v_user_id then raise exception 'Đây là mã của chính bạn.'; end if;
  if exists (
    select 1 from public.chat_friendships f
    where f.user_low = least(v_user_id, v_recipient_id)
      and f.user_high = greatest(v_user_id, v_recipient_id)
  ) then raise exception 'Hai tài khoản đã là bạn bè.'; end if;
  if exists (
    select 1 from public.chat_friend_requests r
    where r.status = 'pending'
      and least(r.requester_id, r.recipient_id) = least(v_user_id, v_recipient_id)
      and greatest(r.requester_id, r.recipient_id) = greatest(v_user_id, v_recipient_id)
  ) then raise exception 'Đã có lời mời đang chờ xử lý. Hãy kiểm tra mục lời mời kết bạn.'; end if;

  insert into public.chat_friend_requests (requester_id, recipient_id)
    values (v_user_id, v_recipient_id)
    returning id into v_request_id;
  return v_request_id;
exception
  when unique_violation then
    raise exception 'Đã có lời mời đang chờ xử lý. Hãy kiểm tra mục lời mời kết bạn.';
end;
$$;
revoke all on function public.request_chat_friend_by_code(text) from public;
grant execute on function public.request_chat_friend_by_code(text) to authenticated;

create or replace function public.create_chat_friendship_after_accept()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if old.status = 'pending' and new.status = 'accepted' then
    insert into public.chat_friendships (user_low, user_high)
      values (least(new.requester_id, new.recipient_id), greatest(new.requester_id, new.recipient_id))
      on conflict do nothing;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.create_chat_friendship_after_accept() from public;

drop trigger if exists chat_friendship_on_request_accept on public.chat_friend_requests;
create trigger chat_friendship_on_request_accept
  before update of status on public.chat_friend_requests
  for each row execute function public.create_chat_friendship_after_accept();

-- Private voice storage. Object paths are canonical: user_low/user_high/random.ext.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-voice', 'chat-voice', false, 10485760,
  array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/mpeg', 'audio/wav', 'audio/x-wav']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Friends can read voice notes in their thread" on storage.objects;
create policy "Friends can read voice notes in their thread"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'chat-voice'
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low::text = (storage.foldername(name))[1]
        and f.user_high::text = (storage.foldername(name))[2]
        and auth.uid() in (f.user_low, f.user_high)
    )
  );

drop policy if exists "Friends can upload voice notes in their thread" on storage.objects;
create policy "Friends can upload voice notes in their thread"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'chat-voice'
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low::text = (storage.foldername(name))[1]
        and f.user_high::text = (storage.foldername(name))[2]
        and auth.uid() in (f.user_low, f.user_high)
    )
  );

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chat_messages'
    ) then
      execute 'alter publication supabase_realtime add table public.chat_messages';
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'chat_friend_requests'
    ) then
      execute 'alter publication supabase_realtime add table public.chat_friend_requests';
    end if;
  end if;
end;
$$;
