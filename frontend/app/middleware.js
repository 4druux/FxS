import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken");
  const userRole = request.cookies.get("userRole");

  if (pathname.startsWith("/admin")) {
    if (!authToken || userRole?.value !== "admin") {
      // User belum login atau bukan admin
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
