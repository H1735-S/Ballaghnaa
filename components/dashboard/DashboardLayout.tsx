"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLang } from "@/lib/language-context";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isRtl } = useLang();
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  const mobileSidebarWidth = 280;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => setIsLargeScreen(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AnimatePresence>
        {!isLargeScreen && mobileOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed inset-y-0 z-30 lg:relative lg:z-auto lg:flex lg:flex-col ${isRtl ? "right-0" : "left-0"}`}
        initial={false}
        animate={{ x: isLargeScreen ? 0 : mobileOpen ? 0 : (isRtl ? mobileSidebarWidth : -mobileSidebarWidth) }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <DashboardSidebar
          collapsed={isLargeScreen ? collapsed : false}
          onToggle={() => setCollapsed((v) => !v)}
          onClose={() => setMobileOpen(false)}
        />
      </motion.div>

      <AnimatePresence>
        {!isLargeScreen && (
          <motion.button
            key="mobile-sidebar-handle"
            className={`fixed top-1/2 z-40 -translate-y-1/2 rounded-full border border-border bg-sidebar text-foreground shadow-lg shadow-black/25 p-3 lg:hidden ${isRtl ? "right-0" : "left-0"}`}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: mobileOpen ? (isRtl ? mobileSidebarWidth : mobileSidebarWidth) * (isRtl ? -1 : 1) : 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
          >
            <motion.span
              initial={false}
              animate={{ rotate: mobileOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="flex items-center justify-center"
            >
              {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in-up">
            <Card className="border border-border bg-background shadow-sm">
              <CardHeader className="border-b border-border px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-lg font-semibold text-foreground">لوحة التحكم</h1>
                  <span className="text-sm text-muted-foreground">مرحباً بك في بلّغنا</span>
                </div>
              </CardHeader>
              <CardContent className="p-4">{children}</CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
