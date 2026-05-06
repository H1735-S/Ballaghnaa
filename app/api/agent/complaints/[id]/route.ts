import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: session.user.id },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  
  const accessFilter = specializedCategoryIds.length > 0
    ? { OR: [{ assigneeId: session.user.id }, { categoryId: { in: specializedCategoryIds } }] }
    : { assigneeId: session.user.id };

  const complaint = await prisma.complaint.findFirst({
    where: { id, ...accessFilter },
    include: {
      category:    { select: { name: true, color: true } },
      submittedBy: { select: { name: true, avatarInitials: true, email: true } },
      assignee:    { select: { name: true, avatarInitials: true } },
      attachments: { orderBy: { createdAt: "asc" } },
      comments:    { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true, avatarInitials: true } } } },
      statusHistory: { orderBy: { createdAt: "asc" }, include: { changedBy: { select: { name: true } } } },
    },
  });

  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(complaint);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: session.user.id },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  const accessFilter = specializedCategoryIds.length > 0
    ? { OR: [{ assigneeId: session.user.id }, { categoryId: { in: specializedCategoryIds } }] }
    : { assigneeId: session.user.id };

  const complaint = await prisma.complaint.findFirst({ where: { id, ...accessFilter } });
  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updateData: Record<string, unknown> = {};
  if (body.status) updateData.status = body.status;
  if (body.status === "resolved") updateData.resolvedAt = new Date();
  if (body.status === "closed")   updateData.closedAt   = new Date();

  const updated = await prisma.complaint.update({ where: { id }, data: updateData });

  
  if (body.status) {
    await prisma.complaintStatusHistory.create({
      data: { complaintId: id, oldStatus: complaint.status as never, newStatus: body.status as never, changedById: session.user.id, note: body.note ?? null },
    });
    await prisma.activityLog.create({
      data: { action: "status_changed", description: `Status changed to ${body.status}`, complaintId: id, userId: session.user.id },
    });
    
    await prisma.notification.create({
      data: {
        userId: complaint.submittedById,
        title: "تحديث حالة شكواك",
        body: `تم تحديث حالة شكواك إلى "${body.status.replace(/_/g, " ")}"`,
      },
    });
  }

  return NextResponse.json(updated);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body, isInternal } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Comment required" }, { status: 400 });

  
  const specs = await (prisma as any).agentSpecialization.findMany({
    where: { userId: session.user.id },
    select: { categoryId: true },
  });
  const specializedCategoryIds: string[] = specs.map((s: { categoryId: string }) => s.categoryId);

  const accessFilter = specializedCategoryIds.length > 0
    ? { OR: [{ assigneeId: session.user.id }, { categoryId: { in: specializedCategoryIds } }] }
    : { assigneeId: session.user.id };

  const complaint = await prisma.complaint.findFirst({ where: { id, ...accessFilter } });
  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { body, complaintId: id, authorId: session.user.id, isInternal: isInternal ?? false },
    include: { author: { select: { name: true, avatarInitials: true } } },
  });

  
  if (!isInternal) {
    await prisma.notification.create({
      data: {
        userId: complaint.submittedById,
        title: "رد جديد على شكواك",
        body: `أضاف الوكيل تعليقاً على شكواك: "${body.slice(0, 80)}${body.length > 80 ? "..." : ""}"`,
      },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}
