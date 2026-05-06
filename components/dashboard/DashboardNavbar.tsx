"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  HelpCircle,
  Menu,
  Settings,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";import { usePageTransition } from "@/components/PageTransition";


const NOTIFS = [
  {
    id: 1,
    title: "New critical complaint",
    body: "Payment gateway timeout — CMP-1042",
    time: "2m ago",
    unread: true,
    color: "bg-red-500",
  },
  {
    id: 2,
    title: "Complaint resolved",
    body: "Export CSV issue closed by Lena M.",
    time: "18m ago",
    unread: true,
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Escalation alert",
    body: "2FA issue escalated — CMP-1036",
    time: "1h ago",
    unread: false,
    color: "bg-amber-500",
  },
];

function NotificationPanel({
  notifications,
  onClose,
  onMarkAllRead,
  onToggleRead,
}: {
  notifications: (typeof NOTIFS)[number][];
  onClose: () => void;
  onMarkAllRead: () => void;
  onToggleRead: (id: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="fixed inset-x-2 top-[5rem] z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="rounded-3xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {notifications.filter((n) => n.unread).length} unread
            </p>
          </div>
          <button
            type="button"
            onClick={onMarkAllRead}
            className="rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications right now.
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onToggleRead(n.id)}
                className={cn(
                  "w-full text-left px-4 py-3 transition-all",
                  "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  n.unread && "bg-primary/10"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      n.color
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{n.time}</p>
                  </div>
                  {n.unread && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-border px-4 py-2.5">
          <button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-muted/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted">
            View all notifications <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}


function UserMenu({
  open,
  onClose,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && open) {
        onClose();
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);

  const items = [
    { icon: User, label: "Profile", sub: "View your profile" },
    { icon: Settings, label: "Settings", sub: "Account preferences" },
    { icon: CreditCard, label: "Billing", sub: "Plans & invoices" },
    { icon: HelpCircle, label: "Help & Support", sub: "Docs & contact" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onClose}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-150",
          "hover:bg-accent",
          open && "bg-accent"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm transition-all",
            open && "ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
        >
          JD
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-xs font-semibold leading-tight text-foreground">
            Jane Doe
          </p>
          <p className="text-xs leading-tight text-muted-foreground">Admin</p>
        </div>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-2 top-[5rem] z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-56 rounded-2xl border border-border bg-popover py-1.5 shadow-xl"
          >
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                  JD
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">jane@company.com</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              {items.map(({ icon: Icon, label, sub }) => (
                <button
                  key={label}
                  className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-border py-1">
            <button
              onClick={() => onSignOut()}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10 group"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <LogOut className="h-3.5 w-3.5 text-destructive" />
              </div>
              <span className="font-medium">Sign out</span>
            </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<typeof NOTIFS>(NOTIFS);

  const unreadExists = notifications.some((n) => n.unread);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const toggleRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition-all duration-150 hover:border-primary hover:bg-accent/70",
          open && "border-primary bg-accent/80"
        )}
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadExists && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-50" />
            <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setOpen(false)}
            onMarkAllRead={markAllRead}
            onToggleRead={toggleRead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


const Divider = () => <div className="h-5 w-px bg-border" />;


export function DashboardNavbar({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t } = useLang();
  const { trigger } = usePageTransition();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-20 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md transition-all duration-200 sm:px-6"
      )}
    >
      
      <div className="flex items-center gap-2 lg:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        
        <button onClick={() => trigger('/dashboard')} className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0">
          <img src="/logo-new.png" alt="Ballaghna Logo" className="h-16 w-16 object-contain logo-img" />
          <span className="hidden text-xl font-black tracking-tight text-foreground sm:inline">
            {t('بلّغنا', 'Ballaghna')}
          </span>
        </button>
      </div>

      
      <div className="hidden max-w-xs flex-1 md:flex">
        <Input
          placeholder="Search complaints..."
          icon={<Search className="h-3.5 w-3.5" />}
          className="h-9 border-border bg-muted/50 focus:bg-background"
        />
      </div>

      
      <div className="ml-auto flex items-center gap-1 sm:gap-1.5 sm:gap-2">
        <LanguageToggle />
        <Divider />
        <ThemeToggle />
        <Divider />
        <NotificationBell />
        <Divider />
        <UserMenu
          open={userMenuOpen}
          onClose={() => setUserMenuOpen((v) => !v)}
          onSignOut={() => trigger('/signout')}
        />
      </div>
    </header>
  );
}
