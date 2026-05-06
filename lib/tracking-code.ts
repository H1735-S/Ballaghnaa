import { prisma } from "@/lib/prisma";


export async function generateTrackingCode(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RES-${year}-`;

  
  const count = await prisma.complaint.count({
    where: { trackingCode: { startsWith: prefix } },
  });

  const seq = String(count + 1).padStart(5, "0");
  const code = `${prefix}${seq}`;

  
  const existing = await prisma.complaint.findUnique({ where: { trackingCode: code } });
  if (existing) {
    
    return `${prefix}${seq}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  }

  return code;
}
