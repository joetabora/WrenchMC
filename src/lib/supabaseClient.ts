import { createClient } from '@supabase/supabase-js'

// Use explicit fallbacks so the module can be imported even without env vars configured.
// These fallbacks prevent Next from crashing during local development; configure real
// values in `.env.local` for a working Supabase integration.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
