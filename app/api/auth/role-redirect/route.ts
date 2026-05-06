import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const baseUrl = new URL(req.url).origin;

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", baseUrl));
  }

  const role = (session.user as { role?: string }).role ?? "citizen";
  const map: Record<string, string> = {
    admin:      "/dashboard",
    supervisor: "/dashboard",
    agent:      "/agent",
    citizen:    "/citizen",
  };

  return NextResponse.redirect(new URL(map[role] ?? "/citizen", baseUrl));
}
