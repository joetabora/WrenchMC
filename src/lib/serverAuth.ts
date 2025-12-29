import { supabaseServer } from './supabaseServer'

export async function getUserFromRequest(req: Request) {
  // Try Authorization header first
  const authHeader = req.headers.get('authorization')
  let token: string | null = null
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.slice(7)
  }

  // Fallback to cookies (Supabase stores access token in `sb-access-token` or `supabase-auth-token` depending on setup)
  if (!token) {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/(?:sb-access-token|supabase-auth-token)=([^;]+)/)
    if (match) token = decodeURIComponent(match[1])
  }

  if (!token) return null

  // Use Supabase auth to validate token server-side
  try {
    const { data, error } = await supabaseServer.auth.getUser(token)
    if (error) return null
    return (data as any)?.user || null
  } catch (e) {
    return null
  }
}
