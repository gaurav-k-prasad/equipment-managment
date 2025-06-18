# Equipment Management System - Project Structure

## 📁 Root Directory Structure

```
equipment-managment/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                 # Public route group
│   │   └── about/                # About page
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/    # NextAuth.js configuration
│   │   │   └── register/         # User registration endpoint
│   │   ├── graphql/              # GraphQL API endpoint
│   │   └── test-sns/             # AWS SNS testing endpoint
│   ├── dashboard/                # Protected dashboard page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with SessionProvider
│   └── page.tsx                  # Landing page with auth
├── graphql/                      # GraphQL configuration
│   ├── context.ts                # GraphQL context
│   ├── middleware.ts             # GraphQL middleware
│   ├── resolvers.ts              # GraphQL resolvers
│   ├── schema.graphql            # GraphQL schema
│   ├── typeDefs.ts               # Type definitions
│   └── utils.ts                  # GraphQL utilities
├── lib/                          # Utility libraries
│   ├── aws/                      # AWS services
│   │   └── sns.ts                # SNS notification service
│   ├── prisma.ts                 # Prisma client configuration
│   └── validations.ts            # Input validation schemas
├── prisma/                       # Database configuration
│   ├── migrations/               # Database migrations
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware for auth
├── next-auth.d.ts                # NextAuth type definitions
└── package.json                  # Dependencies and scripts
```

## 🔐 Authentication Flow

### **Single Authentication System**

- **Entry Point**: `app/page.tsx` - Landing page with login/signup
- **Configuration**: `app/api/auth/[...nextauth]/route.ts` - NextAuth setup
- **Registration**: `app/api/auth/register/route.ts` - User registration
- **Protected Routes**: `app/dashboard/page.tsx` - Dashboard after login

### **Authentication Features**

- ✅ **Email/Password Authentication** (Credentials provider)
- ✅ **Google OAuth** (Google provider)
- ✅ **Account Linking** (OAuth + Credentials)
- ✅ **Role-based Access** (USER, ADMIN, SUPER_ADMIN)
- ✅ **Session Management** (JWT strategy)
- ✅ **Error Handling** (OAuth errors, validation)

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

- **`/`** - Landing page with authentication
- **`/dashboard`** - Protected dashboard (requires auth)
- **`/about`** - Public about page

### **Components**

- **SessionProvider** - Wraps app for auth state
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

## 🛡️ Security Features

### **Authentication Security**

- ✅ **Password Hashing** (bcryptjs)
- ✅ **JWT Sessions** (stateless)
- ✅ **CSRF Protection** (NextAuth built-in)
- ✅ **OAuth Security** (Google OAuth 2.0)

### **Route Protection**

- ✅ **Middleware Protection** - Automatic redirects
- ✅ **Session Validation** - Client-side checks
- ✅ **Role-based Access** - User role verification

## 📊 Data Flow

### **Authentication Flow**

1. User visits `/` (landing page)
2. User signs in with email/password or Google OAuth
3. NextAuth validates credentials
4. User redirected to `/dashboard`
5. Dashboard checks session and displays content

### **Registration Flow**

1. User clicks "Sign Up" on landing page
2. User fills registration form
3. API creates user with hashed password
4. Auto-login after successful registration
5. Redirect to dashboard

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

## 🔄 Recent Improvements

### **Fixed Issues**

- ✅ **Removed Duplicate Auth Pages** - Single authentication flow
- ✅ **Fixed OAuth Account Linking** - Proper Google OAuth handling
- ✅ **Added Error Handling** - Comprehensive error display
- ✅ **Created Dashboard** - Protected dashboard page
- ✅ **Improved UX** - Loading states and better feedback

### **Clean Architecture**

- ✅ **Single Source of Truth** - No duplicate configurations
- ✅ **Consistent Routing** - Unified authentication flow
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Modern Patterns** - Next.js 15 App Router

## 🎯 Next Steps

### **Immediate Tasks**

1. **Complete Dashboard** - Add equipment management features
2. **GraphQL Integration** - Connect frontend to GraphQL API
3. **User Management** - Admin user management interface
4. **Equipment CRUD** - Equipment creation, reading, updating, deletion

### **Future Enhancements**

1. **Real-time Updates** - WebSocket integration
2. **File Upload** - Equipment images and documents
3. **Notifications** - Email/SMS notifications
4. **Mobile App** - React Native companion app
5. **Advanced Analytics** - Equipment usage analytics
