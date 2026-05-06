import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    
    const specializations = await (prisma as any).agentSpecialization.findMany({
      where: { userId: session.user.id },
      include: { category: { select: { id: true, name: true, nameEn: true, color: true } } },
    });
    return NextResponse.json(specializations.map((s: any) => s.category)); 
  } catch {
    return NextResponse.json([]);
  }
}
