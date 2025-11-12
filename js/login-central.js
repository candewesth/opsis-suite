/**
 * Opsis Suite - Central Authentication & Routing System
 * 
 * This module handles:
 * - Centralized login for all systems (plomeria, jardineria, logistica, mudanza)
 * - Developer/Super Admin access
 * - Role-based routing
 * - System detection and navigation
 */

class OpsisCentralAuth {
  constructor() {
    this.systems = {
      plomeria: {
        name: 'Plomería',
        icon: '🚰',
        description: 'Plumbing Management System',
        url: './sistemas/plomeria/legacy/index.html',
        adminUrl: './sistemas/plomeria/legacy/index.html?view=admin',
        color: '#0066cc'
      },
      jardineria: {
        name: 'Jardinería',
        icon: '🌿',
        description: 'Gardening & Landscaping System',
        url: './sistemas/jardineria/legacy/index.html',
        adminUrl: './sistemas/jardineria/legacy/index.html?view=admin',
        color: '#00aa44'
      },
      logistica: {
        name: 'Logística',
        icon: '📦',
        description: 'Logistics & Delivery System',
        url: './sistemas/logistica/legacy/index.html',
        adminUrl: './sistemas/logistica/legacy/index.html?view=admin',
        color: '#ff6600'
      },
      mudanza: {
        name: 'Mudanza',
        icon: '🚚',
        description: 'Moving & Relocation System',
        url: './sistemas/mudanza/legacy/index.html',
        adminUrl: './sistemas/mudanza/legacy/index.html?view=admin',
        color: '#9933cc'
      }
    };

    this.devCredentials = {
      email: 'dev@opsis-suite.com',
      password: 'opsis-dev-2025'
    };

    this.users = this.loadUsers();
  }

  /**
   * Load users from localStorage (mock database)
   */
  loadUsers() {
    const stored = localStorage.getItem('opsis_users');
    if (stored) return JSON.parse(stored);

    // Default users
    return {
      'dev@opsis-suite.com': {
        password: 'opsis-dev-2025',
        role: 'super_admin',
        systems: Object.keys(this.systems),
        name: 'Developer',
        email: 'dev@opsis-suite.com'
      },
      'admin@opsis-suite.com': {
        password: 'admin-2025',
        role: 'admin',
        systems: Object.keys(this.systems),
        name: 'Super Admin',
        email: 'admin@opsis-suite.com'
      }
    };
  }

  /**
   * Authenticate user
   */
  authenticate(email, password, system = null) {
    const user = this.users[email];

    if (!user || user.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }

    if (system && !user.systems.includes(system)) {
      return {
        success: false,
        error: `Access denied to ${system}`
      };
    }

    // Create session token
    const token = btoa(JSON.stringify({
      email: user.email,
      role: user.role,
      system: system,
      timestamp: Date.now(),
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));

    localStorage.setItem('opsis_auth_token', token);
    localStorage.setItem('opsis_user', JSON.stringify({
      email: user.email,
      role: user.role,
      name: user.name
    }));

    return {
      success: true,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        systems: user.systems
      }
    };
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    const token = localStorage.getItem('opsis_auth_token');
    if (!token) return null;

    try {
      const data = JSON.parse(atob(token));
      if (data.expires < Date.now()) {
        this.logout();
        return null;
      }
      return data;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get redirect URL based on role and system
   */
  getRedirectUrl(user, system) {
    if (user.role === 'super_admin' || user.role === 'admin') {
      // Developers go to super admin panel
      return './admin/superadmin.html';
    }

    // Regular users go to their system
    if (system && this.systems[system]) {
      return this.systems[system].url;
    }

    // Default: show system selector
    return null;
  }

  /**
   * Route to appropriate system/panel
   */
  routeAfterLogin(system = null) {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = './login.html';
      return;
    }

    const url = this.getRedirectUrl(user, system);
    if (url) {
      window.location.href = url;
    }
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('opsis_auth_token');
    localStorage.removeItem('opsis_user');
    localStorage.removeItem('opsis_system');
    window.location.href = './login.html';
  }

  /**
   * Get available systems for current user
   */
  getAvailableSystems() {
    const user = this.getCurrentUser();
    if (!user) return [];

    return user.systems.map(sys => ({
      ...this.systems[sys],
      id: sys
    }));
  }

  /**
   * Set current system
   */
  setCurrentSystem(system) {
    localStorage.setItem('opsis_system', system);
  }

  /**
   * Get current system
   */
  getCurrentSystem() {
    return localStorage.getItem('opsis_system') || 'plomeria';
  }
}

// Global instance
const OpsiAuth = new OpsisCentralAuth();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpsisCentralAuth;
}
