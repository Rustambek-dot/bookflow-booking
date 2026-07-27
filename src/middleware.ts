import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/bookings',
  '/services',
  '/staff',
  '/customers',
  '/analytics',
  '/settings',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected) {
    // Supabase stores the session in cookies prefixed with sb-
    const hasSession = req.cookies
      .getAll()
      .some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

    if (!hasSession) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/bookings/:path*', '/services/:path*', '/staff/:path*', '/customers/:path*', '/analytics/:path*', '/settings/:path*'],
}
