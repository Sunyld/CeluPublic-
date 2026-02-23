-- Make optional profile fields nullable for OAuth-friendly bootstrap.

alter table public.profiles
  alter column whatsapp drop not null,
  alter column whatsapp drop default;

alter table public.profiles
  alter column province drop not null,
  alter column province drop default;

-- city is already nullable in the original migration; no change required.

