# UniLoop — Setup Guide

A student marketplace for VNU-UEB students (extensible to any `*.edu.vn` school).

## Tech stack

- Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn/ui
- Supabase (Postgres + Auth + Storage + Realtime)
- Deployed on Vercel

## 1. Create a Supabase project (free tier)

1. Go to <https://supabase.com> → **New project**.
2. Copy these from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

## 2. Run the database migrations

Open the **SQL editor** in Supabase and run each file in `supabase/migrations/` **in order**:

1. `0001_init.sql` — tables, enums, RLS, PostGIS distance RPC
2. `0002_auth_guard.sql` — enforces `.edu.vn` email at the DB layer
3. `0003_storage.sql` — creates the `product-images` bucket + policies
4. `0004_search.sql` — full search RPC (keyword + filters + distance)
5. `0005_realtime.sql` — enables realtime on the `messages` table

Then run `supabase/seed.sql` to seed universities (UEB, VNU, HUST…) and faculties.

## 3. Configure Auth

Supabase Dashboard → **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000` (and your Vercel URL in production)
- Redirect URLs: `http://localhost:3000/api/auth/callback` (and the Vercel equivalent)

Supabase Dashboard → **Authentication → Providers → Email**:

- Enable "Confirm email".

## 4. Local development

```bash
cp .env.local.example .env.local
# paste your Supabase keys into .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com> → **New Project** → import your repo.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**.
5. After first deploy, copy the Vercel URL back into Supabase → **Auth → URL Configuration** (Site URL + Redirect URLs).

## Feature overview

| Feature | Where |
| --- | --- |
| `.edu.vn`-only auth | `src/lib/validators/auth.ts`, `0002_auth_guard.sql` |
| 3-step posting | `src/app/(marketplace)/products/new/` |
| Image upload | `src/components/products/ImageUploader.tsx` → `product-images` bucket |
| Search + filters + distance | `src/app/(marketplace)/search/page.tsx`, `0004_search.sql` |
| Realtime chat | `src/hooks/useRealtimeChat.ts`, `src/components/chat/ChatRoom.tsx` |
| Reviews (1-5 ★) | `src/components/reviews/*`, trigger in `0001_init.sql` |

## Notes

- The Navbar's `/profile/me` needs you to be logged in.
- To chat with a seller, open a product and click **Chat in-app** (creates a conversation).
- Non-`.edu.vn` signups are rejected at three layers: client form → callback route → DB trigger.
