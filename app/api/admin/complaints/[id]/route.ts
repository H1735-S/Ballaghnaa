import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["admin", "supervisor"].includes(session.user.role ?? ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      category:    { select: { name: true, nameEn: true, color: true } },
      department:  { select: { name: true } },
      submittedBy: { select: { name: true, avatarInitials: true, email: true } },
      assignee:    { select: { id: true, name: true, avatarInitials: true } },
      supervisor:  { select: { id: true, name: true } },
      attachments: { orderBy: { createdAt: "asc" } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, avatarInitials: true } } },
      },
      statusHistory: {
        orderBy: { createdAt: "asc" },
        include: { changedBy: { select: { name: true } } },
      },
    },
  });

  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(complaint);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["admin", "supervisor"].includes(session.user.role ?? ""))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status, note, assigneeId, priority } = await req.json();

  const data: Record<string, unknown> = {};
  if (status)     data.status     = status;
  if (assigneeId) data.assigneeId = assigneeId;
  if (priority)   data.priority   = priority;
  if (status === "resolved") data.resolvedAt = new Date();
  if (status === "closed")   data.closedAt   = new Date();

  const updated = await prisma.complaint.update({ where: { id }, data });

  if (status) {
    await prisma.complaintStatusHistory.create({
      data: { complaintId: id, newStatus: status as never, changedById: session.user.id, note: note ?? null },
    });
    await prisma.activityLog.create({
      data: { action: "status_changed", description: `Admin changed status to ${status}`, complaintId: id, userId: session.user.id },
    });
  }

  return NextResponse.json(updated);
}
