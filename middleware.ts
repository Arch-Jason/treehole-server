import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const cookies = request.cookies

  const isAuthenticated = cookies.has('username') && cookies.has('password')

  console.log(path);

  if (path.startsWith('/new') || path.startsWith('/history')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (path.startsWith('/treehole')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}