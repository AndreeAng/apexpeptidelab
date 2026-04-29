# Apex Peptide Lab — Admin Panel & User Accounts

## Overview

Add a full admin panel, user accounts (optional), and persistent order system to the existing Apex Peptide Lab e-commerce site. Products move from hardcoded data to Supabase. Orders are saved with sequential numbers and sent to both the admin dashboard and WhatsApp.

**Stack:** Next.js 16, Tailwind CSS 4, Supabase (PostgreSQL + Auth + Storage), Vercel  
**Cost:** $0 (free tiers of both services)

---

## 1. Database Schema (Supabase PostgreSQL)

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | = Supabase auth.users.id |
| role | TEXT | `user` or `admin` |
| name | TEXT | |
| last_name | TEXT | |
| phone | TEXT | WhatsApp number |
| email | TEXT | |
| addresses | JSONB | Array of `{label, address, city}` |
| created_at | TIMESTAMPTZ | Default now() |

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Default gen_random_uuid() |
| slug | TEXT (unique) | URL-friendly name |
| name | TEXT | |
| short_name | TEXT | |
| composition | TEXT | |
| dose_label | TEXT | |
| category | TEXT | |
| accent_color | TEXT | Hex color |
| description | TEXT | Short description |
| long_description | TEXT | Nullable |
| highlights | JSONB | Array of strings |
| benefits | JSONB | Array of `{icon, title, text}` |
| specs | JSONB | Array of `{label, value}` |
| storage | TEXT | |
| purity | TEXT | |
| price_bs | NUMERIC | Price in Bolivianos |
| image | TEXT | URL (Supabase Storage or path) |
| in_stock | BOOLEAN | Default true |
| is_offer | BOOLEAN | Default false |
| offer_price_bs | NUMERIC | Nullable, used when is_offer=true |
| faqs | JSONB | Array of `{q, a}` |
| sort_order | INT | For manual ordering |
| created_at | TIMESTAMPTZ | |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| order_number | TEXT (unique) | APX-0001, APX-0002... |
| user_id | UUID (nullable) | FK→profiles.id, null=guest |
| customer_name | TEXT | |
| customer_phone | TEXT | |
| customer_address | TEXT | |
| customer_city | TEXT | |
| notes | TEXT | Customer notes |
| admin_notes | TEXT | Internal notes (admin only) |
| items | JSONB | Array of `{productId, name, doseLabel, quantity, priceUnit, priceTotal}` |
| subtotal | NUMERIC | |
| discount | NUMERIC | Default 0 |
| coupon_code | TEXT | Nullable |
| total | NUMERIC | |
| status | TEXT | pending/confirmed/shipped/delivered/cancelled |
| created_at | TIMESTAMPTZ | |

### `coupons`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| code | TEXT (unique) | e.g. PRIMERA10 |
| type | TEXT | `percentage` or `fixed` |
| value | NUMERIC | 10 = 10% or Bs 10 |
| min_order | NUMERIC | Minimum order amount, nullable |
| max_uses | INT | Nullable = unlimited |
| used_count | INT | Default 0 |
| expires_at | TIMESTAMPTZ | Nullable |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | |

### `order_sequence`
| Column | Type | Notes |
|--------|------|-------|
| id | INT (PK) | Always 1 |
| last_number | INT | Incremented on each order |

Used via a Supabase RPC function `get_next_order_number()` that atomically increments and returns the next number.

---

## 2. Auth Architecture

### Supabase Auth
- Email + password authentication
- Same auth system for users and admin
- Role stored in `profiles.role`

### Middleware (`middleware.ts`)
- `/admin/*` routes: require auth + `role=admin`
- `/cuenta/*` routes: require auth (any role)
- All other routes: public

### Admin account
- Created manually in Supabase dashboard (one time)
- Email: the owner's email
- Role: `admin` set directly in profiles table

### User registration
- Public registration at `/cuenta/registro`
- Creates auth user + profile with `role=user`
- Optional — checkout works without account

---

## 3. Pages & Routes

### Public (existing, modified)
| Route | Change |
|-------|--------|
| `/` | Products loaded from Supabase instead of hardcoded |
| `/productos` | Products from Supabase, shows offer prices |
| `/productos/[slug]` | Product from Supabase |
| `/checkout` | Saves order to DB, generates order number, opens WhatsApp |

### Public (new)
| Route | Purpose |
|-------|---------|
| `/cuenta/login` | User login |
| `/cuenta/registro` | User registration |
| `/cuenta` | User dashboard: datos, direcciones, pedidos |
| `/cuenta/pedidos/[id]` | Order detail for user |

### Admin (new)
| Route | Purpose |
|-------|---------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard with metrics and charts |
| `/admin/pedidos` | Order list with search, filter, status management |
| `/admin/pedidos/[id]` | Order detail with status change and internal notes |
| `/admin/productos` | Product list with quick toggles (stock, offer) |
| `/admin/productos/nuevo` | Create new product |
| `/admin/productos/[id]` | Edit existing product |
| `/admin/cupones` | Coupon management CRUD |

---

## 4. Admin Dashboard (`/admin`)

### Top cards (4)
- **Ventas del mes**: Total Bs, % change vs previous month
- **Pedidos del mes**: Count, % change vs previous month
- **Ticket promedio**: Total / orders count
- **Producto más vendido**: Name + units sold this month

