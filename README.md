# NEMIDEEP weaves — B2B Wholesale Website

A full-stack B2B wholesale website for NEMIDEEP weaves, a textile manufacturing and wholesale company. Trade buyers (tailors, garment makers, designers, retailers) can browse a fabric catalog and submit enquiries. Prices are never displayed — the owner calls buyers personally to quote.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand
- **Routing**: React Router v6

## Features

**Public site**: Home, About, Contact, full product catalog with filters, product detail with image lightbox.

**Buyer accounts**: Email-verified sign-up with company details, enquiry list (cart-like), enquiry submission, dashboard with enquiry history, profile editing.

**Admin dashboard** (`/admin`): Product management (add/edit/archive/bulk CSV import), enquiry management (status updates, internal notes, one-click call), buyer management (view details, suspend accounts), category management.

## Setup

### 1. Supabase project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. This creates all tables, RLS policies, and seeds 3 categories + 6 sample products

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your values:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |
| `VITE_ADMIN_EMAIL` | The email address you'll use to log in as admin |

### 3. Admin email configuration

The admin email must be registered as a Supabase auth user. The easiest way:

1. Set `VITE_ADMIN_EMAIL` in your `.env`
2. Go to **Supabase Dashboard → Authentication → Users → Add user**
3. Create the user with the same email

The RLS policies in `schema.sql` use `app.admin_email` as a Postgres setting. To enable this, run in SQL Editor:

```sql
alter database postgres set "app.admin_email" = 'owner@example.com';
```

Replace with your actual admin email.

### 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Deployment (Vercel / Netlify)

1. Push to GitHub
2. Connect repo in Vercel/Netlify
3. Add the three environment variables in the platform's settings
4. Deploy — the build command is `npm run build`, output dir is `dist`

## CSV Product Import

Use the **Admin → Products → Import CSV** button. Download the template first with **CSV Template**. Required columns:

| Column | Required | Example |
|---|---|---|
| `name` | Yes | Cotton Shirting |
| `description` | No | Fine cotton fabric |
| `category_name` | No | Cotton (must match an existing category name) |
| `fabric_composition` | No | 100% Cotton |
| `weave_type` | No | Plain weave |
| `width` | No | 44 inches |
| `gsm` | No | 120 |

Images for CSV-imported products can be added by editing each product in the admin.

## Project structure

```
src/
├── components/
│   ├── layout/     Navbar, Footer, PublicLayout, AdminLayout
│   └── ui/         ProtectedRoute, Spinner, StatusBadge
├── pages/
│   ├── public/     Home, About, Contact, Catalog, ProductDetail, Login, SignUp
│   ├── buyer/      Dashboard, Enquiry, EnquirySuccess, Profile
│   └── admin/      Overview, Products, Enquiries, Buyers, Categories
├── store/          authStore (Zustand), cartStore (Zustand + persist)
├── lib/            supabase.ts, utils.ts
└── types/          database.ts (typed Supabase schema)
supabase/
└── schema.sql      Full DB schema + RLS policies + seed data
```
