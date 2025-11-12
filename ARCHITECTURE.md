# Opsis Suite - Website Architecture

## 🌐 Site Map

```
opsis-suite/
├── 📄 index.html              ← Homepage (Marketing + System Selection)
├── 📄 solutions.html          ← Detailed Solutions Page (4 Systems)
├── 📄 pricing.html            ← Pricing Plans
├── 📄 contact.html            ← Contact & Demo Request
├── 📄 about.html              ← About Company
├── 📄 login-central.html      ← 🔐 Centralized Authentication
│
├── 🔐 Authentication (js/)
│   └── login-central.js       ← Login logic for all systems
│
├── 📁 sistemas/               ← Individual Business Systems
│   ├── plomeria/              ← Plumbing Services (🚰)
│   ├── jardineria/            ← Gardening Services (🌿)
│   ├── logistica/             ← Logistics Management (📦)
│   └── mudanza/               ← Moving Services (🚚)
│
├── 📁 web/                    ← Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (platform)/
│   │   │   │   ├── customers/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── inventory/
│   │   │   │   ├── orders/
│   │   │   │   ├── reports/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── providers.tsx
│   │   │   └── contexts/
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   ├── data/
│   │   │   └── utils.ts
│   │   └── fonts/
│   └── tailwind.config.ts
│
├── 📁 supabase/               ← Database Schema
│   └── migrations/
│       └── 0001_init.sql      ← 14 Tables Definition
│
└── 📁 legacy/                 ← Original Codebase (HTML/CSS/JS)
    ├── login.html
    ├── client-portal.html
    ├── contractor-portal.html
    └── ... (original files)
```

## 🎯 User Journey

### 1. **Landing Page** (index.html)
```
┌─────────────────────────────────┐
│   Opsis Suite - Homepage        │
│  "Modular Business Solutions"   │
├─────────────────────────────────┤
│                                 │
│  🚰 Plomería    🌿 Jardinería  │
│  📦 Logística   🚚 Mudanza      │
│                                 │
│  [Get Started] [Learn More]     │
└─────────────────────────────────┘
```

### 2. **Authentication** (login-central.html)
```
┌──────────────────────────────┐
│   Opsis Suite Login          │
├──────────────────────────────┤
│ System: [Select System ▼]    │
│ Email: [dev@opsis-suite.com] │
│ Password: [dev123]           │
│ [Login]                      │
├──────────────────────────────┤
│ Roles: super_admin, admin,   │
│ contractor, customer         │
└──────────────────────────────┘
```

### 3. **System Dashboard**
```
Each system (Plomería, Jardinería, Logística, Mudanza) has:
│
├─ Dashboard (with stats & recent activity)
├─ Customers Management
├─ Orders Management
├─ Inventory Management
├─ Reports
└─ Settings
```

## 🎨 Design System

### Color Palette

```
Primary Systems:
├─ Plomería (🚰):    Blue #0066cc → #0052a3
├─ Jardinería (🌿):  Green #00aa44 → #008a3a
├─ Logística (📦):   Orange #ff8800 → #dd7000
└─ Mudanza (🚚):     Purple #cc00ff → #9900cc

Dark Mode:
├─ Background: #0f1214
├─ Surface: #2b2f33
├─ Text: #e0e0e0
└─ Accent: System-specific colors
```

### Typography
- **Headers**: System UI (or fallback)
- **Body**: System UI (or fallback)
- **Monospace**: Courier New (for code)

### Spacing
- **Container Max Width**: 1200px
- **Padding**: 1rem, 1.5rem, 2rem, 2.5rem
- **Gap**: 1rem, 1.5rem, 2rem

## 📊 Navigation Hierarchy

### Public Pages
```
Home → Solutions → Pricing → Contact → About → Login
                                        ├─→ Features
                                        ├─→ Integrations
                                        ├─→ API Docs
                                        ├─→ Privacy Policy
                                        ├─→ Terms of Service
                                        └─→ Security
```

### Authenticated Pages (Post-Login)
```
Dashboard
├─ Customers
├─ Orders
├─ Inventory
├─ Reports
├─ Settings
└─ Account (Logout)
```

## 🔄 Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─→ login-central.html (Static)
       │   ├─ Select System
       │   └─ Authenticate (JWT)
       │
       ├─→ Web App (Next.js)
       │   ├─ Server-side: Supabase queries
       │   └─ Client-side: React components
       │
       └─→ Supabase (Backend)
           ├─ PostgreSQL (14 tables)
           ├─ Row-level Security
           └─ Real-time subscriptions
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User visits login-central.html
2. Selects system (Plomería/Jardinería/Logística/Mudanza)
3. Enters credentials (dev@opsis-suite.com / dev123)
4. System validates against user database
5. JWT token issued (24-hour expiration)
6. User redirected to system dashboard
7. Dashboard verifies token and role
8. Content rendered based on permissions
```

### Row-Level Security (RLS)
```
Each table has RLS policies:
- super_admin: Full access to all data
- admin: Access to their system's data
- contractor: Access to assigned work
- customer: Access to their orders/requests
```

## 📱 Responsive Design

### Breakpoints
```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
Large:     > 1280px
```

### Adaptations
- **Mobile**: Single column, stacked cards
- **Tablet**: 2-column layout
- **Desktop**: Full multi-column with sidebars

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────┐
│   GitHub (Source of Truth)          │
│   opsison-suite/main branch         │
└────────────┬────────────────────────┘
             │
             ├─→ GitHub Pages (Static HTML)
             │   index.html, solutions.html, etc.
             │
             ├─→ Vercel (Next.js Web App)
             │   Automatic deploy from main
             │   Auto SSL certificates
             │
             └─→ Docker (Optional)
                 Containerized deployment
```

## 🧪 Testing Checklist

### Functional Testing
- [ ] Homepage loads with 4 system cards
- [ ] Each card is clickable
- [ ] Solutions page shows all 4 systems
- [ ] Contact form submits
- [ ] Login accepts dev credentials
- [ ] Dark mode toggles correctly

### Visual Testing
- [ ] Cards have proper borders (2px)
- [ ] Icons display at 110px
- [ ] Hover animations work smoothly
- [ ] Colors match system palette
- [ ] Responsive design works on all devices

### Performance
- [ ] Page load < 2 seconds
- [ ] No console errors
- [ ] No network errors
- [ ] Images optimized

## 🔗 Important Links

### Documentation
- `README.md` - Main project documentation
- `SISTEMAS.md` - System-specific documentation
- `SESSION_SUMMARY.md` - This session's summary
- `AUDIT_REPORT.md` - Code quality audit

### External Links
- **GitHub**: https://github.com/candewesth/opsis-suite
- **Demo**: http://localhost:8001 (local)
- **Authentication**: login-central.html

### Developer Credentials
```
Email: dev@opsis-suite.com
Password: dev123
Available Roles: super_admin, admin, contractor, customer
Token Duration: 24 hours
```

---

**Last Updated**: November 12, 2025
**Status**: 🟢 Production Ready
