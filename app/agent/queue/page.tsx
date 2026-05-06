"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import { ListOrdered, GripVertical, Play, CheckCircle2, Eye, AlertTriangle, Clock } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { CategoryIcon } from "@/lib/category-icons";

interface QueueItem {
  id: string; title: string; status: string; priority: string; createdAt: string;
  category: { name: string; color: string };
  submittedBy: { name: string };
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const priorityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-600 border-red-500/20",
  high:     "bg-orange-500/10 text-orange-600 border-orange-500/20",
  medium:   "bg-primary/10 text-primary border-primary/20",
  low:      "bg-muted text-muted-foreground border-border",
};

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function DragHandle({ controls }: { controls: ReturnType<typeof useDragControls> }) {
  return (
    <div onPointerDown={e => controls.start(e)} className="cursor-grab active:cursor-grabbing p-1 rounded-lg hover:bg-accent transition-colors touch-none">
      <GripVertical className="w-4 h-4 text-muted-foreground" />
    </div>
  );
}

function QueueCard({ item, onAction, actionLoading }: { item: QueueItem; onAction: (id: string, status: string) => void; actionLoading: string | null }) {
  const { t } = useLang();
  const controls = useDragControls();
  const age = daysSince(item.createdAt);
  const PriorityIcon = item.priority === "critical" || item.priority === "high" ? AlertTriangle : Clock;

  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} as="div"
      className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 select-none"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 50 }}>
      <DragHandle controls={controls} />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <CategoryIcon name={item.category.name} size="sm" />
            <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
          </div>
          <span className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[item.priority] ?? ""}`}>
            <PriorityIcon className="w-3 h-3" />
            {t(item.priority === "critical" ? "حرج" : item.priority === "high" ? "عالي" : item.priority === "medium" ? "متوسط" : "منخفض", item.priority)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span>{item.category.name}</span>
          <span>·</span>
          <span>{t("من:","From:")} {item.submittedBy.name}</span>
          <span>·</span>
          <span className={age > 7 ? "text-primary font-medium" : ""}>{age === 0 ? t("اليوم","Today") : `${age} ${t("يوم","days")}`}</span>
          <span>·</span>
          <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium">{item.status.replace(/_/g," ")}</span>
        </div>
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <button onClick={() => onAction(item.id, "in_progress")} disabled={actionLoading === item.id || item.status === "in_progress"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 disabled:opacity-40 transition-colors">
            {actionLoading === item.id ? <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" /> : <Play className="w-3 h-3" />}
            {t("بدء","Start")}
          </button>
          <button onClick={() => onAction(item.id, "in_review")} disabled={actionLoading === item.id || item.status === "in_review"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-accent hover:text-foreground disabled:opacity-40 transition-colors">
            <Eye className="w-3 h-3" /> {t("مراجعة","Review")}
          </button>
          <button onClick={() => onAction(item.id, "resolved")} disabled={actionLoading === item.id || item.status === "resolved"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:bg-accent hover:text-foreground disabled:opacity-40 transition-colors">
            <CheckCircle2 className="w-3 h-3" /> {t("حل","Resolve")}
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function AgentQueuePage() {
  const { t } = useLang();
  const [items, setItems]               = useState<QueueItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const sortItems = (list: QueueItem[]) =>
    [...list].sort((a, b) => {
      const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return pd !== 0 ? pd : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/agent/complaints?limit=50&sort=priority");
    const data = await res.json();
    const active = (data.complaints ?? []).filter((c: QueueItem) => !["resolved","closed","rejected"].includes(c.status));
    setItems(sortItems(active));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: string, status: string) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setActionLoading(id);
    await fetch(`/api/agent/complaints/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setActionLoading(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-primary sm:w-6 sm:h-6" /> {t("قائمة الانتظار","Priority Queue")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t("مرتبة حسب الأولوية — حرج → عالي → متوسط → منخفض","Sorted by urgency — critical → high → medium → low")}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {(["critical","high","medium","low"] as const).map(p => (
          <span key={p} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityColors[p]}`}>
            {t(p === "critical" ? "حرج" : p === "high" ? "عالي" : p === "medium" ? "متوسط" : "منخفض", p)}
          </span>
        ))}
        <span className="text-xs text-muted-foreground ms-auto">{items.length} {t("شكوى نشطة","active complaints")}</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-2xl py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ListOrdered className="w-8 h-8 text-primary" />
          </div>
          <p className="text-foreground font-medium">{t("القائمة فارغة","Queue is empty")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("لا توجد شكاوى نشطة معينة لك","No active complaints assigned to you")}</p>
        </motion.div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3" as="div">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <QueueCard item={item} onAction={handleAction} actionLoading={actionLoading} />
            </motion.div>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
