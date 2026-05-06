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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin(session)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.setting.findMany({
    where: { key: { startsWith: "admin_request:" } },
    orderBy: { updatedAt: "desc" },
  });

  const requests = rows.map((r) => {
    const userId = r.key.replace("admin_request:", "");
    const data = JSON.parse(r.value);
    return { userId, ...data };
  });

  return NextResponse.json(requests);
}
