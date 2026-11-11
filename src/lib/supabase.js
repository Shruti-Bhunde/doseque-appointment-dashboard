import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '') ||
  'https://placeholder.supabase.co'

const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : '') ||
  'placeholder-anon-key'

if (
  (!import.meta.env?.VITE_SUPABASE_URL && (typeof process === 'undefined' || !process.env?.VITE_SUPABASE_URL)) ||
  (!import.meta.env?.VITE_SUPABASE_ANON_KEY && (typeof process === 'undefined' || !process.env?.VITE_SUPABASE_ANON_KEY))
) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or placeholder. Please update your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
