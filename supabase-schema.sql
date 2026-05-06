create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null unique check (role in ('students', 'finance', 'administration', 'lecturers', 'alumni')),
  created_at timestamptz not null default now()
);

create table if not exists public.department_data (
  department_role text primary key check (department_role in ('students', 'finance', 'administration', 'lecturers', 'alumni')),
  content text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;
alter table public.department_data enable row level security;

drop policy if exists "user can read own role row" on public.user_roles;
drop policy if exists "user can insert own role row" on public.user_roles;
drop policy if exists "user can update own role row" on public.user_roles;
drop policy if exists "department read by matching role" on public.department_data;
drop policy if exists "department write by matching role" on public.department_data;

create policy "user can read own role row"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

create policy "user can insert own role row"
on public.user_roles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user can update own role row"
on public.user_roles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "department read by matching role"
on public.department_data
for select
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = department_role
  )
);

create policy "department write by matching role"
on public.department_data
for all
to authenticated
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = department_role
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = department_role
  )
);
