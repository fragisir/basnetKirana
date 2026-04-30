import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login'

  const token = request.cookies.get('auth-session')?.value || ''

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/customers/:path*',
    '/transactions/:path*',
    '/reports/:path*',
    '/login',
  ],
}
