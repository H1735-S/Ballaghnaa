import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { complaints: true } },
    },
  });

  
  const withStats = await Promise.all(
    categories.map(async (cat) => {
      const resolved = await prisma.complaint.count({
        where: { categoryId: cat.id, status: { in: ["resolved", "closed"] as never[] } },
      });
      return {
        id: cat.id,
        name: cat.name,
        nameEn: cat.nameEn,
        color: cat.color,
        description: cat.description,
        descriptionEn: cat.descriptionEn,
        total: cat._count.complaints,
        resolved,
      };
    })
  );

  return NextResponse.json(withStats);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, nameEn, color, description, descriptionEn } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  try {
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        nameEn: nameEn?.trim() ?? "",
        color: color ?? "#94a3b8",
        description: description?.trim() ?? null,
        descriptionEn: descriptionEn?.trim() ?? null,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Category already exists or error occurred" }, { status: 400 });
  }
}
