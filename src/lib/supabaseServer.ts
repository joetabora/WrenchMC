import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service_role_key'

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
