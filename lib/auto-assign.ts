import { prisma } from "@/lib/prisma";


export async function autoAssignComplaint(complaintId: string, categoryId: string, categoryName: string) {
  
  const specialists = await (prisma as any).agentSpecialization.findMany({
    where: { categoryId },
    include: {
      user: {
        select: {
          id: true,
          status: true,
          _count: { select: { assignedComplaints: { where: { status: { notIn: ["resolved", "closed", "rejected"] } } } } },
        },
      },
    },
  });

  
  const activeSpecialists = specialists
    .filter((s: any) => s.user.status === "active")
    .sort((a: any, b: any) => a.user._count.assignedComplaints - b.user._count.assignedComplaints); 

  const isOther = categoryName === "أخرى" || categoryName.toLowerCase() === "other";

  if (!isOther && activeSpecialists.length > 0) {
    
    const agent = activeSpecialists[0].user;
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { assigneeId: agent.id, status: "assigned" },
    });

    
    await prisma.notification.create({
      data: {
        userId: agent.id,
        title: "شكوى جديدة معينة لك",
        body: `تم تعيين شكوى جديدة في تخصصك (${categoryName})`,
      },
    });

    return { assignedTo: "agent", agentId: agent.id };
  }

  
  
  const admins = await (prisma as any).user.findMany({
    where: {
      status: "active",
      userRoles: { some: { role: { name: "admin" } } },
    },
    select: { id: true },
  });

  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map((admin: { id: string }) => ({
        userId: admin.id,
        title: isOther ? "شكوى بفئة غير محددة" : "شكوى تحتاج تعيين",
        body: isOther
          ? `مواطن قدّم شكوى باختيار "أخرى" - يحتاج مراجعة وتصنيف`
          : `شكوى جديدة في فئة "${categoryName}" لا يوجد وكيل متخصص لها`,
      })),
    });
  }

  return { assignedTo: "unassigned" };
}
