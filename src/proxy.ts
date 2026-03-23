import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Add authentication logic here for dashboard, wishlist, etc.
  const path = request.nextUrl.pathname;

  // Protect API routes that require user auth (e.g., modifying wishlist)
  if (path.startsWith('/api/user')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Note: Edge runtime doesn't fully support jsonwebtoken yet. 
    // Usually, we verify tokens here using jose, or pass the token to API route
    // to verify. In this setup, we just check if token is present and let
    // the destination API route do the hard verification.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/user/:path*', '/dashboard/:path*', '/wishlist/:path*'],
};
