"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { CategoryIcon } from "@/lib/category-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Complaint {
  id: string; title: string; status: string; priority: string; createdAt: string;
  trackingCode?: string | null;
  category: { name: string; color: string };
  submittedBy: { name: string; avatarInitials?: string | null };
}

const STATUSES  = ["open","in_review","assigned","in_progress","resolved","escalated","closed","rejected"];
const PRIORITIES = ["low","medium","high","critical"];

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-600", in_review: "bg-purple-500/10 text-purple-600",
  assigned: "bg-indigo-500/10 text-indigo-600", in_progress: "bg-amber-500/10 text-amber-600",
  resolved: "bg-green-500/10 text-green-600", closed: "bg-muted text-muted-foreground",
  escalated: "bg-red-500/10 text-red-600", rejected: "bg-red-500/10 text-red-600",
};
const priorityColors: Record<string, string> = {
  low: "bg-slate-500/10 text-slate-600", medium: "bg-primary/10 text-primary",
  high: "bg-orange-500/10 text-orange-600", critical: "bg-red-500/10 text-red-600",
};

export default function AgentComplaintsPage() {
  const { t } = useLang();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage]   = useState(1);
  const [status, setStatus]     = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort]         = useState("newest");
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), sort });
    if (status)   params.set("status",   status);
    if (priority) params.set("priority", priority);
    const res  = await fetch(`/api/agent/complaints?${params}`);
    const data = await res.json();
    setComplaints(data.complaints ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [page, status, priority, sort]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">{t("الشكاوى المعينة", "Assigned Complaints")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} {t("شكوى", "complaints")}</p>
        </div>
      </div>

      
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
        <Select value={status || "__all__"} onValueChange={v => { setStatus(v === "__all__" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder={t("كل الحالات", "All statuses")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t("كل الحالات", "All statuses")}</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priority || "__all__"} onValueChange={v => { setPriority(v === "__all__" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder={t("كل الأولويات", "All priorities")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t("كل الأولويات", "All priorities")}</SelectItem>
            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={v => { setSort(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40">
            <ArrowUpDown className="w-3.5 h-3.5 me-1.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("الأحدث", "Newest")}</SelectItem>
            <SelectItem value="oldest">{t("الأقدم", "Oldest")}</SelectItem>
            <SelectItem value="priority">{t("الأعلى أولوية", "Highest Priority")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                </div>
                <div className="h-5 bg-muted rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        ) : !complaints.length ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            {t("لا توجد شكاوى معينة لك", "No complaints assigned to you")}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {complaints.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/agent/complaints/${c.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <CategoryIcon name={c.category.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span>{c.category.name}</span>
                      <span>·</span>
                      <span>{t("من:", "From:")} {c.submittedBy.name}</span>
                      <span>·</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      {c.trackingCode && <><span>·</span><span className="font-mono text-primary">{c.trackingCode}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[c.priority] ?? ""}`}>{c.priority}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status] ?? ""}`}>{c.status.replace(/_/g, " ")}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl border border-border hover:bg-accent disabled:opacity-40 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-muted-foreground">{page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-2 rounded-xl border border-border hover:bg-accent disabled:opacity-40 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
