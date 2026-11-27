create table movements (
  id bigserial primary key,
  mold_number text not null,
  direction text not null check (direction in ('in', 'out')),
  occurred_at timestamptz not null,
  truck_plate text not null,
  created_at timestamptz not null default now()
);

create index movements_occurred_at_idx on movements (occurred_at desc);
create index movements_mold_number_idx on movements (mold_number);