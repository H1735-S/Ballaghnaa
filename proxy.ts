import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path  = req.nextUrl.pathname;

  
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  const role = (token.role as string) ?? "citizen";

  
  if (path.startsWith("/dashboard") && role === "citizen") {
    return NextResponse.redirect(new URL("/citizen", req.url));
  }

  
  if (path.startsWith("/citizen") && role !== "citizen") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/citizen/:path*"],
};
