/**
 * Supabase Client Placeholder
 *
 * This file provides a placeholder for the Supabase client connection.
 * DO NOT install @supabase/supabase-js until ready to connect to a real database.
 *
 * Required environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 *
 * ========================================
 * DATABASE SCHEMA (to create in Supabase):
 * ========================================
 *
 * Table: images
 * - id: uuid (primary key, default gen_random_uuid())
 * - url: text (not null) - Supabase Storage URL
 * - name: text (not null)
 * - category: text (not null) - e.g. 'collections', 'lookbook', 'hero', 'about', 'featured'
 * - created_at: timestamptz (default now())
 *
 * Table: lookbook
 * - id: uuid (primary key, default gen_random_uuid())
 * - image_url: text (not null) - Supabase Storage URL
 * - title: text (not null)
 * - caption: text
 * - order: integer (not null, default 0)
 * - created_at: timestamptz (default now())
 *
 * Table: content
 * - id: uuid (primary key, default gen_random_uuid())
 * - key: text (unique, not null) - e.g. 'tagline', 'about_story', 'collection_senator'
 * - value: text (not null)
 * - updated_at: timestamptz (default now())
 *
 * Table: featured
 * - id: uuid (primary key, default gen_random_uuid())
 * - image_url: text (not null) - Supabase Storage URL
 * - title: text
 * - subtitle: text
 * - updated_at: timestamptz (default now())
 *
 * Storage Bucket: 'images' (public)
 * - Store all uploaded images here
 * - Access via: supabase.storage.from('images').upload(...)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Placeholder Supabase client creator.
 * Replace this with the actual @supabase/supabase-js createClient when ready.
 *
 * Usage (after installing @supabase/supabase-js):
 * ```
 * import { createClient } from '@supabase/supabase-js'
 * export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
 * ```
 */
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      "[Supabase] Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Database features are disabled. Set these variables and install @supabase/supabase-js to enable."
    );
  }

  // TODO: Replace with actual Supabase client
  // import { createClient as createSupabaseClient } from '@supabase/supabase-js'
  // return createSupabaseClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

  return {
    from: (table: string) => {
      console.warn(`[Supabase] Attempted to query table "${table}" but client is not configured.`);
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      };
    },
    storage: {
      from: (bucket: string) => {
        console.warn(`[Supabase] Attempted to access storage bucket "${bucket}" but client is not configured.`);
        return {
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          remove: () => Promise.resolve({ data: null, error: null }),
        };
      },
    },
  };
}

// Export a singleton placeholder client
export const supabase = createClient();