### Charts
- **Ventas por semana**: Line chart, last 12 weeks
- **Comparativa mensual**: Bar chart, current month vs previous
- **Pedidos por ciudad**: Horizontal bar chart, top 5
- **Ingresos proyectados**: Based on current month's daily average × remaining days

### Tables
- **Pedidos recientes**: Last 10 orders with status badges

### Actions
- **Exportar CSV**: Download orders data filtered by date range

### Notifications
- Badge on sidebar showing count of pending (unreviewed) orders
- Optional browser notification sound on new order

---

## 5. Order Management (`/admin/pedidos`)

### List view
- Table: order number, customer, city, total, status, date
- Search: by order number, customer name, or phone
- Filters: status dropdown, date range picker
- Sortable by date, total

### Detail view (`/admin/pedidos/[id]`)
- Customer info card
- Items list with prices
- Status change dropdown (pending → confirmed → shipped → delivered → cancelled)
- Internal notes textarea (admin only, not visible to customer)
- Link to user profile if registered user

### Status flow
```
pending → confirmed → shipped → delivered
    ↘ cancelled (from any status)
```

---

## 6. Product Management (`/admin/productos`)

### List view
- Grid or table of all products
- Quick toggles: in_stock (switch), is_offer (switch)
- Offer price inline edit when is_offer is on
- Sort by drag or sort_order
- Delete with confirmation dialog

### Create/Edit form (`/admin/productos/nuevo`, `/admin/productos/[id]`)
- Fields matching the products table schema
- Image upload to Supabase Storage
- Dynamic array editors for: highlights, benefits, specs, faqs
- Live preview of the product card
- Slug auto-generated from name (editable)

---

## 7. Coupon System (`/admin/cupones`)

### Admin CRUD
- List of all coupons with status (active/expired/depleted)
- Create/edit: code, type (% or fixed), value, min order, max uses, expiration
- Toggle active/inactive
- View usage count

### Checkout integration
- Optional coupon code field in checkout form
- Validates: exists, active, not expired, not maxed out, meets min order
- Shows discount applied before total
- Increments used_count on successful order

---

## 8. Checkout Flow (modified)

### Current → New
1. Customer fills form (name, phone, address, city, notes)
2. **NEW**: Optional coupon code field
3. **NEW**: If logged in, data pre-filled from profile, address selectable
4. **NEW**: On submit → save order to Supabase with next order number (APX-XXXX)
5. Open WhatsApp with message (now includes order number)
6. **NEW**: Order appears in admin panel instantly

### WhatsApp message format (updated)
```
────────────────────
  APEX PEPTIDE LAB
  Orden #APX-0042
────────────────────

DATOS DEL CLIENTE
Nombre: Juan Pérez
Tel: 72201700
Ciudad: Cochabamba
Dirección: Av. América 123

────────────────────
DETALLE DEL PEDIDO
────────────────────

• GLP-3 RT (40mg) x1 — Bs 1.800,00
• GHK-Cu (50mg) x2 — Bs 1.400,00

────────────────────
Subtotal: Bs 3.200,00
Descuento (PRIMERA10): -Bs 320,00
TOTAL: Bs 2.880,00
────────────────────

apexpeptidelab.com
```

---

## 9. User Accounts (`/cuenta`)

### Registration (`/cuenta/registro`)
- Fields: name, last name, email, password, phone (optional)
- Creates Supabase auth user + profile row

### Login (`/cuenta/login`)
- Email + password
- Redirect to `/cuenta` on success

### Profile (`/cuenta`)
- **Mis datos**: Edit name, phone, email
- **Mis direcciones**: Add/edit/delete addresses (label, address, city)
- **Mis pedidos**: List with order number, date, total, status
- **Detalle de pedido** (`/cuenta/pedidos/[id]`): Items, status timeline, option to re-order

### Guest order claiming
- If a user registers with a phone number that matches existing guest orders, those orders are linked to their account automatically

---

## 10. WhatsApp Floating Button

- Fixed bottom-right corner on all public pages
- Green WhatsApp icon with subtle pulse animation
- Opens `wa.me/59172201700` with pre-filled greeting
- Hidden on `/admin/*` routes
- Z-index above content, below modals/cart

---

## 11. Product Image Upload

- Supabase Storage bucket: `product-images`
- Public bucket (images are public URLs)
- Upload from admin product form
- Accept: jpg, png, webp
- Max size: 2MB
- Auto-generates URL stored in product.image field

---

## 12. Data Migration

- Seed script to migrate current hardcoded products from `products.ts` to Supabase
- Run once during initial setup
- After migration, `products.ts` becomes a type definition file only

---

## 13. Design System (Admin)

- Same dark navy theme as public site
- Sidebar navigation (collapsible on mobile)
- Cards with `bg-surface-raised` + `border-border-subtle`
- Lime accent for active states and primary actions
- Status badges: pending=yellow, confirmed=blue, shipped=purple, delivered=green, cancelled=red
- Charts: Recharts library with lime/white/accent colors on dark background
- Tables: striped rows with hover highlight
- Forms: same input styles as existing checkout/contact forms

---

## 14. Tech Additions

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Database client |
| `@supabase/ssr` | Server-side auth helpers for Next.js |
| `recharts` | Dashboard charts |
| `date-fns` | Date formatting and calculations |

No additional packages needed — existing form handling (react-hook-form + zod), UI (radix, lucide), and animation (framer-motion) are reused.
