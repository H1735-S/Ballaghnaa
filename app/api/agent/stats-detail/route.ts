import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = session.user.id;
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: agentId },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  const baseWhere = specializedCategoryIds.length > 0
    ? { categoryId: { in: specializedCategoryIds } }
    : { assigneeId: agentId };

  const [complaints, thisMonthComplaints, lastMonthComplaints] = await Promise.all([
    prisma.complaint.findMany({
      where: baseWhere,
      include: { category: { select: { name: true, nameEn: true } } },
    }),
    prisma.complaint.findMany({
      where: { ...baseWhere, createdAt: { gte: thisMonthStart } },
      select: { status: true },
    }),
    prisma.complaint.findMany({
      where: { ...baseWhere, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      select: { status: true },
    }),
  ]);

  const total    = complaints.length;
  const resolved = complaints.filter(c => ["resolved", "closed"].includes(c.status)).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const statusMap: Record<string, number> = {};
  for (const c of complaints) statusMap[c.status] = (statusMap[c.status] ?? 0) + 1;
  const byStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  const catMap: Record<string, { count: number; nameEn: string }> = {};
  for (const c of complaints) {
    if (!catMap[c.category.name]) catMap[c.category.name] = { count: 0, nameEn: c.category.nameEn ?? "" };
    catMap[c.category.name].count += 1;
  }
  const byCategory = Object.entries(catMap).map(([name, { count, nameEn }]) => ({ name, nameEn, count }));

  const resolvedWithTime = complaints.filter(c => 
    (c.status === "resolved" || c.status === "closed") && 
    (c.resolvedAt || c.closedAt)
  );
  const avgResponseTime = resolvedWithTime.length > 0
    ? Math.round(resolvedWithTime.reduce((sum, c) => {
        const endTime = c.resolvedAt || c.closedAt;
        return sum + (new Date(endTime!).getTime() - new Date(c.createdAt).getTime()) / 3600000;
      }, 0) / resolvedWithTime.length)
    : 0;

  return NextResponse.json({
    byStatus, byCategory, resolutionRate, avgResponseTime,
    thisMonth: {
      total: thisMonthComplaints.length,
      resolved: thisMonthComplaints.filter(c => ["resolved", "closed"].includes(c.status)).length,
    },
    lastMonth: {
      total: lastMonthComplaints.length,
      resolved: lastMonthComplaints.filter(c => ["resolved", "closed"].includes(c.status)).length,
    },
  });
}
