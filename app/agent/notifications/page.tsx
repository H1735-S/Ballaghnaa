"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { useLang } from "@/lib/language-context";

interface Notification { id: string; title: string; body: string; isRead: boolean; createdAt: string }

function relativeTime(dateStr: string, lang: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (lang === "ar") {
    if (mins  < 1)  return "الآن";
    if (mins  < 60) return `منذ ${mins} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  }
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AgentNotificationsPage() {
  const { t, lang } = useLang();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/agent/notifications");
    setNotifications(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await fetch("/api/agent/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  const markOne = async (id: string) => {
    await fetch("/api/agent/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNotifications(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary sm:w-6 sm:h-6" />
            {t("الإشعارات", "Notifications")}
            {unread > 0 && (
              <span className="inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {unread}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unread} {t("غير مقروء", "unread")}</p>
        </div>
        <AnimatePresence>
          {unread > 0 && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={markAll}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-accent transition-colors self-start sm:self-auto">
              <CheckCheck className="w-4 h-4" />
              {t("قراءة الكل", "Mark all read")}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="px-6 py-4 flex items-start gap-4">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium">{t("لا توجد إشعارات", "No notifications yet")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("ستظهر إشعاراتك هنا", "Your notifications will appear here")}</p>
          </motion.div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n, i) => (
              <motion.button key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => !n.isRead && markOne(n.id)}
                className={`w-full text-start flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}>
                <div className="mt-1.5 shrink-0">
                  {n.isRead ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  ) : (
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.isRead ? "text-muted-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5">{relativeTime(n.createdAt, lang)}</p>
                </div>
                {!n.isRead && (
                  <span className="shrink-0 mt-1 text-xs text-primary font-medium">{t("اضغط للقراءة", "Tap to read")}</span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
