import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const hashPw = (pw: string) => hash(pw, 12);

async function main() {
  console.log("🌱 Seeding database...");

  
  const roleNames = ["citizen", "agent", "supervisor", "admin"] as const;
  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({ where: { name }, update: {}, create: { name, description: `${name} role` } })
    )
  );
  const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  
  const permKeys = [
    "complaint:create", "complaint:read", "complaint:update", "complaint:delete",
    "complaint:assign", "complaint:escalate", "complaint:close",
    "user:create", "user:read", "user:update", "user:delete",
    "category:manage", "settings:manage", "reports:view",
  ];
  const perms = await Promise.all(
    permKeys.map((key) =>
      prisma.permission.upsert({ where: { key }, update: {}, create: { key } })
    )
  );
  const permMap = Object.fromEntries(perms.map((p) => [p.key, p.id]));

  
  const rolePerms: Record<string, string[]> = {
    citizen:    ["complaint:create", "complaint:read"],
    agent:      ["complaint:read", "complaint:update", "complaint:close"],
    supervisor: ["complaint:read", "complaint:update", "complaint:assign", "complaint:escalate", "complaint:close", "reports:view"],
    admin:      permKeys, 
  };

  for (const [roleName, keys] of Object.entries(rolePerms)) {
    for (const key of keys) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleMap[roleName], permissionId: permMap[key] } },
        update: {},
        create: { roleId: roleMap[roleName], permissionId: permMap[key] },
      });
    }
  }

  
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: "الطرق والإنارة" },           update: { nameEn: "Roads & Lighting",       descriptionEn: "Road potholes, broken pavements, street lighting faults"        }, create: { name: "الطرق والإنارة",           nameEn: "Roads & Lighting",        description: "حفر الطرق، كسر الرصيف، عطل إنارة الشوارع",              descriptionEn: "Road potholes, broken pavements, street lighting faults",          color: "#f59e0b" } }),
    prisma.category.upsert({ where: { name: "الصرف الصحي" },              update: { nameEn: "Sewage & Drainage",      descriptionEn: "Blocked drains, broken pipes, sewage overflow in streets"       }, create: { name: "الصرف الصحي",              nameEn: "Sewage & Drainage",       description: "انسداد الصرف، كسر المواسير، مياه الصرف في الشوارع",     descriptionEn: "Blocked drains, broken pipes, sewage overflow in streets",         color: "#3b82f6" } }),
    prisma.category.upsert({ where: { name: "النظافة والقمامة" },          update: { nameEn: "Waste & Cleanliness",    descriptionEn: "Garbage accumulation, missed waste collection, pest spread"     }, create: { name: "النظافة والقمامة",          nameEn: "Waste & Cleanliness",     description: "تراكم القمامة، عدم رفع النفايات، انتشار الحشرات",       descriptionEn: "Garbage accumulation, missed waste collection, pest spread",       color: "#22c55e" } }),
    prisma.category.upsert({ where: { name: "مياه الشرب" },                update: { nameEn: "Drinking Water",         descriptionEn: "Water outages, low pressure, contaminated water supply"        }, create: { name: "مياه الشرب",                nameEn: "Drinking Water",          description: "انقطاع المياه، ضعف الضغط، تلوث مياه الشبكة",            descriptionEn: "Water outages, low pressure, contaminated water supply",           color: "#06b6d4" } }),
    prisma.category.upsert({ where: { name: "الكهرباء" },                  update: { nameEn: "Electricity",            descriptionEn: "Power outages, meter faults, dangerous electricity poles"       }, create: { name: "الكهرباء",                  nameEn: "Electricity",             description: "انقطاع التيار، عطل في العدادات، أعمدة كهرباء خطرة",     descriptionEn: "Power outages, meter faults, dangerous electricity poles",         color: "#eab308" } }),
    prisma.category.upsert({ where: { name: "البناء المخالف" },            update: { nameEn: "Illegal Construction",   descriptionEn: "Land encroachment, unlicensed construction, road obstruction"  }, create: { name: "البناء المخالف",            nameEn: "Illegal Construction",    description: "تعديات على الأراضي، بناء بدون ترخيص، إشغال الطريق",    descriptionEn: "Land encroachment, unlicensed construction, road obstruction",     color: "#ef4444" } }),
    prisma.category.upsert({ where: { name: "الحدائق والمناطق الخضراء" },  update: { nameEn: "Parks & Green Areas",    descriptionEn: "Neglected public parks, tree cutting, damaged benches"         }, create: { name: "الحدائق والمناطق الخضراء",  nameEn: "Parks & Green Areas",     description: "إهمال الحدائق العامة، قطع الأشجار، تلف المقاعد",        descriptionEn: "Neglected public parks, tree cutting, damaged benches",            color: "#16a34a" } }),
    prisma.category.upsert({ where: { name: "الضوضاء والتلوث" },           update: { nameEn: "Noise & Pollution",      descriptionEn: "Shop noise, air pollution, waste burning"                      }, create: { name: "الضوضاء والتلوث",           nameEn: "Noise & Pollution",       description: "ضوضاء المحلات، تلوث الهواء، حرق المخلفات",             descriptionEn: "Shop noise, air pollution, waste burning",                         color: "#8b5cf6" } }),
    prisma.category.upsert({ where: { name: "الخدمات الحكومية" },          update: { nameEn: "Government Services",    descriptionEn: "Delayed transactions, poor service at government offices"      }, create: { name: "الخدمات الحكومية",          nameEn: "Government Services",     description: "تأخر المعاملات، سوء الخدمة في المصالح الحكومية",        descriptionEn: "Delayed transactions, poor service at government offices",         color: "#64748b" } }),
    prisma.category.upsert({ where: { name: "أخرى" },                      update: { nameEn: "Other",                  descriptionEn: "Miscellaneous complaints not covered by other categories"      }, create: { name: "أخرى",                      nameEn: "Other",                   description: "شكاوى متنوعة لا تندرج ضمن الفئات السابقة",              descriptionEn: "Miscellaneous complaints not covered by other categories",         color: "#94a3b8" } }),
  ]);
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  
  const createUser = async (data: {
    name: string; email: string; password: string; status: string;
    supervisorId?: string; avatarInitials: string; avatarColor: string;
  }) =>
    prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: { ...data, status: data.status as "active" | "inactive" | "pending" },
    });

  const adminUser  = await createUser({ name: "Admin",        email: "admin@Ballaghna.com",       password: await hashPw("admin123"),    status: "active",   avatarInitials: "AD", avatarColor: "bg-gray-500"    });
  const sup1       = await createUser({ name: "Sarah Kim",    email: "sarah.kim@company.com",  password: await hashPw("password123"), status: "active",   avatarInitials: "SK", avatarColor: "bg-blue-500"    });
  const sup2       = await createUser({ name: "James Rivera", email: "james.r@company.com",    password: await hashPw("password123"), status: "active",   avatarInitials: "JR", avatarColor: "bg-violet-500"  });
  const lena       = await createUser({ name: "Lena Müller",  email: "lena.m@company.com",     password: await hashPw("password123"), status: "active",   supervisorId: sup1.id, avatarInitials: "LM", avatarColor: "bg-cyan-500"    });
  const tom        = await createUser({ name: "Tom Walsh",    email: "tom.walsh@company.com",  password: await hashPw("password123"), status: "active",   supervisorId: sup1.id, avatarInitials: "TW", avatarColor: "bg-emerald-500" });
  const omar       = await createUser({ name: "Omar Hassan",  email: "omar.h@company.com",     password: await hashPw("password123"), status: "inactive", supervisorId: sup2.id, avatarInitials: "OH", avatarColor: "bg-amber-500"   });
  const priya      = await createUser({ name: "Priya Nair",   email: "priya.n@company.com",    password: await hashPw("password123"), status: "active",   avatarInitials: "PN", avatarColor: "bg-rose-500"    });
  const chloe      = await createUser({ name: "Chloe Dupont", email: "chloe.d@company.com",    password: await hashPw("password123"), status: "pending",  avatarInitials: "CD", avatarColor: "bg-pink-500"    });

  
  const userRoleMap: [string, string][] = [
    [adminUser.id, "admin"],
    [sup1.id,      "supervisor"],
    [sup2.id,      "supervisor"],
    [lena.id,      "agent"],
    [tom.id,       "agent"],
    [omar.id,      "agent"],
    [priya.id,     "citizen"],
    [chloe.id,     "citizen"],
  ];
  for (const [userId, roleName] of userRoleMap) {
    await prisma.userRoleAssignment.upsert({
      where: { userId_roleId: { userId, roleId: roleMap[roleName] } },
      update: {},
      create: { userId, roleId: roleMap[roleName] },
    });
  }

  
  const complaintsData = [
    { title: "حفرة كبيرة في شارع التحرير تعيق المرور",           categoryId: catMap["الطرق والإنارة"],           priority: "critical", status: "escalated",   submittedById: priya.id,  assigneeId: lena.id  },
    { title: "انسداد بالوعة الصرف أمام مدرسة النيل",             categoryId: catMap["الصرف الصحي"],              priority: "high",     status: "open",        submittedById: chloe.id,  assigneeId: tom.id   },
    { title: "تراكم القمامة في حي المعادي منذ أسبوع",            categoryId: catMap["النظافة والقمامة"],          priority: "medium",   status: "in_progress", submittedById: priya.id,  assigneeId: lena.id  },
    { title: "انقطاع مياه الشرب في شارع الهرم منذ يومين",        categoryId: catMap["مياه الشرب"],               priority: "high",     status: "open",        submittedById: chloe.id,  assigneeId: tom.id   },
    { title: "عمود إنارة مكسور يشكل خطراً على المارة",           categoryId: catMap["الطرق والإنارة"],           priority: "critical", status: "escalated",   submittedById: priya.id,  assigneeId: omar.id  },
    { title: "انقطاع متكرر للكهرباء في منطقة الدقي",             categoryId: catMap["الكهرباء"],                 priority: "high",     status: "in_progress", submittedById: chloe.id,  assigneeId: lena.id  },
    { title: "بناء مخالف على أرض فضاء بجوار المسجد",             categoryId: catMap["البناء المخالف"],           priority: "medium",   status: "open",        submittedById: priya.id,  assigneeId: omar.id  },
    { title: "إهمال حديقة الأطفال في حي الزيتون",                categoryId: catMap["الحدائق والمناطق الخضراء"], priority: "low",      status: "resolved",    submittedById: chloe.id,  assigneeId: tom.id   },
    { title: "ضوضاء شديدة من مصنع مجاور طوال الليل",             categoryId: catMap["الضوضاء والتلوث"],          priority: "high",     status: "open",        submittedById: priya.id,  assigneeId: lena.id  },
    { title: "تأخر استخراج شهادة الميلاد لأكثر من شهر",          categoryId: catMap["الخدمات الحكومية"],         priority: "medium",   status: "in_progress", submittedById: chloe.id,  assigneeId: lena.id  },
    { title: "كسر في ماسورة مياه يسبب فيضان الشارع",             categoryId: catMap["مياه الشرب"],               priority: "critical", status: "escalated",   submittedById: priya.id,  assigneeId: tom.id   },
    { title: "حرق مخلفات في الشارع يسبب تلوث الهواء",            categoryId: catMap["الضوضاء والتلوث"],          priority: "high",     status: "open",        submittedById: chloe.id,  assigneeId: omar.id  },
    { title: "رصيف مكسور يعيق حركة ذوي الاحتياجات الخاصة",       categoryId: catMap["الطرق والإنارة"],           priority: "medium",   status: "resolved",    submittedById: priya.id,  assigneeId: lena.id  },
    { title: "مياه الصرف الصحي تطفح في الشارع الرئيسي",          categoryId: catMap["الصرف الصحي"],              priority: "critical", status: "in_progress", submittedById: chloe.id,  assigneeId: tom.id   },
    { title: "سوء معاملة موظف في مكتب الشهر العقاري",            categoryId: catMap["الخدمات الحكومية"],         priority: "low",      status: "closed",      submittedById: priya.id,  assigneeId: omar.id  },
  ];

  type ComplaintInput = {
    title: string; categoryId: string; priority: string;
    status: string; submittedById: string; assigneeId: string;
  };
  for (const data of complaintsData) {
    
    await prisma.complaint.create({ data: data as any });
  }

  
  for (const s of [
    { key: "app_name",                 value: "بلّغنا" },
    { key: "support_email",            value: "support@Ballaghna.com" },
    { key: "default_priority",         value: "medium" },
    { key: "auto_assign",              value: "false" },
    { key: "max_complaints_per_agent", value: "30" },
  ]) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("✅ Seed complete.");
  console.log("   admin      → admin@Ballaghna.com        / admin123");
  console.log("   supervisor → sarah.kim@company.com   / password123");
  console.log("   agent      → lena.m@company.com      / password123");
  console.log("   citizen    → priya.n@company.com     / password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
