"use client";

import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/lib/language-context";
import Link from "next/link";
import { NotificationBell } from "@/components/ui/notification-bell";

interface Props {
  user?: { name?: string | null; email?: string | null };
  onMenuToggle?: () => void;
}

export function AdminNavbar({ user, onMenuToggle }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "AD";

  return (
    <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-accent transition-colors" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>

      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        {t("مدير", "Admin")}
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <div className="h-5 w-px bg-border" />

        <NotificationBell apiBase="/api/agent/notifications" />

        <Link href="/dashboard/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
          title={t("ملفي الشخصي", "My Profile")}>
          {initials}
        </Link>

        <button onClick={() => router.push('/auth/signout')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">{t("خروج", "Sign out")}</span>
        </button>
      </div>
    </header>
  );
}
