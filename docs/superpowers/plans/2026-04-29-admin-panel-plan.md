# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add admin panel, order system, user accounts, coupons, and dashboard to Apex Peptide Lab e-commerce site.

**Architecture:** Supabase (PostgreSQL + Auth + Storage) as backend, Next.js 16 App Router for all pages. Products migrate from hardcoded TypeScript to Supabase. Orders saved to DB with sequential numbers. Admin panel with same dark navy design system.

**Tech Stack:** Next.js 16, Tailwind CSS 4, Supabase (@supabase/supabase-js + @supabase/ssr), Recharts, date-fns, existing react-hook-form + zod + framer-motion + radix-ui + lucide-react.

**Spec:** `docs/superpowers/specs/2026-04-29-admin-panel-design.md`

---

## Phase 1: Supabase Foundation

### Task 1: Install dependencies and configure Supabase client

**Files:**
- Modify: `package.json`
- Create: `src/lib/supabase/client.ts` (browser client)
- Create: `src/lib/supabase/server.ts` (server client)
- Create: `src/lib/supabase/middleware.ts` (middleware helper)
- Modify: `.env.local` (add Supabase keys)

- [ ] Install packages: `npm install @supabase/supabase-js @supabase/ssr recharts date-fns`
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Create browser client (`createBrowserClient`)
- [ ] Create server client (`createServerClient` using cookies)
- [ ] Create middleware helper for session refresh
- [ ] Commit: "feat: add Supabase client configuration"

### Task 2: Database schema (SQL executed in Supabase dashboard)

**Files:**
- Create: `supabase/schema.sql` (reference SQL, run in Supabase SQL editor)

- [ ] Write complete SQL for all tables: profiles, products, orders, coupons, order_sequence
- [ ] Write RPC function `get_next_order_number()` for atomic sequence increment
- [ ] Write trigger `on_auth_user_created` to auto-create profile row
- [ ] Write Row Level Security (RLS) policies for each table
- [ ] Document: instructions to run SQL in Supabase dashboard
- [ ] Commit: "feat: add database schema SQL"

### Task 3: Auth middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] Create Next.js middleware that refreshes Supabase session
- [ ] Protect `/admin/*` routes (require auth + admin role)
- [ ] Protect `/cuenta/*` routes (require auth)
- [ ] Allow all other routes as public
- [ ] Commit: "feat: add auth middleware"

### Task 4: Database types and shared utilities

**Files:**
- Create: `src/lib/supabase/types.ts` (TypeScript types matching DB schema)
- Modify: `src/data/products.ts` (keep Product type, add DB mapping)

- [ ] Define TypeScript types for all tables (DbProduct, DbOrder, DbCoupon, DbProfile)
- [ ] Create mapper functions: dbProductToProduct(), productToDbProduct()
- [ ] Keep existing Product type for frontend compatibility
- [ ] Commit: "feat: add database types and mappers"

---

## Phase 2: Products Migration

### Task 5: Product data access layer

**Files:**
- Create: `src/lib/dal/products.ts` (data access functions)

- [ ] `getProducts()` — fetch all products, ordered by sort_order
- [ ] `getProductBySlug(slug)` — fetch single product
- [ ] `createProduct(data)` — insert product
- [ ] `updateProduct(id, data)` — update product
- [ ] `deleteProduct(id)` — delete product
- [ ] `toggleStock(id, inStock)` — quick toggle
- [ ] `toggleOffer(id, isOffer, offerPrice?)` — quick toggle
- [ ] Commit: "feat: add product data access layer"

### Task 6: Seed script to migrate hardcoded products

**Files:**
- Create: `scripts/seed-products.ts`

- [ ] Script reads current hardcoded products from products.ts
- [ ] Maps to DB format and inserts into Supabase
- [ ] Run with `npx tsx scripts/seed-products.ts`
- [ ] Commit: "feat: add product seed script"

### Task 7: Update public pages to use Supabase

**Files:**
- Modify: `src/app/page.tsx` — fetch products from DB
- Modify: `src/app/productos/page.tsx` — fetch from DB
- Modify: `src/app/productos/[slug]/page.tsx` — fetch from DB
- Modify: `src/components/search/SearchOverlay.tsx` — fetch from DB
- Modify: `src/data/products.ts` — keep only types, remove hardcoded array

- [ ] Update home page to fetch products server-side
- [ ] Update catalog page to fetch from DB
- [ ] Update product detail page to fetch from DB
- [ ] Update search to fetch products
- [ ] Update generateStaticParams to use DB slugs (or switch to dynamic)
- [ ] Remove hardcoded product array, keep only type exports
- [ ] Test all public pages still work
- [ ] Commit: "feat: migrate products from hardcoded to Supabase"

