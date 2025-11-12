# 🔐 Opsis Suite - Authentication & System Architecture

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    OPSIS SUITE - HOME                           │
│              (opsis-suite.com/index.html)                       │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    [Sign In Button]
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              login-central.html (Central Hub)                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Select System:                                           │  │
│  │  [🚰 Plomería] [🌿 Jardinería]                          │  │
│  │  [📦 Logística] [🚚 Mudanza]                            │  │
│  │                                                          │  │
│  │ Email:    [________________]                            │  │
│  │ Password: [________________]                            │  │
│  │                                                          │  │
│  │ [Sign In Button]                                        │  │
│  │                                                          │  │
│  │ 💡 Tip: Type "dev" to see developer credentials        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ authenticate()
                         ▼
        ┌────────────────────────────────────┐
        │    Validate Credentials            │
        │    - User exists?                  │
        │    - Password correct?             │
        │    - Access to system?             │
        └────────────────────┬───────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
         ✓ Valid                    ✗ Invalid
         Create Token              Show Error
                │                        │
                ├─────────────┬──────────┘
                │             │
                ▼             ▼
        ┌───────────────┐ [Error Message Displayed]
        │ Check Role    │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
    super_admin/    contractor/
    admin           customer
        │               │
        ▼               ▼
  admin/          sistemas/[system]/
  superadmin.html legacy/index.html
        │               │
        ▼               ▼
   ┌──────────────┐  ┌──────────────┐
   │ Super Admin  │  │ System UI    │
   │ Panel        │  │ (Plomería,   │
   │              │  │  Jardinerìa, │
   │ - All        │  │  Logística,  │
   │   Systems    │  │  Mudanza)    │
   │ - Analytics  │  │              │
   │ - Reports    │  │ - Orders     │
   │ - Settings   │  │ - Inventory  │
   │              │  │ - Invoices   │
   └──────────────┘  └──────────────┘
```

## Developer Workflow

### 1. Access Super Admin Panel

```bash
# Option A: Direct URL
https://opsis-suite.com/login-central.html

# Type "dev" in email field
Email: dev@opsis-suite.com
Password: opsis-dev-2025

# Automatic redirect to:
https://opsis-suite.com/admin/superadmin.html
```

### 2. Super Admin Features

```
Super Admin Dashboard
├── All Systems Overview
│   ├── Plomería Status
│   ├── Jardinería Status
│   ├── Logística Status
│   └── Mudanza Status
│
├── User Management
│   ├── Create Users
│   ├── Assign Systems
│   ├── Manage Roles
│   └── Reset Passwords
│
├── Analytics & Reports
│   ├── System Usage
│   ├── Revenue Reports
│   ├── Activity Logs
│   └── Performance Metrics
│
└── Configuration
    ├── Company Settings
    ├── Branding & Theme
    ├── API Keys
    └── Integrations
```

## System Access Patterns

### Scenario 1: Developer Testing

```
1. Go to: login-central.html
2. System: Plomería (default selected)
3. Email: dev@opsis-suite.com
4. Password: opsis-dev-2025
5. Result: 
   └─ Redirect to: /admin/superadmin.html
   └─ Full access to ALL systems
```

### Scenario 2: Plumbing Contractor

```
1. Go to: login-central.html
2. System: Plomería ✓
3. Email: juan@plomeria-xyz.com
4. Password: contractor-password
5. Result:
   └─ Redirect to: /sistemas/plomeria/legacy/index.html
   └─ Access: Plomería system only
```

### Scenario 3: Multi-System Manager

```
1. Go to: login-central.html
2. System: Plomería (first login)
3. Email: manager@opsis-suite.com
4. Password: manager-password
5. Result:
   └─ Redirect to: /sistemas/plomeria/legacy/index.html
   
6. Later, select Logística from system selector
   └─ Redirect to: /sistemas/logistica/legacy/index.html
   └─ Full access to both systems
