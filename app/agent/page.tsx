"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, AlertTriangle, TrendingUp, ArrowRight, Activity } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { CategoryIcon } from "@/lib/category-icons";

interface Stats {
  total: number; open: number; inProgress: number; resolved: number;
  urgent: number; resolutionRate: number;
  recentActivity: { action: string; description: string | null; createdAt: string; complaintId: string | null }[];
}

const priorityColors: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600", medium: "bg-primary/10 text-primary",
  high: "bg-orange-500/10 text-orange-600", critical: "bg-red-500/10 text-red-600",
};
const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-600", in_review: "bg-purple-500/10 text-purple-600",
  assigned: "bg-indigo-500/10 text-indigo-600", in_progress: "bg-amber-500/10 text-amber-600",
  resolved: "bg-green-500/10 text-green-600", closed: "bg-muted text-muted-foreground",
  escalated: "bg-red-500/10 text-red-600", rejected: "bg-red-500/10 text-red-600",
};

export default function AgentDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent/stats").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: t("إجمالي المعينة", "Total Assigned"), value: stats?.total ?? 0,         icon: FileText,      color: "text-primary",    bg: "bg-primary/10"   },
    { label: t("مفتوحة",         "Open"),            value: stats?.open ?? 0,           icon: Clock,         color: "text-primary",    bg: "bg-primary/10"   },
    { label: t("قيد المعالجة",   "In Progress"),     value: stats?.inProgress ?? 0,     icon: Activity,      color: "text-amber-600",  bg: "bg-amber-500/10" },
    { label: t("محلولة",         "Resolved"),        value: stats?.resolved ?? 0,       icon: CheckCircle2,  color: "text-green-600",  bg: "bg-green-500/10" },
    { label: t("عاجلة",          "Urgent"),          value: stats?.urgent ?? 0,         icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-500/10"   },
    { label: t("معدل الحل",      "Resolution Rate"), value: stats?.resolutionRate ?? 0, icon: TrendingUp,    color: "text-primary",    bg: "bg-primary/10",  suffix: "%" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t("لوحة التحكم", "Dashboard")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("نظرة عامة على شكاواك المعينة", "Overview of your assigned complaints")}</p>
        </div>
        <Link href="/agent/complaints"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors self-start sm:self-auto">
          {t("عرض الشكاوى", "View Complaints")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-bold ${card.color}`}>
              {loading ? <span className="h-6 w-10 bg-muted rounded animate-pulse inline-block" /> : <>{card.value}{card.suffix}</>}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-tight">{card.label}</div>
          </motion.div>
        ))}
      </div>

      
      {stats && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t("معدل الحل", "Resolution Rate")}</p>
            <span className="text-sm font-bold text-primary">{stats.resolutionRate}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${stats.resolutionRate}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" />
          </div>
          <p className="text-xs text-muted-foreground">{stats.resolved} {t("من أصل", "out of")} {stats.total} {t("شكوى تم حلها", "resolved")}</p>
        </motion.div>
      )}

      
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> {t("آخر النشاطات", "Recent Activity")}
            </h2>
          </div>
          <div className="divide-y divide-border">
            {stats.recentActivity.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="px-6 py-3 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{a.description ?? a.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
                {a.complaintId && (
                  <Link href={`/agent/complaints/${a.complaintId}`} className="text-xs text-primary hover:underline shrink-0">
                    {t("عرض", "View")}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
