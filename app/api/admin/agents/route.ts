import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const agents = await (prisma as any).user.findMany({
    where: {
      status: "active",
      userRoles: { some: { role: { name: "agent" } } },
      ...(categoryId && {
        specializations: { some: { categoryId } },
      }),
    },
    select: {
      id: true, name: true, email: true, avatarInitials: true, avatarColor: true,
      specializations: { select: { category: { select: { id: true, name: true, color: true } } } },
      _count: { select: { assignedComplaints: { where: { status: { notIn: ["resolved", "closed", "rejected"] as never[] } } } } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(agents);
}
