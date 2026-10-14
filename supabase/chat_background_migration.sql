-- Shared, private conversation background images.
-- Additive and safe to re-run: existing chats, messages and themes are preserved.

alter table public.chat_thread_settings
  add column if not exists background_image_path text;

alter table public.chat_thread_settings
  drop constraint if exists chat_thread_settings_background_image_path_valid;

alter table public.chat_thread_settings
  add constraint chat_thread_settings_background_image_path_valid check (
    background_image_path is null
    or (
      char_length(background_image_path) <= 256
      and array_length(string_to_array(background_image_path, '/'), 1) = 4
      and split_part(background_image_path, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      and split_part(background_image_path, '/', 2) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      and split_part(background_image_path, '/', 3) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      and char_length(split_part(background_image_path, '/', 4)) = 40
      and left(split_part(background_image_path, '/', 4), 36) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      and right(split_part(background_image_path, '/', 4), 4) = '.jpg'
      and split_part(background_image_path, '/', 1) = user_low::text
      and split_part(background_image_path, '/', 2) = user_high::text
      and split_part(background_image_path, '/', 3) in (user_low::text, user_high::text)
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat-backgrounds', 'chat-backgrounds', false, 5242880, array['image/jpeg'])
on conflict (id) do update set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Friends can read shared chat background images" on storage.objects;
create policy "Friends can read shared chat background images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'chat-backgrounds'
    and array_length(storage.foldername(name), 1) = 3
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low::text = (storage.foldername(name))[1]
        and f.user_high::text = (storage.foldername(name))[2]
        and (storage.foldername(name))[3] in (f.user_low::text, f.user_high::text)
        and auth.uid() in (f.user_low, f.user_high)
    )
  );

drop policy if exists "Friends can upload their own shared chat background images" on storage.objects;
create policy "Friends can upload their own shared chat background images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'chat-backgrounds'
    and array_length(storage.foldername(name), 1) = 3
    and (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and (storage.foldername(name))[2] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and (storage.foldername(name))[3] = auth.uid()::text
    and char_length(split_part(name, '/', 4)) = 40
    and left(split_part(name, '/', 4), 36) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and right(split_part(name, '/', 4), 4) = '.jpg'
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low::text = (storage.foldername(name))[1]
        and f.user_high::text = (storage.foldername(name))[2]
        and auth.uid() in (f.user_low, f.user_high)
    )
  );

drop policy if exists "Users delete their own shared chat background images" on storage.objects;
create policy "Users delete their own shared chat background images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'chat-backgrounds'
    and array_length(storage.foldername(name), 1) = 3
    and (storage.foldername(name))[3] = auth.uid()::text
    and exists (
      select 1 from public.chat_friendships f
      where f.user_low::text = (storage.foldername(name))[1]
        and f.user_high::text = (storage.foldername(name))[2]
        and auth.uid() in (f.user_low, f.user_high)
    )
  );
