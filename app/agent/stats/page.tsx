"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { BarChart2, CheckCircle2, Clock, FileText, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { ComplaintsByCategoryChart } from "@/components/agent/ComplaintsByCategoryChart";
import { ComplaintsByStatusChart } from "@/components/agent/ComplaintsByStatusChart";

interface StatsDetail {
  byStatus:        { status: string; count: number }[];
  byCategory:      { name: string; nameEn: string; count: number }[];
  resolutionRate:  number;
  avgResponseTime: number;
  thisMonth:       { total: number; resolved: number };
  lastMonth:       { total: number; resolved: number };
}

function AnimatedCounter({ target, duration = 1200, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return <>{val}{suffix}</>;
}


export default function AgentStatsPage() {  const { t, lang } = useLang();
  const [data, setData]       = useState<StatsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent/stats-detail").then(r => r.json()).then((d: StatsDetail) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}</div>;
  if (!data) return null;

  const totalAssigned = data.byStatus.reduce((s, x) => s + x.count, 0);
  const resolved      = data.byStatus.filter(x => ["resolved","closed"].includes(x.status)).reduce((s, x) => s + x.count, 0);
  const monthDiff     = data.thisMonth.total - data.lastMonth.total;
  const monthPct      = data.lastMonth.total > 0 ? Math.abs(Math.round((monthDiff / data.lastMonth.total) * 100)) : 0;

  const statCards = [
    { label: t("إجمالي المعينة",       "Total Assigned"),      value: totalAssigned,        icon: FileText,     suffix: ""  },
    { label: t("محلولة",               "Resolved"),             value: resolved,             icon: CheckCircle2, suffix: ""  },
    { label: t("متوسط وقت الاستجابة",  "Avg Response Time"),    value: data.avgResponseTime, icon: Clock,        suffix: t("س","h") },
    { label: t("معدل الحل",            "Resolution Rate"),      value: data.resolutionRate,  icon: TrendingUp,   suffix: "%" },
  ];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary sm:w-6 sm:h-6" /> {t("إحصائياتي", "My Stats")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("نظرة عامة على أدائك", "Overview of your performance")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary"><AnimatedCounter target={card.value} suffix={card.suffix} /></p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-tight">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{t("معدل الحل", "Resolution Rate")}</p>
          <span className="text-sm font-bold text-primary">{data.resolutionRate}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${data.resolutionRate}%` }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" />
        </div>
        <p className="text-xs text-muted-foreground">{resolved} {t("من أصل","out of")} {totalAssigned} {t("شكوى تم حلها","complaints resolved")}</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">{t("الشكاوى حسب الحالة","Complaints by Status")}</p>
          {data.byStatus.length === 0
            ? <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">{t("لا توجد بيانات","No data yet")}</div>
            : <ComplaintsByStatusChart data={data.byStatus} lang={lang} />
          }
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-2xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">{t("الشكاوى حسب الفئة","Complaints by Category")}</p>
          {data.byCategory.length === 0
            ? <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">{t("لا توجد بيانات","No data yet")}</div>
            : <ComplaintsByCategoryChart data={data.byCategory} lang={lang} />
          }
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card border border-border rounded-2xl p-5">
        <p className="text-sm font-semibold text-foreground mb-4">{t("هذا الشهر مقابل الشهر الماضي","This Month vs Last Month")}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{t("هذا الشهر","This Month")}</p>
            <p className="text-2xl font-bold text-primary">{data.thisMonth.total}</p>
            <p className="text-xs text-muted-foreground">{data.thisMonth.resolved} {t("محلولة","resolved")}</p>
          </div>
          <div className="rounded-xl bg-muted/50 border border-border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">{t("الشهر الماضي","Last Month")}</p>
            <p className="text-2xl font-bold text-foreground">{data.lastMonth.total}</p>
            <p className="text-xs text-muted-foreground">{data.lastMonth.resolved} {t("محلولة","resolved")}</p>
          </div>
        </div>
        {data.lastMonth.total > 0 && (
          <div className="mt-4 flex items-center gap-2">
            {monthDiff > 0 ? <TrendingUp className="w-4 h-4 text-primary" /> : monthDiff < 0 ? <TrendingDown className="w-4 h-4 text-muted-foreground" /> : <Minus className="w-4 h-4 text-muted-foreground" />}
            <span className={`text-sm font-semibold ${monthDiff > 0 ? "text-primary" : "text-muted-foreground"}`}>{monthDiff > 0 ? "+" : ""}{monthDiff} ({monthPct}%)</span>
            <span className="text-xs text-muted-foreground">{t("مقارنة بالشهر الماضي","compared to last month")}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
