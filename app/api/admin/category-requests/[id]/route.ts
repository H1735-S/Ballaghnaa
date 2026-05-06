import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const db = prisma as any; 


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { color } = await req.json();

  try {
    const request = await db.categoryRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

    
    const category = await prisma.category.create({
      data: {
        name:   request.nameAr,
        nameEn: request.nameEn ?? "",
        color:  color ?? "#94a3b8",
        description: request.description ?? null,
      },
    });

    
    await db.categoryRequest.update({
      where: { id },
      data: { status: "approved", reviewedById: session.user.id },
    });

    
    await prisma.notification.create({
      data: {
        userId: request.requestedById,
        title: "تم إنشاء الفئة المطلوبة",
        body: `تم إنشاء فئة "${request.nameAr}" بنجاح`,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}


export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const request = await db.categoryRequest.update({
      where: { id },
      data: { status: "rejected", reviewedById: session.user.id },
    });

    await prisma.notification.create({
      data: {
        userId: request.requestedById,
        title: "تم رفض طلب الفئة",
        body: `تم رفض طلب إضافة فئة "${request.nameAr}" من قبل المدير`,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
