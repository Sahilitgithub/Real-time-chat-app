import { NextResponse, NextRequest } from 'next/server'
import { auth } from './auth'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const session = auth();
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/conversations/:path*',  '/users/:path*'],
}