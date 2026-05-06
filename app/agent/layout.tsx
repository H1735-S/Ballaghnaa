import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AgentShell } from "@/components/agent/AgentShell";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role ?? "";

  // supervisor role removed — sign out stale sessions
  if (role === "supervisor") redirect("/auth/signout");

  if (!["agent", "admin"].includes(role)) redirect("/citizen");

  return <AgentShell user={session.user}>{children}</AgentShell>;
}
