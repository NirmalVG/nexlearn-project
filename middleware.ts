import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  console.log("NEXTAUTH_SECRET loaded:", !!process.env.NEXTAUTH_SECRET)

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  console.log("Middleware Path:", request.nextUrl.pathname)
  console.log("Session:", session)

  const isAuthenticated = !!session
  const isLoginPage = request.nextUrl.pathname.startsWith("/login")
  const isRoot = request.nextUrl.pathname === "/"

  if (!isAuthenticated) {
    if (isLoginPage) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isLoginPage || isRoot) {
    return NextResponse.redirect(new URL("/instructions", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/instructions/:path*", "/dashboard/:path*"],
}
