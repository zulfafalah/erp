# ERP

A web-based **Enterprise Resource Planning (ERP)** system built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS. The application covers core business modules including purchasing, sales, inventory, accounting, and finance.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI**: [React 19](https://react.dev) + [Tailwind CSS 4](https://tailwindcss.com)
- **Language**: TypeScript
- **Icons**: Material Symbols Outlined

## Modules

### 🛒 Purchase
- **Order** — Purchase orders to suppliers
- **Request** — Internal purchase requests
- **Receipt** — Goods receipt
- **Invoice** — Purchase invoices
- **Return** — Purchase returns

### 💰 Sales
- **Order** — Sales orders to customers
- **Commission** — Sales commissions
- **Invoice** — Sales invoices
- **Return** — Sales returns

### 📦 Inventory
- **Adjustment** — Stock adjustments
- **Stock Transfer Inbound** — Inbound stock transfers
- **Stock Transfer Outbound** — Outbound stock transfers

### 📒 Accounting
- **Chart of Accounts** — Account list
- **General Journal** — General journal entries
- **Transaction Journal** — Transaction journal
- **Monthly Posting** — Monthly postings
- **Monthly Opening Balance** — Monthly opening balances
- **Yearly Opening Balance** — Yearly opening balances
- **Fund Request** — Fund requests

### 💳 Finance
- **Accounts Payable** — Vendor payables
- **Accounts Receivable** — Customer receivables
- **Sales Commissions** — Sales commission tracking

### 🗂️ Master Data
- **Product & Product Category** — Products and categories
- **Customer** — Customer records
- **Supplier** — Supplier records
- **Seller** — Seller records
- **Warehouse** — Warehouse records
- **Currency** — Currencies
- **Country, City, Region** — Location data
- **Adjustment Reason** — Stock adjustment reasons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to the Purchase Order module.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
