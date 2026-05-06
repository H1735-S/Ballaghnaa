import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    
    const [total, resolved, escalated, open, inProgress, closed, rejected] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "resolved" as never } }),
      prisma.complaint.count({ where: { status: "escalated" as never } }),
      prisma.complaint.count({ where: { status: "open" as never } }),
      prisma.complaint.count({ where: { status: "in_progress" as never } }),
      prisma.complaint.count({ where: { status: "closed" as never } }),
      prisma.complaint.count({ where: { status: "rejected" as never } }),
    ]);
    const resolutionRate = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;
    const escalationRate = total > 0 ? Math.round((escalated / total) * 100) : 0;

    
    const [statusGrouped, priorityGrouped] = await Promise.all([
      prisma.complaint.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.complaint.groupBy({ by: ["priority"], _count: { id: true } }),
    ]);
    const statusCounts   = Object.fromEntries(statusGrouped.map(r => [r.status, r._count.id]));
    const priorityCounts = Object.fromEntries(priorityGrouped.map(r => [r.priority, r._count.id]));

    
    const byCategoryRaw = await prisma.complaint.groupBy({
      by: ["categoryId"], _count: { id: true },
      orderBy: { _count: { id: "desc" } }, take: 8,
    });
    const catIds = byCategoryRaw.map(r => r.categoryId);
    const cats = catIds.length > 0
      ? await prisma.category.findMany({ where: { id: { in: catIds } }, select: { id: true, name: true, nameEn: true, color: true } })
      : [];
    const catMap = Object.fromEntries(cats.map(c => [c.id, c]));
    const byCategory = byCategoryRaw.map(r => ({
      category:   catMap[r.categoryId]?.name   ?? "Unknown",
      categoryEn: catMap[r.categoryId]?.nameEn ?? catMap[r.categoryId]?.name ?? "Unknown",
      color: catMap[r.categoryId]?.color ?? "#94a3b8",
      count: r._count.id,
    }));

    
    const now = new Date();
    const complaintsOverTime: { month: string; total: number; resolved: number; escalated: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const [t2, r2, e2] = await Promise.all([
        prisma.complaint.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.complaint.count({ where: { createdAt: { gte: start, lte: end }, status: { in: ["resolved", "closed"] as never[] } } }),
        prisma.complaint.count({ where: { createdAt: { gte: start, lte: end }, status: "escalated" as never } }),
      ]);
      complaintsOverTime.push({ month: d.toLocaleString("en", { month: "short" }), total: t2, resolved: r2, escalated: e2 });
    }

    
    const agents = await prisma.user.findMany({
      where: { userRoles: { some: { role: { name: "agent" } } } },
      select: {
        id: true, name: true, avatarColor: true, status: true,
        _count: { select: { assignedComplaints: true } },
      },
      orderBy: { assignedComplaints: { _count: "desc" } },
      take: 8,
    });

    
    const agentPerformance = await Promise.all(agents.map(async a => {
      const resolvedCount = await prisma.complaint.count({
        where: { assigneeId: a.id, status: { in: ["resolved", "closed"] as never[] } },
      });
      return {
        name: a.name,
        color: a.avatarColor ?? "#1E3A5F",
        total: a._count.assignedComplaints,
        resolved: resolvedCount,
        rate: a._count.assignedComplaints > 0
          ? Math.round((resolvedCount / a._count.assignedComplaints) * 100) : 0,
      };
    }));
    const citizenStats = await prisma.user.findMany({
      where: { userRoles: { some: { role: { name: "citizen" } } } },
      select: { _count: { select: { submittedComplaints: true } } },
    });
    const totalCitizens      = citizenStats.length;
    const activeCitizens     = citizenStats.filter(c => c._count.submittedComplaints > 0).length;
    const avgComplaintsPerCitizen = totalCitizens > 0
      ? Math.round((citizenStats.reduce((s, c) => s + c._count.submittedComplaints, 0) / totalCitizens) * 10) / 10
      : 0;

    
    const unassigned = await prisma.complaint.count({
      where: { assigneeId: null, status: { notIn: ["resolved", "closed", "rejected"] as never[] } },
    });

    return NextResponse.json({
      summary: { total, resolved, escalated, open, inProgress, closed, rejected, resolutionRate, escalationRate, unassigned },
      statusCounts,
      priorityCounts,
      byCategory,
      complaintsOverTime,
      agentPerformance,
      citizenStats: { total: totalCitizens, active: activeCitizens, avgComplaints: avgComplaintsPerCitizen },
    });
  } catch (err) {
    console.error("[admin/analytics]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
