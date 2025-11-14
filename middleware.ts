import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // --- DEBUGGING ---
  // Check your server console (where you ran "npm run dev")
  // 1. See if the secret is loaded at all
  console.log("NEXTAUTH_SECRET loaded:", !!process.env.NEXTAUTH_SECRET)

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 2. See what path we're on and what the session object looks like
  console.log("Middleware Path:", request.nextUrl.pathname)
  console.log("Session:", session)
  // --- END DEBUGGING ---

  const isAuthenticated = !!session
  const isLoginPage = request.nextUrl.pathname.startsWith("/login")
  const isRoot = request.nextUrl.pathname === "/"

  // --- Logic Flow ---

  // 1. If user is NOT authenticated:
  if (!isAuthenticated) {
    // If they are on the login page, let them stay
    if (isLoginPage) {
      return NextResponse.next()
    }
    // If they are on ANY other page (including root '/'), redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 2. If user IS authenticated:
  if (isLoginPage || isRoot) {
    // If they visit the login page or the root, send them to the app
    return NextResponse.redirect(new URL("/instructions", request.url))
  }

  // Otherwise, they are authenticated and on a valid page, so let them proceed
  return NextResponse.next()
}

// This config runs the middleware on all pages EXCEPT for static files and API routes
export const config = {
  matcher: [
    "/",
    "/login",
    "/instructions/:path*",
    "/dashboard/:path*",
    // Add any other protected routes here
  ],
}
