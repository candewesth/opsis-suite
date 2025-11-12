# 🔐 Opsis Suite - Centralized Authentication Architecture

## Overview

Opsis Suite implementa un **sistema centralizado de autenticación** que sirve a todos los sistemas (plomería, jardinería, logística, mudanza) desde un único punto de entrada.

## Structure

```
opsis-suite/
├── login-central.html          ← Central login (all systems route here)
├── js/
│   └── login-central.js        ← Authentication logic & routing
├── admin/
│   └── superadmin.html         ← Developer/Super Admin panel
└── sistemas/
    ├── plomeria/
    │   └── legacy/login.html   ← Links to central login
    ├── jardineria/
    ├── logistica/
    └── mudanza/
```

## Authentication Flow

### 1. User Access
```
User visits:
  → https://opsis-suite.com/login-central.html
  → Selects system (plomería, jardinería, logística, mudanza)
  → Enters credentials
```

### 2. System Validates Credentials
```javascript
// login-central.js handles:
OpsiAuth.authenticate(email, password, system)
  ├── Check user exists
  ├── Check password matches
  ├── Check user has access to selected system
  └── Create session token
```

### 3. Role-Based Routing
```
Developer / Super Admin
  → ./admin/superadmin.html    [Full access to all systems]

Regular User
  → ./sistemas/[system]/legacy/index.html    [Access to assigned system]
```

### 4. Session Management
```javascript
// Token stored in localStorage:
{
  email: "user@example.com",
  role: "contractor",
  system: "plomeria",
  timestamp: 1699800000000,
  expires: 1699886400000  // 24 hours
}
```

## User Roles

### `super_admin`
- Access: All systems
- Permissions: Full admin panel, all features
- UI: Super admin dashboard

### `admin`
- Access: All systems
- Permissions: Full admin panel, all features
- UI: Super admin dashboard

### `contractor` / `technician`
- Access: Assigned systems only
- Permissions: Limited to operational tasks
- UI: System-specific interface

### `customer` / `client`
- Access: Assigned system only (read-only portal)
- Permissions: View orders, quotes, invoices
- UI: Client portal

## Developer Access

### Development Credentials
```
Email:    dev@opsis-suite.com
Password: opsis-dev-2025
Role:     super_admin
Access:   All systems + super admin panel
```

**Usage:**
1. Go to `login-central.html`
2. Type "dev" in email field (hint box appears)
3. Use credentials above
4. Access super admin panel immediately

## Default Users

The system comes with these pre-configured users (stored in localStorage):

```javascript
{
  'dev@opsis-suite.com': {
    password: 'opsis-dev-2025',
    role: 'super_admin',
    systems: ['plomeria', 'jardineria', 'logistica', 'mudanza'],
    name: 'Developer'
  },
  'admin@opsis-suite.com': {
    password: 'admin-2025',
    role: 'admin',
    systems: ['plomeria', 'jardineria', 'logistica', 'mudanza'],
    name: 'Super Admin'
  }
}
```

## System Integration

Each system references the central login:

### In `sistemas/[system]/legacy/login.html`
```html
<!-- Redirect to central login -->
<script>
  if (!isAuthenticated()) {
    window.location.href = '../../login-central.html';
  }
</script>
```

### In `sistemas/[system]/legacy/index.html`
```javascript
// Check authentication on page load
const user = OpsiAuth.getCurrentUser();
if (!user || user.system !== 'plomeria') {
  window.location.href = '../../login-central.html';
}
```

## API Reference

### `OpsisCentralAuth` Class

```javascript
// Get global instance
OpsiAuth

// Methods
OpsiAuth.authenticate(email, password, system)
  // Returns: { success: bool, user?: User, error?: string }

OpsiAuth.isAuthenticated()
  // Returns: boolean

OpsiAuth.getCurrentUser()
  // Returns: User object or null

OpsiAuth.logout()
  // Clear session and redirect to login

OpsiAuth.getAvailableSystems()
  // Returns: Array of systems user can access

OpsiAuth.setCurrentSystem(system)
  // Store selected system in localStorage

OpsiAuth.getCurrentSystem()
  // Retrieve current system (default: 'plomeria')

OpsiAuth.routeAfterLogin(system)
  // Auto-redirect based on role and system
```

### User Object
```typescript
interface User {
  email: string;
  role: 'super_admin' | 'admin' | 'contractor' | 'customer';
  name: string;
  systems: string[];
  timestamp: number;
  expires: number;
}
```

## Security Considerations

### Current (Development)
⚠️ **NOTE:** This is a **local/demo authentication system** for development.

For **production**, you should:

1. **Use Supabase Auth**
   - Enable passwordless authentication
   - Use OAuth (Google, GitHub)
   - Enable RLS policies
   - Store tokens in secure HttpOnly cookies

2. **Implement Backend Validation**
   - Never trust client-side authentication alone
   - Validate session tokens on every API call
   - Use refresh tokens with short expiration

3. **Add Security Headers**
   ```
   Content-Security-Policy
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   ```

4. **Encrypt Sensitive Data**
   - Use HTTPS/TLS for all communications
   - Never store passwords in localStorage (except demo)
   - Use secure session tokens

## Migration to Supabase

When ready for production:

```javascript
// 1. Update login-central.js to use Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(URL, KEY)

// 2. Replace authenticate() method
OpsiAuth.authenticate = async (email, password, system) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email, password
  })
  // Validate system access via RLS policy
}

// 3. Use Supabase session management
const session = await supabase.auth.getSession()
```

## Adding New Users

### Manual (Development)
```javascript
// In browser console
const users = JSON.parse(localStorage.getItem('opsis_users'))
users['newuser@email.com'] = {
  password: 'temporary-password',
  role: 'contractor',
  systems: ['plomeria'],
  name: 'New User',
  email: 'newuser@email.com'
}
localStorage.setItem('opsis_users', JSON.stringify(users))
```

### Admin Panel (Production)
- Access: Super Admin Dashboard → User Management
- Create: Email, Password, Role, Systems
- Assign: Select which systems user can access
- Manage: Edit, disable, reset password

## Testing

### Test Cases

```javascript
// Test 1: Developer Login
login('dev@opsis-suite.com', 'opsis-dev-2025', 'plomeria')
// Expected: Redirect to superadmin.html

// Test 2: Invalid Password
login('dev@opsis-suite.com', 'wrong', 'plomeria')
// Expected: Error message displayed

// Test 3: User Access Denied to System
login('user@plomeria.com', 'password', 'jardineria')
// Expected: Access denied error

// Test 4: Session Timeout
wait(25 hours)
// Expected: Session expired, redirect to login
```

### Browser DevTools
```javascript
// Check current user
OpsiAuth.getCurrentUser()

// Check all users
JSON.parse(localStorage.getItem('opsis_users'))

// Logout
OpsiAuth.logout()

// View token
localStorage.getItem('opsis_auth_token')
```

## Troubleshooting

### "Invalid email or password"
- Check email spelling
- Verify user exists in localStorage
- Try developer credentials to test

### Stuck on login screen
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Clear cookies and reload

### Can't access super admin
- Verify user role is 'super_admin' or 'admin'
- Check in browser console: `OpsiAuth.getCurrentUser().role`
- Add user manually if needed

## Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] Single Sign-On (SSO) integration
- [ ] Audit logging for all authentications
- [ ] Password reset flow
- [ ] User activity monitoring
- [ ] Rate limiting on failed login attempts
- [ ] Session management UI in admin panel

---

**Last Updated:** November 12, 2025
**Maintained By:** Development Team
