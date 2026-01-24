// Supabase loader for SuperAdmin pages
// Reads config from window.OPSIS_SUPABASE_URL / OPSIS_SUPABASE_KEY or localStorage.
// If both are present, loads supabase-js from CDN and sets storage mode to 'supabase'.
(async function () {
    const url = window.OPSIS_SUPABASE_URL || localStorage.getItem('opsis_supabase_url');
    const key = window.OPSIS_SUPABASE_KEY || localStorage.getItem('opsis_supabase_key');
    if (!url || !key) {
        console.warn('[SupabaseLoader] Config faltante (url/key). Continuando en modo local/demo.');
        return;
    }

    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        window.supabase = { createClient };
        window.OPSIS_SUPABASE_CONFIG = { url, key };
        if (!window.OPSIS_SUPERADMIN_STORAGE_MODE) {
            window.OPSIS_SUPERADMIN_STORAGE_MODE = 'supabase';
        }
        console.info('[SupabaseLoader] Supabase inicializado desde CDN');
    } catch (e) {
        console.error('[SupabaseLoader] Error cargando supabase-js', e);
    }
})();
