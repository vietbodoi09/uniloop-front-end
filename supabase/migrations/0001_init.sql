-- ========== EXTENSIONS ==========
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";
create extension if not exists "pg_trgm";

-- ========== ENUMS ==========
create type listing_type   as enum ('sell', 'exchange');
create type item_condition as enum ('new', 'like_new', 'used', 'for_parts');
create type listing_status as enum ('active', 'reserved', 'sold', 'hidden');

-- ========== UNIVERSITIES & FACULTIES ==========
create table universities (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  short_name  text not null unique,
  email_domain text not null unique,
  created_at  timestamptz default now()
);

create table faculties (
  id            uuid primary key default uuid_generate_v4(),
  university_id uuid not null references universities(id) on delete cascade,
  name          text not null,
  unique (university_id, name)
);

-- ========== PROFILES ==========
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text not null unique,
  full_name      text,
  avatar_url     text,
  university_id  uuid references universities(id),
  faculty_id     uuid references faculties(id),
  phone          text,
  zalo           text,
  messenger_url  text,
  bio            text,
  rating_avg     numeric(2,1) default 0,
  rating_count   int default 0,
  is_verified    boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ========== SUBJECTS ==========
create table subjects (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  faculty_id    uuid references faculties(id) on delete set null
);

-- ========== PRODUCTS ==========
create table products (
  id           uuid primary key default uuid_generate_v4(),
  seller_id    uuid not null references profiles(id) on delete cascade,
  title        text not null,
  description  text,
  images       text[] default '{}',
  listing_type listing_type not null,
  condition    item_condition not null,
  price        numeric(12,0),
  subject_id   uuid references subjects(id),
  university_id uuid references universities(id),
  location_label text,
  geo          geography(point, 4326),
  status       listing_status default 'active',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index products_geo_idx    on products using gist (geo);
create index products_title_trgm on products using gin (title gin_trgm_ops);
create index products_status_idx on products (status);
create index products_seller_idx on products (seller_id);

-- ========== CONVERSATIONS & MESSAGES ==========
create table conversations (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete set null,
  buyer_id    uuid not null references profiles(id) on delete cascade,
  seller_id   uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at  timestamptz default now(),
  unique (product_id, buyer_id, seller_id)
);

create table messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references profiles(id) on delete cascade,
  content         text not null,
  read_at         timestamptz,
  created_at      timestamptz default now()
);

create index messages_conv_idx on messages (conversation_id, created_at desc);

-- ========== REVIEWS ==========
create table reviews (
  id           uuid primary key default uuid_generate_v4(),
  product_id   uuid references products(id) on delete set null,
  reviewer_id  uuid not null references profiles(id) on delete cascade,
  seller_id    uuid not null references profiles(id) on delete cascade,
  rating       int not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz default now(),
  unique (product_id, reviewer_id)
);

create or replace function refresh_seller_rating() returns trigger as $$
begin
  update profiles
     set rating_avg   = (select coalesce(avg(rating),0) from reviews where seller_id = coalesce(new.seller_id, old.seller_id)),
         rating_count = (select count(*) from reviews where seller_id = coalesce(new.seller_id, old.seller_id))
   where id = coalesce(new.seller_id, old.seller_id);
  return coalesce(new, old);
end; $$ language plpgsql;

create trigger trg_refresh_rating
after insert or update or delete on reviews
for each row execute function refresh_seller_rating();

-- ========== RLS ==========
alter table profiles      enable row level security;
alter table products      enable row level security;
alter table conversations enable row level security;
alter table messages      enable row level security;
alter table reviews       enable row level security;

create policy "profiles_read"   on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);

create policy "products_read"   on products for select using (status = 'active' or seller_id = auth.uid());
create policy "products_insert" on products for insert with check (seller_id = auth.uid());
create policy "products_update" on products for update using (seller_id = auth.uid());
create policy "products_delete" on products for delete using (seller_id = auth.uid());

create policy "conv_read"   on conversations for select using (auth.uid() in (buyer_id, seller_id));
create policy "conv_insert" on conversations for insert with check (auth.uid() = buyer_id);

create policy "msg_read" on messages for select using (
  exists (select 1 from conversations c
          where c.id = messages.conversation_id
            and auth.uid() in (c.buyer_id, c.seller_id))
);
create policy "msg_insert" on messages for insert with check (
  sender_id = auth.uid() and
  exists (select 1 from conversations c
          where c.id = messages.conversation_id
            and auth.uid() in (c.buyer_id, c.seller_id))
);

create policy "rev_read"   on reviews for select using (true);
create policy "rev_insert" on reviews for insert with check (reviewer_id = auth.uid());
create policy "rev_update" on reviews for update using (reviewer_id = auth.uid());

-- ========== DISTANCE RPC ==========
create or replace function products_within_radius(
  lat double precision,
  lng double precision,
  radius_m int default 5000
) returns setof products language sql stable as $$
  select * from products
   where status = 'active'
     and geo is not null
     and ST_DWithin(geo, ST_MakePoint(lng, lat)::geography, radius_m)
   order by ST_Distance(geo, ST_MakePoint(lng, lat)::geography);
$$;
