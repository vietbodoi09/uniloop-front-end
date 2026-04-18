-- Full search RPC combining keyword + filters + optional distance
create or replace function search_products(
  q              text      default null,
  p_university   uuid      default null,
  p_faculty      uuid      default null,
  p_subject      uuid      default null,
  p_listing_type listing_type default null,
  p_min_price    numeric   default null,
  p_max_price    numeric   default null,
  p_lat          double precision default null,
  p_lng          double precision default null,
  p_radius_m     int       default null,
  p_limit        int       default 40,
  p_offset       int       default 0
)
returns table (
  id uuid, title text, description text, images text[],
  listing_type listing_type, condition item_condition,
  price numeric, location_label text,
  distance_m double precision, created_at timestamptz
) language sql stable as $$
  select
    p.id, p.title, p.description, p.images,
    p.listing_type, p.condition, p.price, p.location_label,
    case
      when p_lat is not null and p_lng is not null and p.geo is not null
        then ST_Distance(p.geo, ST_MakePoint(p_lng, p_lat)::geography)
      else null
    end as distance_m,
    p.created_at
  from products p
  left join subjects s on s.id = p.subject_id
  where p.status = 'active'
    and (q is null or p.title ilike '%'||q||'%' or p.description ilike '%'||q||'%')
    and (p_university   is null or p.university_id = p_university)
    and (p_faculty      is null or s.faculty_id    = p_faculty)
    and (p_subject      is null or p.subject_id    = p_subject)
    and (p_listing_type is null or p.listing_type  = p_listing_type)
    and (p_min_price    is null or p.price >= p_min_price)
    and (p_max_price    is null or p.price <= p_max_price)
    and (
      p_radius_m is null
      or p_lat is null or p_lng is null
      or (p.geo is not null and ST_DWithin(p.geo, ST_MakePoint(p_lng, p_lat)::geography, p_radius_m))
    )
  order by
    case when p_lat is not null and p_lng is not null then ST_Distance(p.geo, ST_MakePoint(p_lng, p_lat)::geography) end nulls last,
    p.created_at desc
  limit p_limit offset p_offset;
$$;
