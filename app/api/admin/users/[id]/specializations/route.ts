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
    const specializations = await db.agentSpecialization.findMany({
      where: { userId: id },
      include: { category: { select: { id: true, name: true, nameEn: true, color: true } } },
    });
    return NextResponse.json(specializations);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { categoryIds } = await req.json();

  try {
    await prisma.$transaction(async (tx: any) => {
      await tx.agentSpecialization.deleteMany({ where: { userId: id } });
      if (categoryIds?.length) {
        await tx.agentSpecialization.createMany({
          data: categoryIds.map((categoryId: string) => ({ userId: id, categoryId })),
        });
      }
    });
  } catch {
    
  }

  return NextResponse.json({ success: true });
}
