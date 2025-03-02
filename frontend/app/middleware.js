import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken");

  const isProtectedRoute = pathname.startsWith("/admin/dashboard");

  // Kalau masuk halaman admin/dashboard tanpa token = redirect + kasih reason expired
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "session_expired");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Proteksi semua di bawah /admin
};
