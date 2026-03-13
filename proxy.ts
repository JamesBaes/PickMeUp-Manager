// Proxy.ts file grabbed from https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?queryGroups=database-method&database-method=dashboard

// This proxy.ts file is in the upper level directory so that it handles every request before routing the user a page. 

import { type NextRequest, NextResponse } from 'next/server'

import { getCurrentAppRole, getDefaultRouteForRole, getRouteRole } from '@/utils/auth'
import { updateSession } from '@/utils/proxy'
import { createServerClient } from '@supabase/ssr'


export async function proxy(request: NextRequest) {

  // update user's auth session
  const response = await updateSession(request)

  // check if user is authenticated
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

   
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
    const routeRole = getRouteRole(path)
  const publicRoutes = ['/', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.includes(path)

  if (isPublicRoute) {
      if (path === '/' && user) {
        const role = await getCurrentAppRole(supabase, user)

        if (role) {
          return NextResponse.redirect(new URL(getDefaultRouteForRole(role), request.url))
        }
      }

    return response
  }

    if (!routeRole) {
      return response
    }

  // unauthenticated users get redirected back to login
    if (!user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

    const role = await getCurrentAppRole(supabase, user)

    if (!role) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (routeRole !== role) {
      return NextResponse.redirect(new URL(getDefaultRouteForRole(role), request.url))
  }


  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}