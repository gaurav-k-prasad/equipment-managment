# Equipment Management System - Project Structure

## 📁 Root Directory Structure

```
equipment-managment/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                 # Public route group
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact page
│   │   ├── features/             # Features page
│   │   ├── login/                # Login/Signup page
│   │   ├── layout.tsx            # Public layout with Navbar
│   │   └── page.tsx              # Landing page
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/    # NextAuth.js configuration
│   │   │   └── register/         # User registration endpoint
│   │   ├── graphql/              # GraphQL API endpoint
│   │   └── test-sns/             # AWS SNS testing endpoint
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── assets/               # Asset management
│   │   ├── asset-holders/        # Asset holder management
│   │   ├── assignment/           # Assignment management
│   │   ├── customers/            # Customer management
│   │   ├── maintenances/         # Maintenance management
│   │   ├── products/             # Product management
│   │   ├── returnrequest/        # Return request management
│   │   ├── shipment/             # Shipment management
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   └── page.tsx              # Dashboard home page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── forms/                    # Form components
│   ├── global/                   # Global components
│   │   ├── DataTable.tsx         # Reusable data table
│   │   ├── PageHeader.tsx        # Page header component
│   │   └── StatsCards.tsx        # Statistics cards
│   ├── layout/                   # Layout components
│   ├── lib/                      # Component utilities
│   │   └── utils.ts              # Utility functions
│   ├── modals/                   # Modal components
│   ├── providers/                # Context providers
│   │   └── AuthProvider.tsx      # NextAuth SessionProvider wrapper
│   ├── shared/                   # Shared components
│   │   ├── CTA.tsx               # Call-to-action component
│   │   ├── Features.tsx          # Features component
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Hero.tsx              # Hero section component
│   │   ├── Navbar.tsx            # Navigation component
│   │   └── Testimonials.tsx      # Testimonials component
│   ├── tables/                   # Table components
│   └── ui/                       # UI components (shadcn/ui)
├── graphql/                      # GraphQL configuration
│   ├── context.ts                # GraphQL context
│   ├── middleware.ts             # GraphQL middleware
│   ├── resolvers.ts              # GraphQL resolvers
│   ├── schema.graphql            # GraphQL schema
│   ├── typeDefs.ts               # Type definitions
│   └── utils.ts                  # GraphQL utilities
├── hooks/                        # Custom React hooks
│   ├── index.ts                  # Hooks index
│   ├── use-mobile.ts             # Mobile detection hook
│   ├── useAnalytics.ts           # Analytics hook
│   ├── useApiIntegrations.ts     # API integrations hook
│   ├── useAssetHolders.ts        # Asset holders hook
│   ├── useAssets.ts              # Assets hook
│   ├── useAssignments.ts         # Assignments hook
│   ├── useCustomers.ts           # Customers hook
│   ├── useMaintenance.ts         # Maintenance hook
│   ├── useOrders.ts              # Orders hook
│   ├── useProducts.ts            # Products hook
│   ├── useReturnRequests.ts      # Return requests hook
│   └── useShipments.ts           # Shipments hook
├── lib/                          # Utility libraries
│   ├── aws/                      # AWS services
│   │   └── sns.ts                # SNS notification service
│   ├── prisma.ts                 # Prisma client configuration
│   └── validations.ts            # Input validation schemas
├── prisma/                       # Database configuration
│   ├── migrations/               # Database migrations
│   │   └── 20250616170200_init/  # Initial migration
│   │       └── migration.sql     # Migration SQL
│   ├── migration_lock.toml       # Migration lock file
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
│   ├── file.svg                  # File icon
│   ├── globe.svg                 # Globe icon
│   ├── next.svg                  # Next.js logo
│   ├── vercel.svg                # Vercel logo
│   └── window.svg                # Window icon
├── types/                        # TypeScript type definitions
│   ├── next-auth.d.ts            # NextAuth type extensions
│   └── next-env.d.ts             # Next.js environment types
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── middleware.ts                 # Next.js middleware for auth
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── validate-graphql.js           # GraphQL validation script
```

## 🔐 Authentication Flow

### **Fixed Authentication System**

- **Entry Point**: `app/(public)/page.tsx` - Landing page
- **Login Page**: `app/(public)/login/page.tsx` - Login/Signup form
- **Configuration**: `app/api/auth/[...nextauth]/route.ts` - NextAuth setup
- **Registration**: `app/api/auth/register/route.ts` - User registration
- **Protected Routes**: `app/dashboard/` - Dashboard after login
- **Provider**: `components/providers/AuthProvider.tsx` - SessionProvider wrapper

### **Authentication Features**

- ✅ **Email/Password Authentication** (Credentials provider)
- ✅ **Google OAuth** (Google provider)
- ✅ **Account Linking** (OAuth + Credentials)
- ✅ **Role-based Access** (USER, ADMIN, SUPER_ADMIN)
- ✅ **Session Management** (JWT strategy)
- ✅ **Error Handling** (OAuth errors, validation)
- ✅ **Sign-out Functionality** (Dashboard header)
- ✅ **User Session Display** (Dashboard header)

## 🗄️ Database Schema

### **Core Models**

- **User** - Authentication and user management
- **Asset** - Equipment inventory
- **AssetHolder** - Equipment custodians
- **Assignment** - Equipment assignments
- **Maintenance** - Equipment maintenance records
- **Shipment** - Equipment shipping/tracking

### **Supporting Models**

