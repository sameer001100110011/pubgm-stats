# Dropcard — PUBG Mobile After-Action Reports (v1)

## What's built so far
- Landing page (Next.js + Tailwind) explaining the product and how capture works
- `DogTag` component — the signature visual element for a player's stat card
- Database schema (`supabase/schema.sql`) — game-agnostic tables, ready for future games

## What's NOT built yet (next sessions)
- The actual OCR capture pipeline (reading numbers off a screenshot)
- The floating overlay button (this is a separate Android piece, not part of this web project)
- The dashboard page that shows a real captured report
- Supabase connection (env vars below are placeholders)

## Setup — do this once

1. **Push to GitHub**
   ```
   cd pubgm-stats
   git init
   git add .
   git commit -m "v1 scaffold: landing page + schema"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pubgm-stats.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com → New Project → Import your `pubgm-stats` GitHub repo
   - Vercel will detect it's Next.js automatically — no config needed
   - Click Deploy. You'll get a live URL in about a minute.

3. **Set up Supabase**
   - Go to your Supabase project → SQL Editor
   - Paste the contents of `supabase/schema.sql` and run it
   - Go to Project Settings → API — copy your `Project URL` and `anon public` key
   - In Vercel: Project Settings → Environment Variables, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Local development
```
npm install
npm run dev
```
Open http://localhost:3000