---

## Phase 3: Order System

### Task 8: Order data access layer

**Files:**
- Create: `src/lib/dal/orders.ts`

- [ ] `createOrder(data)` — insert order, call get_next_order_number(), return order with number
- [ ] `getOrders(filters?)` — list with search/filter/sort/pagination
- [ ] `getOrderById(id)` — single order
- [ ] `getOrdersByUserId(userId)` — user's orders
- [ ] `updateOrderStatus(id, status)` — change status
- [ ] `updateAdminNotes(id, notes)` — add internal notes
- [ ] `getOrderStats(month, year)` — aggregate stats for dashboard
- [ ] Commit: "feat: add order data access layer"

### Task 9: Modify checkout to save orders

**Files:**
- Modify: `src/app/checkout/page.tsx`
- Create: `src/app/checkout/actions.ts` (server action to create order)
- Modify: `src/lib/whatsapp.ts` (add order number to message)

- [ ] Create server action `createOrderAction(formData)` that saves to DB and returns order number
- [ ] Update checkout form to call server action before opening WhatsApp
- [ ] Add coupon code field to checkout form (validates via server action)
- [ ] Update WhatsApp message format to include order number and discount
- [ ] If user is logged in, pre-fill form data and link order to user_id
- [ ] Show order confirmation with order number after submit
- [ ] Commit: "feat: checkout saves orders to database with order numbers"

---

## Phase 4: Admin Panel

### Task 10: Admin layout and login

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/layout.tsx` (sidebar layout)
- Create: `src/components/admin/Sidebar.tsx`
- Create: `src/components/admin/AdminHeader.tsx`
- Create: `src/app/admin/login/actions.ts` (login server action)

- [ ] Admin login page with email/password form (same dark theme)
- [ ] Server action for login via Supabase Auth
- [ ] Admin layout with collapsible sidebar navigation
- [ ] Sidebar items: Dashboard, Pedidos (with badge), Productos, Cupones
- [ ] Admin header with user info and logout
- [ ] Mobile responsive (sidebar becomes drawer)
- [ ] Commit: "feat: add admin login and layout"

### Task 11: Admin dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/dashboard/StatCard.tsx`
- Create: `src/components/admin/dashboard/SalesChart.tsx`
- Create: `src/components/admin/dashboard/CityChart.tsx`
- Create: `src/components/admin/dashboard/RecentOrders.tsx`
- Create: `src/lib/dal/analytics.ts`

- [ ] Analytics DAL: monthly stats, weekly sales, city breakdown, projections
- [ ] StatCard component (value, label, change percentage, icon)
- [ ] 4 top cards: ventas del mes, pedidos, ticket promedio, producto top
- [ ] Line chart: ventas por semana (last 12 weeks) with Recharts
- [ ] Bar chart: comparativa mes actual vs anterior
- [ ] Horizontal bar: pedidos por ciudad top 5
- [ ] Projected revenue card
- [ ] Recent orders table (last 10)
- [ ] CSV export button with date range
- [ ] Commit: "feat: add admin dashboard with charts and metrics"

### Task 12: Admin product management

**Files:**
- Create: `src/app/admin/productos/page.tsx`
- Create: `src/app/admin/productos/nuevo/page.tsx`
- Create: `src/app/admin/productos/[id]/page.tsx`
- Create: `src/components/admin/products/ProductForm.tsx`
- Create: `src/components/admin/products/ProductTable.tsx`
- Create: `src/app/admin/productos/actions.ts`
- Create: `src/lib/supabase/storage.ts` (image upload helper)

- [ ] Product list table with name, price, stock toggle, offer toggle, actions
- [ ] Quick inline offer price edit
- [ ] Delete with confirmation dialog
- [ ] Product form component (shared between create/edit)
- [ ] All fields: name, slug (auto-gen), composition, category, price, description, etc.
- [ ] Dynamic array editors for highlights, benefits, specs, FAQs
- [ ] Image upload to Supabase Storage
- [ ] Server actions for create/update/delete/toggle
- [ ] Commit: "feat: add admin product CRUD with image upload"

### Task 13: Admin order management

**Files:**
- Create: `src/app/admin/pedidos/page.tsx`
- Create: `src/app/admin/pedidos/[id]/page.tsx`
- Create: `src/components/admin/orders/OrderTable.tsx`
- Create: `src/components/admin/orders/OrderDetail.tsx`
- Create: `src/components/admin/orders/StatusBadge.tsx`
- Create: `src/app/admin/pedidos/actions.ts`

