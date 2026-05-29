# Amaka Fashion Atelier

> Crafting the Modern Nigerian Gentleman — bespoke luxury menswear from Abakaliki, Ebonyi State.

A mobile-first luxury menswear website for Amaka Fashion Atelier, featuring an AI style consultant ("Dapper"), a full admin content-management panel, customer measurement submission, lookbook gallery, and WhatsApp-based ordering.

**Live site:** https://amaka-fashion-atelier.vercel.app *(hosted on Netlify)*

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Admin Panel](#admin-panel)
- [The Dapper Chatbot](#the-dapper-chatbot)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Features

### Public site
- **Hero carousel** — auto-rotating editorial slides (Heritage, Senator Wear, Wedding) with a magazine-style visual column on desktop.
- **Collections** — six "houses" (Senator Wear, Suits, Shirts, Casual, Traditional, Corporate) with filtering, poetic intros, and a one-tap WhatsApp inquiry cart.
- **Lookbook** — responsive gallery with a pinch-to-zoom lightbox; shows real uploaded photos.
- **Featured section** — homepage hero image the owner can change from the admin panel.
- **Measurements** — customers submit their body measurements online; saved to the database (with a WhatsApp fallback).
- **Dapper** — an AI style consultant powered by Google Gemini, with a graceful keyword fallback.
- **WhatsApp-first ordering** — every call-to-action routes to WhatsApp (+234 913 127 2407).

### Admin panel (`/admin`)
- Mobile-first content management: **Images, Lookbook, Featured, Site Copy, Announcements, Testimonials, Templates**.
- **Operations:** Orders/Inquiries, Bookings, and Customer Accounts (with measurements).
- **Analytics** — visitor pulse, top pages, and referrers.
- **Multi-image upload** from phone gallery **and** direct camera capture.
- Discrete owner entry (no public link) via a 5-tap pattern on the footer copyright.

### Design & UX
- Refined luxury palette: deep emerald `#0B3D2E`, antique gold `#C9A961`, warm cream `#F5F0E6`, onyx `#0F0F0F`.
- Typography: **Cormorant Garamond** (display serif) + **Jost** (geometric sans).
- Mobile-first throughout — 44px+ touch targets, reduced-brightness cream for dark environments, and a reliable portal-based mobile menu.
- Security hardening: CSP headers, brute-force login lockout, `noindex` on admin routes, and Supabase Row Level Security.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database & Storage | Supabase |
| AI | Google Gemini (`@google/generative-ai`) |
| Analytics | Vercel Analytics |
| Package manager | pnpm |
| Hosting | Netlify |

---

## Getting Started (Local Development)

```bash
# 1. Install dependencies
pnpm install

# 2. Create your env file
cp .env.example .env.local
# (then fill in the values — see Environment Variables below)

# 3. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
pnpm dev      # start the dev server
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # run ESLint
```

> The site runs fine **without** any environment variables — the chatbot falls back to keyword matching and the admin panel falls back to local browser storage. Add the variables to unlock the AI and persistent database.

---

## Environment Variables

Set these in your hosting provider (Netlify → Site settings → Environment variables) and in `.env.local` for local development.

| Variable | Purpose | Required? |
|----------|---------|-----------|
| `ADMIN_PASSWORD_HASH` | SHA-256 hash of the admin password | For admin login |
| `SESSION_SECRET` | Random 32+ character string for signing session cookies | For admin login |
| `GEMINI_API_KEY` | Google Gemini API key — powers the Dapper chatbot | Optional (falls back to keywords) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | For database/storage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | For database/storage |

**Generate the admin password hash:**

```bash
echo -n "YourChosenPassword" | sha256sum
```

**Generate a session secret** — any random 32+ character string works.

> Note: `NEXT_PUBLIC_SUPABASE_ANON_KEY` is designed to be exposed to the browser. Vercel/Netlify may warn about the `NEXT_PUBLIC_` prefix — this is expected and safe for the **anon** key (never use the `service_role` key here). Protection comes from Supabase Row Level Security.

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. **Storage** → create a **public** bucket named `images`.
3. **SQL Editor** → create the tables (`images`, `lookbook`, `content`, `featured`, `inquiries`, `bookings`, `customers`).
4. **SQL Editor** → run the policies in [`supabase/rls-policies.sql`](./supabase/rls-policies.sql). This enables Row Level Security on all tables **and** the storage policies that allow image uploads.
5. Copy your **Project URL** and **anon key** (Settings → API) into the environment variables.

> If you skip the storage policies in step 4, image uploads will silently fail — the admin panel will surface an error message pointing you back to this file.

---

## Admin Panel

- **URL:** `/admin/login`
- **Discrete entry:** on any page, tap the footer copyright text 5 times within 3 seconds to jump straight to the login (no visible admin link exists on the public site).
- **Password:** whatever you hashed into `ADMIN_PASSWORD_HASH`.

The admin is gated server-side by middleware, brute-force-limited (5 attempts / 15 min), and excluded from search engines.

---

## The Dapper Chatbot

Dapper is the in-house AI style consultant.

- With `GEMINI_API_KEY` set, it uses **Gemini** with a rich brand system prompt (collections, fabrics, fitting journey, cultural voice) and multi-turn memory.
- Without the key, it falls back to a built-in **keyword intent** system so it always responds.
- All conversations can be handed off to a human stylist via WhatsApp with one tap.

---

## Deployment

The site is deployed on **Netlify** with continuous deployment from the `main` branch.

1. Connect the GitHub repo to Netlify.
2. Build command: `pnpm build` — Publish directory is handled by the Next.js runtime.
3. Add all [environment variables](#environment-variables) under **Site settings → Environment variables**.
4. Merging to `main` triggers an automatic redeploy.

After your first deploy, remember to run the Supabase SQL policies (see [Supabase Setup](#supabase-setup)) so uploads and persistence work.

---

## Project Structure

```
src/
├── app/
│   ├── (public pages)      # home, collections, lookbook, about, contact, measurements
│   ├── admin/              # admin dashboard + management pages
│   └── api/                # chat, measurements, tracking, admin auth endpoints
├── components/             # Navbar, Footer, HeroCarousel, ChatBot, FeaturedSection, etc.
├── lib/                    # supabase client, upload helpers, intents, session, animations
└── data/                   # collection catalog
supabase/
└── rls-policies.sql        # database + storage security policies
```

---

*Built for Amaka Fashion Atelier — where heritage meets distinction.*
