create table users (
  id serial primary key,
  username text not null unique,
  password_hash text not null,
  role text not null check (role in ('warehouse', 'viewer')),
  created_at timestamptz not null default now()
);

insert into users (username, password_hash, role) values
  ('warehouse', '$2b$10$CBlEn4NioCovcxh03w7IEuyU6OEawUXj0bYUremUhyzHfOoo5LzdG', 'warehouse'),
  ('supervisor', '$2b$10$fOyykS1d31fTTfEbqpAgPOE5VvlNnRROjdboqZB/TsSkZXmj5/3FO', 'viewer')
on conflict (username) do nothing;