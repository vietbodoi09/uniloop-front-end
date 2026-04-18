-- Seed Vietnamese universities. UEB is the primary target.
insert into universities (name, short_name, email_domain) values
  ('VNU University of Economics and Business', 'UEB',  'ueb.edu.vn'),
  ('Vietnam National University, Hanoi',       'VNU',  'vnu.edu.vn'),
  ('Hanoi University of Science and Technology','HUST', 'hust.edu.vn'),
  ('FPT University',                           'FPT',  'fpt.edu.vn'),
  ('Foreign Trade University',                 'FTU',  'ftu.edu.vn')
on conflict (short_name) do nothing;

-- Seed a couple of UEB faculties
insert into faculties (university_id, name)
select id, f.name from universities u
cross join (values
  ('Kinh tế Phát triển'),
  ('Kinh tế Quốc tế'),
  ('Quản trị Kinh doanh'),
  ('Tài chính - Ngân hàng'),
  ('Kế toán - Kiểm toán')
) as f(name)
where u.short_name = 'UEB'
on conflict do nothing;
