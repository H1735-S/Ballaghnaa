import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const requests = await prisma.categoryRequest.findMany({
      where: { requestedById: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { nameAr, nameEn, description } = await req.json();
  if (!nameAr?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  try {
    const request = await prisma.categoryRequest.create({
      data: {
        nameAr: nameAr.trim(),
        nameEn: nameEn?.trim() ?? null,
        description: description?.trim() ?? null,
        requestedById: session.user.id,
        status: "pending",
      },
    });

    const generalSupervisors = await prisma.user.findMany({
      where: {
        status: "active",
        supervisorType: "general",
        userRoles: { some: { role: { name: "supervisor" } } },
      },
      select: { id: true },
    });

    const agent = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true } });

    if (generalSupervisors.length > 0) {
      await prisma.notification.createMany({
        data: generalSupervisors.map((s: { id: string }) => ({
          userId: s.id,
          title: "طلب إضافة فئة جديدة",
          body: `الوكيل ${agent?.name} يطلب إضافة فئة "${nameAr}"`,
        })),
      });
    }

    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    console.error("[category-request POST]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
