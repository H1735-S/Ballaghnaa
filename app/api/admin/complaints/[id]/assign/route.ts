import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { assigneeId, status, categoryId, note } = await req.json();

  const data: Record<string, unknown> = {};
  if (assigneeId !== undefined) {
    data.assigneeId   = assigneeId;
    data.supervisorId = session.user.id;
    data.status       = "assigned";
  }
  if (status     !== undefined) data.status     = status;
  if (categoryId !== undefined) data.categoryId = categoryId;

  const complaint = await prisma.complaint.update({
    where: { id },
    data,
    include: {
      category: { select: { name: true, color: true } },
      assignee: { select: { name: true } },
    },
  });

  if (assigneeId) {
    await prisma.notification.create({
      data: {
        userId: assigneeId,
        title: "تم تعيين شكوى لك",
        body: `قام المدير بتعيين شكوى "${complaint.title}" لك`,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      action: assigneeId ? "complaint_assigned" : "complaint_updated",
      description: note ?? (assigneeId ? "Assigned to agent by admin" : "Updated by admin"),
      complaintId: id,
      userId: session.user.id,
    },
  });

  if (status) {
    await prisma.complaintStatusHistory.create({
      data: { complaintId: id, newStatus: status as never, changedById: session.user.id, note },
    });
  }

  return NextResponse.json(complaint);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { body, isInternal } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Body required" }, { status: 400 });

  const comment = await prisma.comment.create({
    data: { body, isInternal: isInternal ?? false, complaintId: id, authorId: session.user.id },
    include: { author: { select: { name: true, avatarInitials: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
