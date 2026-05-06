"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { useLang } from "@/lib/language-context";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

interface Props {
  user?: { name?: string | null; email?: string | null; id?: string };
  children: React.ReactNode;
}

const MOBILE_W = 256;

export function AdminShell({ user, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLarge, setIsLarge] = useState<boolean | null>(null);
  const { isRtl } = useLang();
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsLarge(media.matches);
    const handler = (e: MediaQueryListEvent) => { setIsLarge(e.matches); if (e.matches) setMobileOpen(false); };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      <AnimatePresence>
        {!isLarge && mobileOpen && (
          <motion.div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
            onClick={() => setMobileOpen(false)} aria-hidden="true" />
        )}
      </AnimatePresence>

      
      {isLarge === null ? (
        <div className="relative z-10 flex h-full flex-col bg-sidebar" style={{ width: 260 }} />
      ) : isLarge ? (
        <div className="relative z-10 flex h-full flex-col">
          <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
          
          <motion.button onClick={() => setCollapsed(v => !v)}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute end-0 top-1/2 z-50 flex h-7 w-7 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-md hover:bg-sidebar-accent hover:shadow-lg transition-all duration-200"
            aria-label={collapsed ? "Expand" : "Collapse"}>
            <motion.span animate={{ rotate: collapsed ? (isRtl ? 0 : 180) : (isRtl ? 180 : 0) }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }} className="flex items-center justify-center">
              <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
            </motion.span>
          </motion.button>
        </div>
      ) : (
        <motion.div className="fixed inset-y-0 start-0 z-30 flex flex-col"
          initial={false}
          animate={{ x: mobileOpen ? 0 : (isRtl ? MOBILE_W : -MOBILE_W) }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }} style={{ width: MOBILE_W }}>
          <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
        </motion.div>
      )}

      
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar user={user} onMenuToggle={() => setMobileOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto min-h-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <ChatbotWidget role="admin" />
    </div>
  );
}
