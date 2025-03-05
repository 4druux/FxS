import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken");
  const userRole = request.cookies.get("userRole");

  if (pathname.startsWith("/admin")) {
    if (!authToken || userRole?.value !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  const authRoutes = ["/login", "/register", "/forgot-password"];
  if (authToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register", "/forgot-password"],
};
