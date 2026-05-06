create table if not exists public.department_data (
  department_role text primary key,
  content text not null,
  updated_at timestamptz not null default now()
);

alter table public.department_data enable row level security;

drop policy if exists "allow role read/write" on public.department_data;

create policy "allow role read/write"
on public.department_data
for all
to anon
using (true)
with check (true);
