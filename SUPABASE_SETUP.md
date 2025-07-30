# Supabase Database Setup

## Required SQL Schema

Run the following SQL commands in your Supabase SQL editor to set up the database:

```sql
-- enable UUID generation
create extension if not exists "uuid-ossp";

-- reports table
create table reports (
  id              uuid     primary key default uuid_generate_v4(),
  event_id        text     not null,
  first_name      text,
  last_name       text,
  dob_hash        text     not null,
  ssn4_hash       text     not null,
  last_known_location text not null,
  status          text     not null default 'missing',
  reported_by     text,
  timestamp       timestamptz default now()
);

-- Add indexes for better performance
create index idx_reports_event_id on reports(event_id);
create index idx_reports_status on reports(status);
create index idx_reports_dob_hash on reports(dob_hash);
create index idx_reports_ssn4_hash on reports(ssn4_hash);
```

## Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase project URL and anon key:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

## Security Notes

- `dob_hash` = SHA256(DOB) - Date of birth is hashed for privacy
- `ssn4_hash` = SHA256(last 4 SSN) - Last 4 digits of SSN are hashed
- Names are masked in display (first character + ***)
- All data is publicly accessible (no authentication required)
- Data is scoped per disaster event using `event_id`

## Row Level Security (Optional)

For additional security, you can enable RLS on the reports table:

```sql
-- Enable RLS
alter table reports enable row level security;

-- Allow public read access
create policy "Public read access" on reports
  for select using (true);

-- Allow public insert access
create policy "Public insert access" on reports
  for insert with check (true);

-- Allow public update access (for status changes)
create policy "Public update access" on reports
  for update using (true);
```

