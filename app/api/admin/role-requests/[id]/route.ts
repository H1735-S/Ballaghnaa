import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function isAdmin(session: any) {
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { userRoles: { include: { role: true } } },
  });
  return user?.userRoles.some((r) => r.role.name === "admin") ?? false;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin(session)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action } = await req.json();
  const { id: userId } = await params;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "approve") {
    const [adminRole, citizenRole] = await Promise.all([
      prisma.role.findUnique({ where: { name: "admin" } }),
      prisma.role.findUnique({ where: { name: "citizen" } }),
    ]);

    if (!adminRole) return NextResponse.json({ error: "Admin role not found" }, { status: 500 });

    if (citizenRole) {
      await prisma.userRoleAssignment.deleteMany({
        where: { userId, roleId: citizenRole.id },
      });
    }

    await prisma.userRoleAssignment.upsert({
      where: { userId_roleId: { userId, roleId: adminRole.id } },
      update: {},
      create: { userId, roleId: adminRole.id },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: "تمت الموافقة على طلبك",
        body: "تهانينا! تمت الموافقة على طلبك للحصول على صلاحية المدير. يمكنك الآن تسجيل الدخول بصلاحيات المدير.",
      },
    });
  }

  if (action === "reject") {
    await prisma.notification.create({
      data: {
        userId,
        title: "تم رفض طلبك",
        body: "نأسف لإبلاغك بأنه تم رفض طلبك للحصول على صلاحية المدير. يرجى التواصل معنا لمزيد من التفاصيل.",
      },
    });
  }

  await prisma.setting.deleteMany({ where: { key: `admin_request:${userId}` } });

  return NextResponse.json({ success: true });
}
