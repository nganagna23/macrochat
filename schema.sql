-- Jalankan di Supabase SQL Editor
create extension if not exists pgcrypto;

create table if not exists public.macros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trigger text not null,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists macros_user_id_idx on public.macros(user_id);
create index if not exists macros_trigger_idx on public.macros(user_id, trigger);

alter table public.macros enable row level security;

revoke all on table public.macros from anon;
grant select, insert, update, delete on table public.macros to authenticated;

drop policy if exists "users_select_own_macros" on public.macros;
drop policy if exists "users_insert_own_macros" on public.macros;
drop policy if exists "users_update_own_macros" on public.macros;
drop policy if exists "users_delete_own_macros" on public.macros;

create policy "users_select_own_macros"
on public.macros for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users_insert_own_macros"
on public.macros for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "users_update_own_macros"
on public.macros for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users_delete_own_macros"
on public.macros for delete
to authenticated
using ((select auth.uid()) = user_id);
