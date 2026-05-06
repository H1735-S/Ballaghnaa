import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(context.params);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, nameEn, color, description, descriptionEn } = body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name          !== undefined && { name:          String(name).trim()                              }),
        ...(nameEn        !== undefined && { nameEn:        String(nameEn ?? "").trim()                      }),
        ...(color         !== undefined && { color:         String(color)                                    }),
        ...(description   !== undefined && { description:   description   ? String(description).trim()   : null }),
        ...(descriptionEn !== undefined && { descriptionEn: descriptionEn ? String(descriptionEn).trim() : null }),
      },
    });
    return NextResponse.json(category);
  } catch (err: any) {
    console.error("[categories/PATCH] id:", id, "error:", err?.code, err?.message);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    }
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ error: err?.message ?? "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await Promise.resolve(context.params);

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[categories/DELETE] id:", id, "error:", err?.code, err?.message);
    return NextResponse.json({ error: err?.message ?? "Cannot delete" }, { status: 400 });
  }
}
