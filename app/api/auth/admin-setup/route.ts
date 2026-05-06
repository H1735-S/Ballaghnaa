import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";


async function ensureRoles() {
  const roleNames = ["admin", "agent", "citizen"] as const;
  await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      })
    )
  );
}

export async function POST(req: Request) {
  try {
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken || setupToken.trim() === "") {
      return NextResponse.json({ error: "غير متاح" }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
    }

    const { name, email, password, token, phone, nationalId, gender } = body;

    
    const crypto = await import("crypto");
    const provided = Buffer.from(String(token ?? ""));
    const expected = Buffer.from(setupToken);
    const valid =
      provided.length === expected.length &&
      crypto.timingSafeEqual(provided, expected);

    if (!valid) {
      return NextResponse.json({ error: "رمز غير صحيح" }, { status: 403 });
    }

    
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "بريد إلكتروني غير صحيح" }, { status: 400 });
    }

    
    await ensureRoles();

    const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
    if (!adminRole) {
      return NextResponse.json({ error: "خطأ في إعداد الأدوار" }, { status: 500 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    
    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { userRoles: { include: { role: true } } },
    });

    if (exists) {
      const hasAdmin = exists.userRoles.some((r) => r.role.name === "admin");
      if (!hasAdmin) {
        
        await prisma.userRoleAssignment.upsert({
          where: { userId_roleId: { userId: exists.id, roleId: adminRole.id } },
          update: {},
          create: { userId: exists.id, roleId: adminRole.id },
        });
        await prisma.user.update({ where: { id: exists.id }, data: { status: "active" } });
        return NextResponse.json({ success: true, id: exists.id }, { status: 200 });
      }
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }

    
    const hashed = await hash(password, 12);
    const initials = name.trim().split(" ").map((w: string) => w[0] ?? "").join("").toUpperCase().slice(0, 2);

    const user = await prisma.user.create({
      data: {
        name:           name.trim(),
        email:          normalizedEmail,
        password:       hashed,
        status:         "active",
        avatarInitials: initials || "AD",
        avatarColor:    "bg-gray-500",
        phone:          phone?.trim()      || null,
        nationalId:     nationalId?.trim() || null,
        gender:         gender             || null,
        userRoles:      { create: { roleId: adminRole.id } },
      },
    });

    return NextResponse.json({ success: true, id: user.id }, { status: 201 });
  } catch (err) {
    console.error("[admin-setup] error:", err);
    return NextResponse.json(
      { error: "حدث خطأ داخلي، تحقق من الـ console" },
      { status: 500 }
    );
  }
}
