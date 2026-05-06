"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Tag,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Eye,
  Inbox,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { useLang } from "@/lib/language-context";
import { usePageTransition } from "@/components/PageTransition";

const navItems: NavItem[] = [
  { label: "Dashboard",          href: "/dashboard",                    icon: LayoutDashboard    },
  { label: "Complaints",         href: "/dashboard/complaints",         icon: MessageSquareWarning, badge: 12 },
  { label: "Categories",         href: "/dashboard/categories",         icon: Tag                },
  { label: "Category Requests",  href: "/dashboard/category-requests",  icon: Inbox              },
  { label: "Analytics",          href: "/dashboard/analytics",          icon: BarChart3          },
  { label: "Users",              href: "/dashboard/users",              icon: Users              },
  { label: "Agents",             href: "/dashboard/agents",             icon: Headphones         },
  { label: "Settings",           href: "/dashboard/settings",           icon: Settings           },
  { label: "My Profile",         href: "/dashboard/profile",            icon: UserCircle         },
];


function SidebarItem({
  item,
  isActive,
  collapsed,
  onClose,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClose?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "select-none transition-all duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <Icon
        className={cn(
          "shrink-0 transition-colors",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        )}
        style={{ width: 18, height: 18 }}
      />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 items-center justify-between overflow-hidden whitespace-nowrap"
          >
            {item.label}
            {item.badge !== undefined && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary">
                {item.badge}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {collapsed && item.badge !== undefined && (
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Link>
  );
}


export function DashboardSidebar({
  collapsed,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLang();
  const { trigger } = usePageTransition();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "flex h-full flex-col overflow-hidden",
        "border-r border-sidebar-border bg-sidebar"
      )}
    >
      
      <button
        onClick={() => trigger('/dashboard')}
        className={cn(
          "flex h-20 shrink-0 items-center border-b border-sidebar-border w-full cursor-pointer bg-transparent p-0",
          collapsed ? "justify-center px-3" : "gap-3 px-5"
        )}
      >
        <Image src="/logo-new.png" alt="Ballaghna Logo" width={80} height={80} priority className="shrink-0 object-contain logo-img" />
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="min-w-0 overflow-hidden"
            >
              <p className="truncate text-sm font-black leading-tight text-foreground">
                {t('بلّغنا', 'Ballaghna')}
              </p>
              <p className="truncate text-xs leading-tight text-muted-foreground">
                {t('منصة الشكاوى', 'Complaints Platform')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              collapsed={collapsed}
              onClose={onClose}
            />
          ))}
        </div>
      </nav>

      
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium",
            "text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}