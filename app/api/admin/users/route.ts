import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";


const db = prisma as any;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true, status: true,
        avatarInitials: true, avatarColor: true,
        supervisorType: true, supervisorId: true,
        userRoles: { select: { role: { select: { name: true } } } },
        specializations: {
          select: { category: { select: { id: true, name: true, nameEn: true, color: true } } },
        },
        _count: { select: { assignedComplaints: true } },
      },
    });

    const normalized = users.map((u: any) => ({ 
      ...u,
      roles: u.userRoles ?? [],
      specializations: u.specializations ?? [],
    }));

    return NextResponse.json(normalized);
  } catch {
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true, status: true,
        avatarInitials: true, avatarColor: true,
        userRoles: { select: { role: { select: { name: true } } } },
        _count: { select: { assignedComplaints: true } },
      },
    });

    return NextResponse.json(users.map(u => ({
      ...u,
      roles: u.userRoles ?? [],
      specializations: [],
      supervisorType: null,
    })));
  }
}
