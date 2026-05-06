import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status   = searchParams.get("status")   ?? undefined;
  const priority = searchParams.get("priority") ?? undefined;
  const sort     = searchParams.get("sort")     ?? "newest";
  const page     = parseInt(searchParams.get("page") ?? "1");
  const limit    = parseInt(searchParams.get("limit") ?? "10");

  const orderBy =
    sort === "oldest"   ? { createdAt: "asc"  as const } :
    sort === "priority" ? { priority:  "desc" as const } :
                          { createdAt: "desc" as const };

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: session.user.id },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  
  const where = {
    ...(specializedCategoryIds.length > 0
      ? { categoryId: { in: specializedCategoryIds } }
      : { assigneeId: session.user.id }), 
    ...(status   && { status:   status   as never }),
    ...(priority && { priority: priority as never }),
  };

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where, orderBy, skip: (page - 1) * limit, take: limit,
      include: {
        category:    { select: { name: true, nameEn: true, color: true } },
        submittedBy: { select: { name: true, avatarInitials: true } },
      },
    }),
    prisma.complaint.count({ where }),
  ]);

  return NextResponse.json({ complaints, total, pages: Math.ceil(total / limit) });
}
