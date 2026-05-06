"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquareWarning, Tag, BarChart3,
  Users, Settings, ChevronLeft, Headphones, Inbox, Shield, UserCheck, UserCog,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";
import { usePageTransition } from "@/components/PageTransition";

function Tooltip({ label, children, show }: { label: string; children: React.ReactNode; show: boolean }) {
  return (
    <div className="relative group/tip flex">
      {children}
      {show && (
        <div className="pointer-events-none absolute start-full top-1/2 z-50 ms-3 -translate-y-1/2">
          <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className="whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-xl">
            {label}
            <span className="absolute end-full top-1/2 -translate-y-1/2 border-4 border-transparent border-e-foreground" />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ href, icon: Icon, label, badge, isActive, collapsed, onClose }: {
  href: string; icon: React.ElementType; label: string;
  badge?: number; isActive: boolean; collapsed: boolean; onClose?: () => void;
}) {
  return (
    <Tooltip label={label} show={collapsed}>
      <Link href={href} onClick={onClose} className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium select-none transition-all duration-200",
        isActive ? "text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:text-foreground",
        collapsed && "justify-center px-0"
      )}>
        {isActive && <motion.span layoutId="admin-active-bg" className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary/80" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
        {!isActive && <span className="absolute inset-0 rounded-xl bg-transparent transition-colors duration-200 group-hover:bg-accent" />}
        <span className="relative z-10 flex shrink-0 items-center justify-center">
          <Icon className={cn("transition-all duration-200", isActive ? "text-white drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110")} style={{ width: 18, height: 18 }} />
        </span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative z-10 flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap">
              {label}
              {badge !== undefined && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={cn("ms-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                    isActive ? "bg-white/25 text-white" : "bg-primary/15 text-primary")}>
                  {badge}
                </motion.span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
        {collapsed && badge !== undefined && <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-sidebar" />}
      </Link>
    </Tooltip>
  );
}

export function AdminSidebar({ collapsed, onToggle, onClose }: { collapsed: boolean; onToggle: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const { t } = useLang();
  const { trigger } = usePageTransition();

  const navItems = [
    { href: "/dashboard",                    icon: LayoutDashboard,     label: t("الرئيسية",       "Dashboard")          },
    { href: "/dashboard/complaints",         icon: MessageSquareWarning,label: t("الشكاوى",         "Complaints")         },
    { href: "/dashboard/assign",             icon: UserCog,             label: t("تعيين الشكاوى",   "Assign Complaints")  },
    { href: "/dashboard/categories",         icon: Tag,                 label: t("الفئات",           "Categories")         },
    { href: "/dashboard/category-requests",  icon: Inbox,               label: t("طلبات الفئات",    "Category Requests")  },
    { href: "/dashboard/analytics",          icon: BarChart3,           label: t("التحليلات",        "Analytics")          },
    { href: "/dashboard/users",              icon: Users,               label: t("المستخدمون",       "Users")              },
    { href: "/dashboard/agents",             icon: Headphones,          label: t("الوكلاء",          "Agents")             },
    { href: "/dashboard/role-requests",      icon: UserCheck,           label: t("طلبات الأدمن",     "Admin Requests")     },
    { href: "/dashboard/settings",           icon: Settings,            label: t("الإعدادات",        "Settings")           },
  ];

  return (
    <motion.aside animate={{ width: collapsed ? 72 : 260 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="relative flex h-full flex-col overflow-hidden border-e border-sidebar-border bg-sidebar">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/8 to-transparent" />

      <button onClick={() => trigger('/dashboard')} className={cn(
        "relative flex h-20 shrink-0 items-center border-b border-sidebar-border transition-colors hover:bg-accent/40 w-full cursor-pointer bg-transparent p-0",
        collapsed ? "justify-center px-3" : "gap-3 px-5"
      )}>
        <Image src="/logo-new.png" alt="Ballaghna" width={80} height={80} quality={100} className="shrink-0 object-contain logo-img" />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="min-w-0 overflow-hidden">
              <p className="truncate text-sm font-black leading-tight text-foreground">{t('بلّغنا', 'Ballaghna')}</p>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-primary shrink-0" />
                <p className="truncate text-xs leading-tight text-muted-foreground">{t("لوحة المدير", "Admin Panel")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <nav className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2" : "px-3")}>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {t("القائمة", "Menu")}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="space-y-1">
          {navItems.map((item, i) => (
            <motion.div key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, duration: 0.25 }}>
              <SidebarItem {...item}
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                collapsed={collapsed} onClose={onClose} />
            </motion.div>
          ))}
        </div>
      </nav>

      <div className={cn("shrink-0 border-t border-sidebar-border py-3", collapsed ? "flex justify-center px-2" : "px-3")}>
        <Tooltip label={collapsed ? t("توسيع", "Expand") : ""} show={collapsed}>
          <motion.button onClick={onToggle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={cn("flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200",
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full px-3 py-2")}
            aria-label={collapsed ? "Expand" : "Collapse"}>
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </motion.span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden whitespace-nowrap">
                  {t("طي القائمة", "Collapse")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}
