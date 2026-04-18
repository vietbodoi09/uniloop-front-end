-- Reject non-edu.vn at the DB layer (last line of defense)
create or replace function enforce_edu_vn_email()
returns trigger language plpgsql as $$
begin
  if new.email !~* '^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.edu\.vn$' then
    raise exception 'Registration restricted to *.edu.vn addresses';
  end if;
  return new;
end; $$;

create trigger trg_edu_vn_on_auth_users
before insert on auth.users
for each row execute function enforce_edu_vn_email();

create trigger trg_edu_vn_on_profiles
before insert or update of email on profiles
for each row execute function enforce_edu_vn_email();
