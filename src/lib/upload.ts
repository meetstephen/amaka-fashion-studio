import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadImage(file: File, folder = 'general'): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from('images').upload(safeName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('[Upload] Failed:', error.message, '- This usually means Storage policies are not set. Run the SQL in supabase/rls-policies.sql');
    return null;
  }

  const { data } = supabase.storage.from('images').getPublicUrl(safeName);
  return data.publicUrl;
}

export async function deleteImage(path: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const url = new URL(path);
    const storagePath = url.pathname.split('/storage/v1/object/public/images/')[1];
    if (!storagePath) return false;

    const { error } = await supabase.storage.from('images').remove([storagePath]);
    return !error;
  } catch {
    return false;
  }
}
