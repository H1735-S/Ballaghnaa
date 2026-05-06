import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const db = prisma as any; 

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, status: true, phone: true,
        avatarInitials: true, avatarColor: true, supervisorType: true,
        createdAt: true,
        userRoles: { select: { role: { select: { name: true } } } },
        specializations: { select: { category: { select: { id: true, name: true, nameEn: true, color: true } } } },
        _count: { select: { assignedComplaints: true, submittedComplaints: true } },
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...user, roles: user.userRoles ?? [], specializations: user.specializations ?? [] });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status, role, supervisorType } = await req.json();

  try {
    if (status) {
      await prisma.user.update({ where: { id }, data: { status: status as any } }); 
    }
    if (supervisorType !== undefined) {
      await db.user.update({ where: { id }, data: { supervisorType } });
    }
    if (role) {
      const roleRecord = await prisma.role.findUnique({ where: { name: role } });
      if (roleRecord) {
        await prisma.userRoleAssignment.deleteMany({ where: { userId: id } });
        await prisma.userRoleAssignment.create({ data: { userId: id, roleId: roleRecord.id } });
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
