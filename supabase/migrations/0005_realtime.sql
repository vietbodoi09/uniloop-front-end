alter publication supabase_realtime add table messages;
alter table messages replica identity full;
