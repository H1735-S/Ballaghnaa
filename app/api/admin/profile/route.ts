import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true,
      phone: true, nationalId: true, gender: true,
      avatarInitials: true, avatarColor: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, phone, nationalId, gender } = await req.json();

  try {
    const data: Record<string, string | null> = {};

    if (name?.trim()) {
      data.name = name.trim();
      data.avatarInitials = name.trim().split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
    }
    if (email?.trim())    data.email      = email.trim().toLowerCase();
    if (phone !== undefined)      data.phone      = phone?.trim()      || null;
    if (nationalId !== undefined) data.nationalId = nationalId?.trim() || null;
    if (gender !== undefined)     data.gender     = gender             || null;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true, name: true, email: true,
        phone: true, nationalId: true, gender: true,
        avatarInitials: true,
      },
    });
    return NextResponse.json(user);
  } catch (err: any) {
    if (err?.code === "P2002") return NextResponse.json({ error: "البريد الإلكتروني أو الرقم القومي مستخدم بالفعل" }, { status: 409 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
