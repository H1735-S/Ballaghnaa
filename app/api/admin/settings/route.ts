import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";



export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const prefix = `user:${session.user.id}:`;
  const rows = await prisma.setting.findMany({
    where: { key: { startsWith: prefix } },
  });

  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key.replace(prefix, "")] = row.value;
  }
  return NextResponse.json(result);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Record<string, string> = await req.json();
  const prefix = `user:${session.user.id}:`;

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key: `${prefix}${key}` },
        update: { value: String(value) },
        create: { key: `${prefix}${key}`, value: String(value) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