- [ ] Order list with table: order#, customer, city, total, status badge, date
- [ ] Search by order number, name, or phone
- [ ] Filter by status and date range
- [ ] Order detail page: customer info, items, totals
- [ ] Status change dropdown with server action
- [ ] Admin notes textarea with save
- [ ] Link to user profile if registered
- [ ] Commit: "feat: add admin order management"

### Task 14: Admin coupon management

**Files:**
- Create: `src/app/admin/cupones/page.tsx`
- Create: `src/components/admin/coupons/CouponForm.tsx`
- Create: `src/components/admin/coupons/CouponTable.tsx`
- Create: `src/app/admin/cupones/actions.ts`
- Create: `src/lib/dal/coupons.ts`

- [ ] Coupon DAL: CRUD + validate + increment usage
- [ ] Coupon list table with code, type, value, uses, status, actions
- [ ] Create/edit modal or page
- [ ] Toggle active/inactive
- [ ] Status indicators: active (green), expired (red), depleted (yellow)
- [ ] Server actions for create/update/delete/toggle
- [ ] Commit: "feat: add admin coupon management"

---

## Phase 5: User Accounts

### Task 15: User auth pages

**Files:**
- Create: `src/app/cuenta/login/page.tsx`
- Create: `src/app/cuenta/registro/page.tsx`
- Create: `src/app/cuenta/login/actions.ts`
- Create: `src/app/cuenta/registro/actions.ts`

- [ ] Login page with email/password form
- [ ] Registration page with name, lastName, email, password, phone (optional)
- [ ] Server actions for login and signup (creates auth user + profile)
- [ ] Redirect to /cuenta on success
- [ ] Error handling for existing email, weak password, etc.
- [ ] Commit: "feat: add user login and registration"

### Task 16: User profile and order history

**Files:**
- Create: `src/app/cuenta/page.tsx`
- Create: `src/app/cuenta/layout.tsx`
- Create: `src/app/cuenta/pedidos/[id]/page.tsx`
- Create: `src/components/cuenta/ProfileForm.tsx`
- Create: `src/components/cuenta/AddressManager.tsx`
- Create: `src/components/cuenta/OrderHistory.tsx`
- Create: `src/app/cuenta/actions.ts`
- Create: `src/lib/dal/profiles.ts`

- [ ] Profile DAL: getProfile, updateProfile, updateAddresses
- [ ] Cuenta layout with tab navigation (Datos, Direcciones, Pedidos)
- [ ] Profile form: edit name, lastName, phone, email
- [ ] Address manager: add/edit/delete addresses with label, address, city
- [ ] Order history list: order#, date, total, status
- [ ] Order detail page: items, status timeline, re-order button
- [ ] Guest order claiming: on register, link orders matching phone number
- [ ] Commit: "feat: add user profile and order history"

### Task 17: Update header with user menu

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Create: `src/components/layout/UserMenu.tsx`

- [ ] Add user icon to header (next to cart)
- [ ] If logged in: dropdown with "Mi cuenta" and "Cerrar sesión"
- [ ] If not logged in: link to /cuenta/login
- [ ] Commit: "feat: add user menu to header"

---

## Phase 6: Polish

### Task 18: WhatsApp floating button

**Files:**
- Create: `src/components/layout/WhatsAppButton.tsx`
- Modify: `src/app/layout.tsx`

- [ ] Fixed bottom-right button with WhatsApp icon
- [ ] Subtle pulse animation
- [ ] Opens wa.me/59172201700 with greeting
- [ ] Hidden on /admin/* routes
- [ ] Proper z-index (above content, below modals)
- [ ] Commit: "feat: add WhatsApp floating button"

### Task 19: Admin notifications

**Files:**
- Modify: `src/components/admin/Sidebar.tsx`
- Create: `src/lib/dal/notifications.ts`

- [ ] Query count of pending orders
- [ ] Show red badge on "Pedidos" sidebar item
- [ ] Refresh count periodically (every 30s with setInterval or Supabase realtime)
- [ ] Commit: "feat: add admin order notifications"

### Task 20: Checkout improvements for logged-in users

**Files:**
- Modify: `src/app/checkout/page.tsx`

- [ ] If user is logged in, pre-fill name, phone from profile
- [ ] Show saved addresses as selectable options
- [ ] Still allow editing all fields
- [ ] Commit: "feat: pre-fill checkout for logged-in users"

### Task 21: Final integration test and cleanup

- [ ] Test complete flow: browse → add to cart → checkout → order saved → appears in admin
- [ ] Test admin: login → view dashboard → manage products → manage orders → manage coupons
- [ ] Test user: register → login → view profile → view order history
- [ ] Test coupon flow: create coupon → apply at checkout → discount applied
- [ ] Remove any unused hardcoded product data
- [ ] Verify responsive design on all new pages
- [ ] Commit: "chore: final integration cleanup"
