// Toggle for Supabase demo mode (uses local storage but async API shape)
// Usage: include this script before superadmin/js/data.js
// It sets the mode to 'supabase-demo' without requiring Supabase Pro/keys.
(function() {
    window.OPSIS_SUPERADMIN_STORAGE_MODE = 'supabase-demo';
    console.info('[Supabase Demo] SuperAdmin storage set to supabase-demo (local async mock).');
})();
