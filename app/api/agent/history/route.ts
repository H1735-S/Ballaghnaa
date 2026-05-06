import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get("page")  ?? "1"));
  const limit    = Math.max(1, parseInt(searchParams.get("limit") ?? "15"));
  const category = searchParams.get("category") ?? undefined;
  const from     = searchParams.get("from")     ?? undefined;
  const to       = searchParams.get("to")       ?? undefined;

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: session.user.id },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  const baseWhere = specializedCategoryIds.length > 0
    ? { categoryId: { in: specializedCategoryIds } }
    : { assigneeId: session.user.id };

  const where = {
    ...baseWhere,
    status: { in: ["resolved", "closed"] as never[] },
    ...(category && { category: { name: category } }),
    ...(from || to ? {
      createdAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to   ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) } : {}),
      },
    } : {}),
  };

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { resolvedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category:      { select: { name: true, color: true } },
        submittedBy:   { select: { name: true, avatarInitials: true } },
        statusHistory: { orderBy: { createdAt: "asc" }, include: { changedBy: { select: { name: true } } } },
      },
    }),
    prisma.complaint.count({ where }),
  ]);

  return NextResponse.json({ complaints, total, pages: Math.ceil(total / limit) });
}