```

## Session Management

### Session Token Structure

```json
{
  "email": "dev@opsis-suite.com",
  "role": "super_admin",
  "system": "plomeria",
  "timestamp": 1699800000000,
  "expires": 1699886400000
}
```

### Token Storage
- **Location**: `localStorage['opsis_auth_token']`
- **Encoding**: Base64 (for simplicity; use JWT in production)
- **Duration**: 24 hours
- **Auto-refresh**: On next login

### Logout Flow

```javascript
OpsiAuth.logout()
  ├─ Clear localStorage tokens
  ├─ Redirect to login-central.html
  └─ Force new authentication
```

## Adding New Users (Admin)

### From Super Admin Panel

```
Dashboard → Users → Add User

Fields:
  ├─ Full Name: [________________]
  ├─ Email: [________________]
  ├─ Password: [________________]
  ├─ Role: [super_admin | admin | contractor | customer]
  │
  └─ System Access: (checkboxes)
      ├─ ☑ Plomería
      ├─ ☑ Jardinería
      ├─ ☐ Logística
      └─ ☐ Mudanza

[Create User Button]
```

### Manual (Development Only)

```javascript
// In browser console at login-central.html
const users = JSON.parse(localStorage.getItem('opsis_users'))

users['newuser@example.com'] = {
  password: 'temporary-password',
  role: 'contractor',
  systems: ['plomeria'],
  name: 'New Contractor',
  email: 'newuser@example.com'
}

localStorage.setItem('opsis_users', JSON.stringify(users))
```

## File Structure

```
opsis-suite/
├── login-central.html              ← Central login entry point
├── js/
│   └── login-central.js            ← Authentication logic
├── admin/
│   └── superadmin.html             ← Developer panel
├── docs/
│   └── AUTHENTICATION.md           ← Full technical docs
│
└── sistemas/
    ├── plomeria/
    │   ├── legacy/
    │   │   ├── login.html          ← References central login
    │   │   └── index.html          ← Main system UI
    │   └── web/                    ← Next.js app
    │
    ├── jardineria/
    │   ├── legacy/
    │   └── web/
    │
    ├── logistica/
    │   ├── legacy/
    │   └── web/
    │
    └── mudanza/
        ├── legacy/
        └── web/
```

## Security Notes

### Current (Development)
⚠️ This is a **local authentication system** for development use.

### For Production, Add:
- ✅ HTTPS/TLS encryption
- ✅ Password hashing (bcrypt, not plain text)
- ✅ Backend session validation
- ✅ Rate limiting on failed logins
- ✅ CSRF protection
- ✅ Secure HttpOnly cookies
- ✅ JWT or OAuth tokens
- ✅ Multi-factor authentication (MFA)

**See:** [AUTHENTICATION.md](./docs/AUTHENTICATION.md#security-considerations)

## Testing Credentials

| Email | Password | Role | Systems | Notes |
|-------|----------|------|---------|-------|
| dev@opsis-suite.com | opsis-dev-2025 | super_admin | All | Full access, admin panel |
| admin@opsis-suite.com | admin-2025 | admin | All | Full access, admin panel |
| (Add more as needed) | | | | |

## Quick Commands

```javascript
// Browser Console

// Check current user
OpsiAuth.getCurrentUser()

// Check all users
JSON.parse(localStorage.getItem('opsis_users'))

// Get available systems
OpsiAuth.getAvailableSystems()

// Logout
OpsiAuth.logout()

// Check if authenticated
OpsiAuth.isAuthenticated()
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Login not working | Clear localStorage: `localStorage.clear()` |
| Can't see dev credentials hint | Type "dev" in email field |
| Session expired | Login again (24h timeout) |
| Wrong system access | Check user's system assignments |
| Super admin not working | Verify user role is `super_admin` or `admin` |

## Next Steps

1. ✅ Test login-central.html with dev credentials
2. ✅ Create test users in localStorage
3. ✅ Test system switching and role-based routing
4. ⏳ Connect to Supabase Auth (production)
5. ⏳ Implement user management UI
6. ⏳ Add audit logging

---

**Questions?** See [AUTHENTICATION.md](./docs/AUTHENTICATION.md)
