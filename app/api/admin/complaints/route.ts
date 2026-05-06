import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status   = searchParams.get("status")   ?? undefined;
  const priority = searchParams.get("priority") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const search   = searchParams.get("search")   ?? undefined;
  const page     = parseInt(searchParams.get("page") ?? "1");
  const limit    = 15;

  try {
    const where = {
      ...(status   && { status:   status   as never }),
      ...(priority && { priority: priority as never }),
      ...(category && { categoryId: category }),
      ...(search && {
        OR: [
          { title:        { contains: search } },
          { trackingCode: { contains: search } },
          { body:         { contains: search } },
        ],
      }),
    };

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category:    { select: { id: true, name: true, nameEn: true, color: true } },
          submittedBy: { select: { name: true, avatarInitials: true } },
          assignee:    { select: { name: true, avatarInitials: true } },
        },
      }),
      prisma.complaint.count({ where }),
    ]);

    return NextResponse.json({ complaints, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("[admin/complaints]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
