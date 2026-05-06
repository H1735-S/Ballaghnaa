"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Trash2, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  apiBase: string; 
}

function timeAgo(dateStr: string, isRtl: boolean) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  if (isRtl) {
    if (mins < 1)   return "الآن";
    if (mins < 60)  return `${mins} د`;
    if (hours < 24) return `${hours} س`;
    return `${days} ي`;
  }
  if (mins < 1)   return "now";
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export function NotificationBell({ apiBase }: Props) {
  const { t, isRtl } = useLang();
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(false);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const didAutoRead = useRef(false);

  const unread = notifications.filter(n => !n.isRead).length;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiBase);
    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [apiBase]);

  useEffect(() => { load(); }, [load]);

  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  
  useEffect(() => {
    if (open && unread > 0 && !didAutoRead.current) {
      didAutoRead.current = true;
      setTimeout(async () => {
        await fetch(apiBase, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }, 1500); 
    }
    if (!open) didAutoRead.current = false;
  }, [open, unread, apiBase]);

  const deleteOne = async (id: string) => {
    setDeletingId(id);
    await fetch(apiBase, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifications(prev => prev.filter(n => n.id !== id));
    setDeletingId(null);
  };

  const readOne = async (id: string) => {
    await fetch(apiBase, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteAll = async () => {
    await fetch(apiBase, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setNotifications([]);
    setConfirmDeleteAll(false);
  };

  return (
    <div ref={panelRef} className="relative">
      
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.9 }}
        aria-label="Notifications"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background transition-all duration-200",
          "hover:bg-accent hover:border-primary/40",
          open && "bg-accent border-primary/40"
        )}
      >
        <motion.div
          animate={unread > 0 && !open ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
        >
          <Bell className="h-4 w-4 text-foreground" />
        </motion.div>

        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background"
            >
              {unread > 99 ? "99+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute end-0 top-full mt-2 w-80 sm:w-96 z-50"
          >
            <div className="rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl overflow-hidden">
              
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{t("الإشعارات", "Notifications")}</p>
                  {unread > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold"
                    >
                      {unread} {t("جديد", "new")}
                    </motion.span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setConfirmDeleteAll(true)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title={t("حذف الكل", "Delete all")}
                    >
                      <Trash2 className="w-3 h-3" />
                      {t("حذف الكل", "Clear all")}
                    </motion.button>
                  )}
                </div>
              </div>

              
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-3 space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-3 p-2">
                        <div className="w-2 h-2 rounded-full bg-muted mt-1.5 shrink-0 animate-pulse" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                          <div className="h-2.5 bg-muted rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <BellOff className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t("لا توجد إشعارات", "No notifications")}</p>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {notifications.map((n, i) => (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        className={cn(
                          "group relative flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors",
                          !n.isRead ? "bg-primary/5" : "hover:bg-muted/30"
                        )}
                      >
                        
                        <motion.span
                          animate={{ scale: n.isRead ? 0.6 : 1 }}
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors",
                            n.isRead ? "bg-muted-foreground/30" : "bg-primary"
                          )}
                        />

                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm leading-snug", n.isRead ? "text-muted-foreground" : "font-semibold text-foreground")}>
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt, isRtl)}</p>
                        </div>

                        
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity duration-150">
                          
                          {!n.isRead && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => readOne(n.id)}
                              title={t("تحديد كمقروء", "Mark as read")}
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            >
                              <CheckCheck className="w-3 h-3" />
                            </motion.button>
                          )}
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteOne(n.id)}
                            disabled={deletingId === n.id}
                            title={t("حذف", "Delete")}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
                          >
                            {deletingId === n.id
                              ? <span className="w-3 h-3 rounded-full border border-muted-foreground border-t-transparent animate-spin" />
                              : <X className="w-3 h-3" />
                            }
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              
              {notifications.some(n => !n.isRead) && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-t border-border px-4 py-2.5">
                  <button
                    onClick={async () => {
                      await fetch(apiBase, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
                      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    {t("تحديد الكل كمقروء", "Mark all as read")}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmDeleteAll}
        type="delete"
        title={t("حذف كل الإشعارات", "Clear all notifications")}
        description={t("سيتم حذف جميع الإشعارات نهائياً.", "All notifications will be permanently deleted.")}
        confirmLabel={t("حذف الكل", "Clear all")}
        onConfirm={deleteAll}
        onCancel={() => setConfirmDeleteAll(false)}
      />
    </div>
  );
}
