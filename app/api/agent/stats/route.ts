import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = session.user.id;

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: agentId },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  
  const baseWhere = specializedCategoryIds.length > 0
    ? { categoryId: { in: specializedCategoryIds } }
    : { assigneeId: agentId };

  const [total, open, inProgress, resolved, urgent, recentActivity] = await Promise.all([
    prisma.complaint.count({ where: baseWhere }),
    prisma.complaint.count({ where: { ...baseWhere, status: { in: ["open", "in_review", "assigned"] as never[] } } }),
    prisma.complaint.count({ where: { ...baseWhere, status: "in_progress" as never } }),
    prisma.complaint.count({ where: { ...baseWhere, status: { in: ["resolved", "closed"] as never[] } } }),
    prisma.complaint.count({ where: { ...baseWhere, priority: { in: ["critical", "high"] as never[] }, status: { notIn: ["resolved", "closed", "rejected"] as never[] } } }),
    prisma.activityLog.findMany({
      where: { userId: agentId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { action: true, description: true, createdAt: true, complaintId: true },
    }),
  ]);

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return NextResponse.json({ total, open, inProgress, resolved, urgent, resolutionRate, recentActivity });
}
