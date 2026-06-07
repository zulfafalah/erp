# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**erp_falah** is a web-based Enterprise Resource Planning (ERP) system built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS 4**. The application covers core business modules: purchasing, sales, inventory, accounting, and finance. The frontend connects to a backend Django API at `http://localhost:8000` (configurable via `API_URL` env var).

## Development Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: Material Symbols Outlined (loaded via Google Fonts)
- **Testing**: Playwright (E2E) with persistent auth state
- **Linting**: ESLint 9 with Next.js & TypeScript configs

## Commands

### Development
```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Testing
```bash
npm run test:e2e                    # Run all E2E tests (Chromium only, sequential)
npm run test:e2e:ui                 # Run tests with interactive Playwright UI
npm run test:e2e:headed             # Run tests with visible browser window
npm run test:e2e:debug              # Run tests in debug mode with inspector
npm run test:e2e:report             # Show HTML report of last test run
```

**E2E Configuration**: Tests run sequentially (workers: 1) to prevent auth state race conditions. Auth setup is stored in `.auth/user.json` and reused across test runs. Credentials from `.env.test.local` (TEST_USERNAME, TEST_PASSWORD).

## Architecture & Project Structure

### Core Layout
```
app/
├── api/                          # Route handlers (proxy to backend)
│   ├── auth/                     # Login, logout, token refresh
│   ├── master-data/              # GET/POST master data entities
│   ├── accounting/               # Chart of accounts, journals
│   └── purchase/                 # Purchase orders, receipts, invoices
├── components/                   # Shared React components
├── config/                       # menuConfig.ts (module navigation)
├── context/                      # AuthContext, ActiveMenuContext
├── lib/                          # Utilities: auth, apiClient, types
├── [module]/                     # Feature modules (purchase, sales, inventory, etc.)
│   ├── [entity]/                 # List page + detail pages
│   │   ├── page.tsx              # List view
│   │   ├── [id]/page.tsx         # Detail/edit view
│   │   └── constants.ts          # FILTER_FIELDS, columns, types
│   └── ...
└── middleware.ts                 # JWT auth + route protection
```

### Key Directories
- **app/purchase/**: Purchase orders, receipts, invoices, returns
- **app/sales/**: Sales orders, invoices, returns, commissions
- **app/inventory/**: Stock adjustments, warehouse transfers
- **app/accounting/**: Chart of accounts, general journal, monthly postings
- **app/finance/**: Accounts payable/receivable, sales commissions
- **app/master-data/**: Products, customers, suppliers, warehouses, currencies, etc.
- **app/settings/**: System configuration, users, permissions
- **app/reports/**: Data reports (purchase, sales, accounting, inventory)

## Auth & API Layer

### Authentication Flow
1. **Login**: User submits credentials → `/api/auth/login` (Route Handler) → forwards to backend `/api/auth/token/` → sets `access_token` and `refresh_token` as httpOnly cookies
2. **Token Management**: 
   - Access token expires in 1 hour
   - Refresh token expires in 7 days
   - Middleware checks JWT expiry (with 30-sec buffer) and blocks unauthorized requests
3. **Route Protection**: `middleware.ts` intercepts all requests, checks `access_token` cookie, redirects to `/login` if expired/missing
4. **Token Refresh**: `apiFetch()` automatically refreshes expired tokens before API calls

### apiFetch() Server-Side Wrapper
Located in `app/lib/apiClient.ts`. Used in Route Handlers and Server Components:
```typescript
// Automatically injects Authorization: Bearer <token>
// Handles 401 responses with automatic token refresh
// Throws ApiError on failure
const data = await apiFetch<TypeName>("/api/endpoint/", { method: "POST", body: {...} });
```

### Route Handlers (API Proxy)
All Route Handlers proxy requests to backend at `${API_BASE_URL}` (default: http://localhost:8000). Typical pattern:
- GET: Forward params directly to backend
- POST/PUT/DELETE: Forward JSON body to backend
- All handlers set response headers via `buildAuthCookieHeaders()` or `buildClearCookieHeaders()`

## Page Architecture & Conventions

### Page Conventions (Reference: `.agents/skills/erp-page-conventions/`)
All pages follow a standardized structure for consistency:

**Root Layout**: Every page wraps content in:
```typescript
<div className="bg-background-light text-slate-900 font-sans min-h-screen flex flex-col overflow-hidden pb-8">
  <Navbar />
  <main className="flex-1 flex overflow-hidden">
    <Sidebar />
    <section className="flex-1 flex flex-col bg-background-light overflow-hidden">
      {/* page content */}
    </section>
  </main>
  <StatusBar />
