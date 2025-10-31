import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If the user is logged in, redirect them from login/register to the dashboard
    if (
      token &&
      (pathname.startsWith("/login") || pathname.startsWith("/register"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/admin") && token?.role !== "nacer_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        const protectedPaths = [
          "/dashboard",
          "/proposal",
          "/admin",
          "/insights",
        ];

        // If the path is protected, a token is required
        if (protectedPaths.some((path) => pathname.startsWith(path))) {
          return !!token;
        }

        // Public pages don't require a token
        return true;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/proposal/:path*",
    "/admin/:path*",
    "/insights",
    "/login",
    "/register",
  ],
};
