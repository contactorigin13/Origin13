# Origin 13 — content backup (exported 26 Oct 2026)

This folder holds everything saved through the Admin page, so the site can run on your own database with no Lovable credits.

| File | What it holds |
|---|---|
| `schema.sql` | Tables, security rules and storage bucket (`content`, `projects`, `site_visibility`, `user_roles`, `portfolio-assets`) |
| `seed.sql` | All saved content: page text, partner logos list, team, portfolio projects (8), publish/unpublish switches (347 + 8 + 3 rows) |
| `*.json` | The same data as readable JSON |
| `storage/` | Uploaded files from the `portfolio-assets` bucket (covers, home slides, team photos) — keep the same folder paths |

All built-in photos and logos are already in `public/assets/hosted/`, and every reference now points there (no Lovable hosting needed).

## Run locally
1. Create a free Supabase project (or run `supabase start` locally).
2. In its SQL editor run `schema.sql`, then `seed.sql`.
3. Create a storage bucket named `portfolio-assets` (private) if `schema.sql` didn't, and upload the contents of `storage/` keeping the folder names.
4. Copy `.env.example` to `.env` and fill in your project URL and publishable key.
5. `npm install` (or `bun install`), then `npm run dev`.
6. Sign up on `/admin`, then make yourself admin in the SQL editor:
   `insert into public.user_roles (user_id, role) values ('<your user id>', 'admin');`

Admin accounts and passwords are not exported (they can't be copied securely); you create a new one in step 6.
