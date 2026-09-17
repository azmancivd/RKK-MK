import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

function getActiveConfig() {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') || '' : '';
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') || '' : '';

  const url = customUrl || metaEnv.VITE_SUPABASE_URL || metaEnv.SUPABASE_URL || '';
  const key =
    customKey ||
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    metaEnv.SUPABASE_PUBLISHABLE_KEY ||
    '';

  const isConfigured = Boolean(
    url &&
      key &&
      url.startsWith('http') &&
      key.length > 10 &&
      !url.includes('your-project')
  );

  return { url, key, isConfigured };
}

let activeConfig = getActiveConfig();

export let isSupabaseConfigured = activeConfig.isConfigured;

export let supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(activeConfig.url, activeConfig.key)
  : null;

export function getSupabaseConfig() {
  return {
    url: activeConfig.url,
    key: activeConfig.key,
    configured: isSupabaseConfigured,
  };
}

export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase_custom_url', url.trim());
    localStorage.setItem('supabase_custom_key', key.trim());
  }
  activeConfig = getActiveConfig();
  isSupabaseConfigured = activeConfig.isConfigured;
  supabase = isSupabaseConfigured ? createClient(activeConfig.url, activeConfig.key) : null;
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('supabase_custom_url');
    localStorage.removeItem('supabase_custom_key');
  }
  activeConfig = getActiveConfig();
  isSupabaseConfigured = activeConfig.isConfigured;
  supabase = isSupabaseConfigured ? createClient(activeConfig.url, activeConfig.key) : null;
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Klien Supabase belum dikonfigurasi dengan URL dan Kunci yang valid.' };
  }
  try {
    // Attempt a basic auth/session or health request
    const { error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, message: `Gagal terhubung: ${error.message}` };
    }
    return { success: true, message: 'Koneksi ke Supabase Cloud Project berhasil dan aktif!' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Error koneksi: ${errorMsg}` };
  }
}
