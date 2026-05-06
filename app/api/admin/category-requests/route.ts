import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const db = prisma as any; 

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const requests = await db.categoryRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        requestedBy: { select: { id: true, name: true, avatarInitials: true, avatarColor: true } },
        reviewedBy:  { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(requests);
  } catch {
    return NextResponse.json([]);
  }
}
