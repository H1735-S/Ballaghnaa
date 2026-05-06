import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    
    const [totalComplaints, totalUsers, totalCategories] = await Promise.all([
      prisma.complaint.count(),
      prisma.user.count(),
      prisma.category.count(),
    ]);

    
    const statusGrouped = await prisma.complaint.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    const statusCounts: Record<string, number> = {};
    for (const row of statusGrouped) {
      statusCounts[row.status] = row._count.id;
    }

    const openComplaints     = statusCounts["open"]      ?? 0;
    const resolvedComplaints = statusCounts["resolved"]  ?? 0;
    const escalatedComplaints= statusCounts["escalated"] ?? 0;
    const resolutionRate     = totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    
    const userStatusGrouped = await prisma.user.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    const activeUsers = userStatusGrouped.find(r => r.status === "active")?._count.id ?? 0;

    
    const roleAssignments = await prisma.userRoleAssignment.findMany({
      select: { role: { select: { name: true } } },
    });
    const totalAgents      = roleAssignments.filter(r => r.role.name === "agent").length;
    const totalSupervisors = roleAssignments.filter(r => r.role.name === "supervisor").length;

    
    let pendingCategoryRequests = 0;
    try {
      pendingCategoryRequests = await (prisma as any).categoryRequest.count({
        where: { status: "pending" },
      });
    } catch {  }

    
    const recentComplaints = await prisma.complaint.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category:    { select: { name: true, color: true } },
        submittedBy: { select: { name: true, avatarInitials: true } },
        assignee:    { select: { name: true } },
      },
    });

    
    const byCategoryRaw = await prisma.complaint.groupBy({
      by: ["categoryId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 6,
    });
    const catIds = byCategoryRaw.map(r => r.categoryId);
    const cats   = catIds.length > 0
      ? await prisma.category.findMany({
          where: { id: { in: catIds } },
          select: { id: true, name: true, color: true },
        })
      : [];
    const catMap = Object.fromEntries(cats.map(c => [c.id, c]));
    const byCategory = byCategoryRaw.map(r => ({
      category: catMap[r.categoryId]?.name  ?? "Unknown",
      color:    catMap[r.categoryId]?.color ?? "#94a3b8",
      count:    r._count.id,
    }));

    
    const now = new Date();
    const months: { month: string; total: number; resolved: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const [total, resolved] = await Promise.all([
        prisma.complaint.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.complaint.count({
          where: { createdAt: { gte: start, lte: end }, status: { in: ["resolved", "closed"] as never[] } },
        }),
      ]);
      months.push({ month: d.toLocaleString("en", { month: "short" }), total, resolved });
    }

    return NextResponse.json({
      complaints: {
        total: totalComplaints,
        open: openComplaints,
        resolved: resolvedComplaints,
        escalated: escalatedComplaints,
        resolutionRate,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        agents: totalAgents,
        supervisors: totalSupervisors,
      },
      categories: { total: totalCategories, pendingRequests: pendingCategoryRequests },
      statusCounts,
      byCategory,
      complaintsOverTime: months,
      recentComplaints,
    });

  } catch (err) {
    console.error("[admin/stats] ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