</div>
```

**List Pages** (`/[module]/[entity]/page.tsx`):
- Title + description
- MultiFilter component for server-side filtering
- Dual-mode DataTable (mobile cards + desktop table)
- Pagination
- Delete confirmation modal
- Define `FILTER_FIELDS` constant with field metadata
- Define `buildColumns()` and render functions

**Detail Pages** (`/[module]/[entity]/[id]/page.tsx`):
- Header with back button, status badge, action buttons
- Tab system (e.g., "Ringkasan", "Item", "Lampiran")
- Form cards with FormInput, FormSelect, FormTextarea
- Cost summary sidebar
- Form submission via API route

### Key Components
- **Navbar**: Top navigation, user menu, logout
- **Sidebar**: Collapsible navigation with module sections
- **DataTable**: Reusable table/card dual-view with optional loading skeletons
- **FormField**: Wrapper for label + input/select/textarea
- **FormInput, FormSelect, FormTextarea**: Input components with Tailwind styling
- **MultiFilter**: Advanced filter UI with operators (contains, equals, starts_with, etc.)
- **Modal, Button, StatusBar**: Utility UI components

### Styling Rules
- **Colors**: Primary accent (`primary` / `#137fec`), slate grays for secondary
- **Spacing**: Mobile-first with `md:` breakpoints
- **Responsive**: Full-width mobile, sidebar collapses, tables → cards on mobile
- **Icons**: Material Symbols Outlined (class: `material-symbols-outlined`)
- **Status Badges**: Color-coded (Approved = green, Pending = yellow, Draft = slate, etc.)

## Data Patterns

### Types (app/lib/types.ts)
```typescript
interface ApiSuccessResponse<T> { ok: true; data: T; message?: string; }
interface ApiErrorResponse { ok: false; message: string; status: number; }
interface PaginatedResponse<T> { count: number; next: string | null; previous: string | null; results: T[]; }
interface AuthTokens { access: string; refresh: string; }
```

### Server-Side Filtering
List pages translate MultiFilter rules into backend query params:
- Text operators map to `field__icontains`, `field__exact`, `field__istartswith`, etc.
- Number/select fields use direct param names (e.g., `statuspo=2`, `supplierid=5`)
- Global search maps to `search` param (backend searches across multiple fields)

### Pagination
Lists fetch data via `/api/[module]/[entity]` with query params:
```
?page=1&page_size=20&ordering=-fieldname&fieldname__icontains=value
```
Backend returns `{ count, next, previous, results }`.

## Context & State Management

### AuthContext (app/context/AuthContext.tsx)
- **user**: Current logged-in User object (null if not authenticated)
- **isLoading**: True while checking initial auth state
- **login(username, password)**: Authenticates and stores user in localStorage
- **logout()**: Clears session, redirects to /login

### ActiveMenuContext (app/context/ActiveMenuContext.tsx)
- **activeModule**: Current module key (e.g., "pembelian", "penjualan")
- **setActiveModule(key)**: Updates active module and persists to localStorage
- Auto-detects active module based on current route

## Configuration Files

- **tsconfig.json**: Target ES2017, strict mode, `@/*` path alias
- **next.config.ts**: Minimal (no special config currently)
- **middleware.ts**: JWT auth, route protection, cookie-based session
- **playwright.config.ts**: E2E setup, auth state, Chromium + Firefox (CI only), 1 worker (sequential)
- **postcss.config.mjs**: Tailwind CSS 4 PostCSS plugin
- **eslint.config.mjs**: Next.js core-web-vitals + TypeScript configs

## Environment Variables

### Development (.env.local)
```
API_URL=http://localhost:8000    # Backend API base URL
```

### Testing (.env.test.local)
```
TEST_USERNAME=falah              # E2E test login credentials
TEST_PASSWORD=admin
TEST_BASE_URL=http://localhost:3000
```

## Important Notes for Future Development

1. **Always use `"use client"` at the top of React client components** — this codebase heavily relies on client components for interactivity (forms, modals, state management).

2. **Middleware runs on every request** — be aware of token refresh behavior when debugging auth issues.

3. **API Route Handlers are thin proxies** — they don't contain business logic; they forward requests to the backend and manage cookies.

4. **localStorage is used for UI state** — active module, sidebar collapse state, filter preferences. Not for sensitive data (auth tokens are httpOnly cookies only).

5. **E2E tests are sequential (workers: 1)** — this prevents race conditions with auth state. Do not change this setting without understanding the implications.

6. **Dual-mode DataTable** — always provide both `columns` (desktop) and `renderMobileCard` (mobile). The table automatically switches based on breakpoint.

7. **Status field naming** — typically `status[entityname]` (e.g., `statuspo` for purchase orders). Check backend API spec for exact field names.

8. **Import paths** — use `@/*` aliases (e.g., `@/app/lib/types`) for cleaner imports. Path alias is configured in tsconfig.json.

9. **Playwright auth setup** — the setup test runs once and stores state in `.auth/user.json`. All other tests depend on this setup. If auth setup fails, subsequent tests will fail silently.

10. **Material Symbols Icons** — use the exact icon name from [Google Material Symbols](https://fonts.google.com/icons). Icons are loaded via CDN in layout.tsx.
