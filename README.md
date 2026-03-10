# 🎁 GiftCircle — Group Gifting Platform

A full-stack group gifting MVP built with Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, and JWT auth. Deploy-ready for Vercel with Vercel Postgres (Neon).

## Features

- **Landing page** — Warm festive hero, feature highlights, and CTAs
- **Auth** — Signup / Login with JWT (stored in localStorage), `/api/auth/me` for session
- **Gift Circles (Groups)** — Create exchanges with name, description, date, and per-person budget
- **Member Invites** — Invite by email; each invite generates a unique accept link
- **Wishlists** — Each member adds gift ideas (title, description, URL, price) per group
- **Secret Claiming** — Claim gifts from others' lists; recipients only see "someone's getting this"
- **Payment Pledges** — Mock pledge amounts attached to each claim (no real payments)
- **Dashboard** — Overview of all groups, stats, and recently claimed gifts

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| ORM | Prisma (PostgreSQL) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Database | Vercel Postgres / Neon |
| Deploy | Vercel |

## Local Development

### 1. Clone and install

```bash
cd giftexchange
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` — your Postgres connection string (pooled, for Prisma)
- `DIRECT_URL` — your Postgres direct connection string (for migrations)
- `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
- `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` for local dev

### 3. Push schema to database

```bash
npm run db:push
```

### 4. Run dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### 1. Create a Vercel Postgres database

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open your project → **Storage** → **Create Database** → **Postgres (Neon)**
3. Copy the connection strings from the **`.env.local`** tab in the Vercel dashboard

### 2. Set environment variables in Vercel

In your Vercel project → **Settings** → **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | From Vercel Postgres (pooled URL) |
| `DIRECT_URL` | From Vercel Postgres (direct URL) |
| `JWT_SECRET` | A long random secret |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

### 3. Deploy

```bash
# Push to GitHub and connect to Vercel, or:
npx vercel --prod
```

Vercel will run `prisma generate && next build` automatically via the build script.

### 4. Run database migrations on first deploy

After the first deploy, run the schema push from your local machine (pointed at the production DB):

```bash
DATABASE_URL="your-production-url" DIRECT_URL="your-direct-url" npm run db:push
```

Or use Prisma migrations:

```bash
npx prisma migrate deploy
```

## Project Structure

```
giftexchange/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── invite/[token]/page.tsx     # Accept invite page
│   ├── dashboard/
│   │   ├── layout.tsx              # Auth guard + nav
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── groups/
│   │   │   ├── page.tsx            # All groups
│   │   │   ├── new/page.tsx        # Create group
│   │   │   └── [id]/page.tsx       # Group detail + wishlists
│   │   ├── wishlist/page.tsx       # My wishlist across groups
│   │   └── claimed/page.tsx        # Gifts I've claimed
│   └── api/
│       ├── auth/signup/route.ts
│       ├── auth/login/route.ts
│       ├── auth/me/route.ts
│       ├── groups/route.ts          # GET list, POST create
│       ├── groups/[id]/route.ts     # GET detail
│       ├── groups/[id]/invite/route.ts
│       ├── wishlist/route.ts        # GET/POST/DELETE items
│       ├── claims/route.ts          # GET/POST/DELETE claims
│       └── invite/[token]/route.ts  # GET info, POST accept
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # JWT helpers
│   └── api.ts                      # Response helpers
├── prisma/
│   └── schema.prisma
├── .env.example
└── README.md
```

## Notes

- **Payments are mocked** — pledge amounts are stored but no real payment processor is integrated
- **Invite links** — generated server-side and displayed in the UI; in production you'd email these
- **Auth tokens** — stored in `localStorage`; for production consider `httpOnly` cookies
