# Project Structure

This document provides an overview of the directory and file structure for the project. It is intended to help developers quickly understand the organization of the codebase.

---

## Root Directory

- `.next/` - Next.js build output (auto-generated)
- `.git/` - Git version control directory
- `node_modules/` - Installed npm packages
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Exact versions of npm dependencies
- `tsconfig.json` - TypeScript configuration
- `validate-graphql.js` - GraphQL schema validation script
- `test-prisma.js` - Script for testing Prisma setup
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration
- `next-env.d.ts` - Next.js type definitions
- `next.config.ts` - Next.js configuration
- `components.json` - Component metadata
- `README.md` - Project overview and instructions
- `LICENSE` - License information
- `PROJECT_STRUCTURE.md` - This file
- `.gitignore` - Git ignore rules
- `.prettierrc` - Prettier formatting configuration

---

## `/public`

- `window.svg`, `next.svg`, `vercel.svg`, `file.svg`, `globe.svg` - Static assets (SVGs)

---

## `/prisma`

- `schema.prisma` - Prisma schema definition
- `migrations/` - Database migration files
  - `20250616170200_init/`
    - `migration.sql` - SQL for initial migration
  - `migration_lock.toml` - Migration lock file

---

## `/src`

### `/src/app`

- `layout.tsx` - Root layout for the app
- `globals.css` - Global styles

#### `/src/app/dashboard`

- `layout.tsx` - Dashboard layout
- `page.tsx` - Dashboard main page
- `users/`
  - `page.tsx` - Users list page
  - `[id]/`
    - `page.tsx` - User detail page
- `orders/`
  - `page.tsx` - Orders page
- `shipment/`
  - `page.tsx` - Shipments page
- `returnrequest/`
  - `page.tsx` - Return requests page
- `products/`
  - `page.tsx` - Products page
- `maintenances/`
  - `page.tsx` - Maintenances page
- `customers/`
  - `page.tsx` - Customers page
- `assets/`
  - `page.tsx` - Assets page
  - `[id]/`
    - `page.tsx` - Asset detail page
- `assignment/`
  - `page.tsx` - Assignment page
- `asset-holders/`
  - `page.tsx` - Asset holders page

#### `/src/app/(public)`

- `layout.tsx` - Public layout
- `page.tsx` - Public landing page
- `about/`
  - `page.tsx` - About page
- `contact/`
  - `page.tsx` - Contact page
- `features/`
  - `page.tsx` - Features page

#### `/src/app/login`

- `page.tsx` - Login page

#### `/src/app/api`

- `auth/`
  - `register/`
    - `route.ts` - Registration API route
  - `[...nextauth]/`
    - `route.ts` - NextAuth API route
- `graphql/`
  - `route.ts` - GraphQL API route

---

### `/src/components`

- `ui/` - Reusable UI components (buttons, forms, dialogs, etc.)
- `shared/` - Shared presentational components (Hero, Navbar, Footer, etc.)
- `global/` - Global dashboard components (DataTable, PageHeader, StatsCards)
- `lib/` - Component-specific utilities
- `providers/` - Context providers (e.g., AuthProvider)

---

### `/src/graphql`

- `typeDefs.ts` - GraphQL type definitions
- `utils.ts` - GraphQL utilities
- `context.ts` - GraphQL context setup
- `middleware.ts` - GraphQL middleware
- `resolvers.ts` - GraphQL resolvers
- `schema.graphql` - GraphQL schema

---

### `/src/hooks`

- `index.ts` - Exports for hooks
- `useAssetHolders.ts`, `useAssets.ts`, `useAssignments.ts`, `useCustomers.ts`, `useMaintenance.ts`, `useOrders.ts`, `useProducts.ts`, `useReturnRequests.ts`, `useShipments.ts`, `use-mobile.ts`, `useAnalytics.ts`, `useApiIntegrations.ts` - Custom React hooks for various features

---

### `/src/lib`

- `aws/`
  - `sns.ts` - AWS SNS integration
- `prisma.ts` - Prisma client setup
- `validations.ts` - Validation utilities

---

### `/src/types`

- `next-auth.d.ts`, `next-env.d.ts` - TypeScript type definitions

---