- **Customer** - External customers
- **Product** - Product catalog
- **Order** - Purchase orders
- **AnalyticsReport** - System reports
- **ApiIntegration** - Third-party integrations

## 🚀 API Structure

### **REST API Endpoints**

```
POST /api/auth/register          # User registration
GET  /api/auth/session           # Session info
POST /api/auth/signin/*          # Authentication
POST /api/auth/signout           # Sign out
```

### **GraphQL API**

```
POST /api/graphql                # GraphQL endpoint
```

### **Testing Endpoints**

```
GET  /api/test-sns               # AWS SNS testing
```

## 🎨 Frontend Structure

### **Pages**

- **`/`** - Landing page (public)
- **`/login`** - Login/Signup page (public)
- **`/about`** - About page (public)
- **`/contact`** - Contact page (public)
- **`/features`** - Features page (public)
- **`/dashboard`** - Protected dashboard (requires auth)
- **`/dashboard/assets`** - Asset management
- **`/dashboard/asset-holders`** - Asset holder management
- **`/dashboard/assignment`** - Assignment management
- **`/dashboard/customers`** - Customer management
- **`/dashboard/maintenances`** - Maintenance management
- **`/dashboard/products`** - Product management
- **`/dashboard/returnrequest`** - Return request management
- **`/dashboard/shipment`** - Shipment management

### **Components**

- **AuthProvider** - NextAuth SessionProvider wrapper
- **Dashboard Layout** - Sidebar navigation with sign-out
- **Public Layout** - Navbar and footer for public pages
- **Loading States** - User feedback during operations
- **Error Handling** - Comprehensive error display
- **Responsive Design** - Mobile-friendly UI

## 🔧 Configuration Files

### **Environment Variables**

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# AWS
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_SNS_TOPIC_ARN="..."
```

### **Key Configuration Files**

- **`next.config.ts`** - Next.js configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`eslint.config.mjs`** - ESLint configuration
- **`components.json`** - shadcn/ui configuration

## 🛡️ Security Features

### **Authentication Security**

- ✅ **Password Hashing** (bcryptjs)
- ✅ **JWT Sessions** (stateless)
- ✅ **CSRF Protection** (NextAuth built-in)
- ✅ **OAuth Security** (Google OAuth 2.0)

### **Route Protection**

- ✅ **Middleware Protection** - Automatic redirects to /login
- ✅ **Session Validation** - Client-side checks
- ✅ **Role-based Access** - User role verification
- ✅ **Authenticated User Redirects** - Away from login page

## 📊 Data Flow

### **Authentication Flow**

1. User visits `/` (landing page)
2. User clicks "Sign In" or "Get Started" → `/login`
3. User signs in with email/password or Google OAuth
4. NextAuth validates credentials
5. User redirected to `/dashboard`
6. Dashboard displays user info and sign-out button

### **Registration Flow**

1. User visits `/login` page
2. User clicks "Don't have an account? Sign up"
3. User fills registration form
4. API creates user with hashed password
5. Auto-login after successful registration
6. Redirect to dashboard

### **Sign-out Flow**

1. User clicks "Sign Out" button in dashboard header
2. NextAuth clears session
3. User redirected to `/` (landing page)

## 🚀 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run database migrations
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database
npm run db:seed          # Seed database

# Code Quality
npm run lint             # Run ESLint
npm run schema:validate  # Validate Prisma schema
npm run schema:format    # Format Prisma schema
```

## 🔄 Recent Fixes (Latest Update)

### **Authentication Issues Resolved**

- ✅ **Fixed NextAuth Configuration** - Redirect to /login instead of /
- ✅ **Created AuthProvider Component** - Proper SessionProvider wrapper
- ✅ **Added Sign-out Button** - Dashboard header with user info
- ✅ **Updated Middleware** - Proper redirects for auth flow
- ✅ **Fixed Session Display** - Show user name/email in dashboard
- ✅ **Resolved Auth Conflicts** - Single, consistent authentication flow

### **Dashboard Improvements**

- ✅ **User Session Display** - Shows actual user name/email
- ✅ **Sign-out Functionality** - Working sign-out button
- ✅ **Proper Navigation** - Sidebar with all management sections
- ✅ **Responsive Design** - Mobile-friendly dashboard layout

### **Clean Architecture**

- ✅ **Single Source of Truth** - No duplicate configurations
- ✅ **Consistent Routing** - Unified authentication flow
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Modern Patterns** - Next.js 15 App Router
- ✅ **Component Organization** - Well-structured component hierarchy

## 🎯 Current Status

### **✅ Working Features**

1. **Authentication System** - Complete login/signup with OAuth
2. **Dashboard Layout** - Protected dashboard with navigation
3. **User Management** - Registration and session handling
4. **Route Protection** - Middleware-based auth protection
5. **Sign-out Functionality** - Complete logout flow
6. **Responsive Design** - Mobile and desktop friendly

### **🚧 In Development**

1. **Equipment Management** - CRUD operations for assets
2. **GraphQL Integration** - Frontend to GraphQL API connection
3. **Admin Interface** - User management for admins
4. **Data Tables** - Equipment listing and management

### **📋 Next Steps**

1. **Complete Dashboard Features** - Implement all management sections
2. **GraphQL Integration** - Connect frontend to GraphQL API
3. **File Upload** - Equipment images and documents
4. **Notifications** - Email/SMS notifications
5. **Advanced Analytics** - Equipment usage analytics
6. **Mobile App** - React Native companion app

## 🔧 Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST API + GraphQL
- **Deployment**: Vercel-ready configuration
