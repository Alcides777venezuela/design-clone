-- ============================================================
-- SUPABASE SETUP PARA DESIGN.COM CLONE
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Crear la tabla de perfiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Políticas de seguridad (Row Level Security)
alter table public.profiles enable row level security;

-- Los usuarios pueden ver su propio perfil
create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- TABLA DE LINKS EN BIO (para el panel de usuario)
-- ============================================================

-- 4. Tabla de links en bio
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text not null,
  clicks integer default 0,
  created_at timestamptz default now()
);

alter table public.links enable row level security;

-- Los usuarios gestionan sus propios links
create policy "Usuarios gestionan sus links"
  on public.links for all
  using (auth.uid() = user_id);

-- 5. Tabla de estadísticas de visitas
create table if not exists public.visits (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references public.links on delete cascade,
  visited_at timestamptz default now(),
  referrer text,
  country text
);

alter table public.visits enable row level security;

create policy "Usuarios ven sus estadísticas"
  on public.visits for select
  using (exists (
    select 1 from public.links l
    where l.id = visits.link_id and l.user_id = auth.uid()
  ));

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- select * from public.profiles;
-- select * from public.links;