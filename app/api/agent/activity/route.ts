import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);
  since.setHours(0, 0, 0, 0);

  
  const logs = await prisma.activityLog.findMany({
    where: { userId: session.user.id, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const map: Record<string, number> = {};
  for (const l of logs) {
    const d = l.createdAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    map[key] = (map[key] ?? 0) + 1;
  }

  const data = Object.entries(map).map(([date, count]) => [date, count]);
  return NextResponse.json({ data, year: new Date().getFullYear() });
}
