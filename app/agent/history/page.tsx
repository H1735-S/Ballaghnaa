"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { History, Download, ChevronLeft, ChevronRight, Star, Search, Filter } from "lucide-react";
import { useLang } from "@/lib/language-context";
import { CategoryIcon } from "@/lib/category-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Complaint {
  id: string; title: string; status: string; priority: string;
  createdAt: string; resolvedAt: string | null; citizenRating: number | null;
  category: { name: string; color: string };
  submittedBy: { name: string; avatarInitials?: string | null };
}

const CATEGORIES = ["الطرق والإنارة","الصرف الصحي","النظافة والقمامة","مياه الشرب","الكهرباء","البناء المخالف","الحدائق والمناطق الخضراء","الضوضاء والتلوث","الخدمات الحكومية"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

function exportCSV(complaints: Complaint[], t: (ar: string, en: string) => string) {
  const headers = [t("العنوان","Title"), t("الفئة","Category"), t("مقدم من","Submitted By"), t("الحالة","Status"), t("الأولوية","Priority"), t("تاريخ الإنشاء","Created At"), t("تاريخ الحل","Resolved At"), t("تقييم المواطن","Citizen Rating")];
  const rows = complaints.map(c => [
    `"${c.title.replace(/"/g,'""')}"`, `"${c.category.name}"`, `"${c.submittedBy.name}"`,
    c.status, c.priority, new Date(c.createdAt).toLocaleDateString(),
    c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : "", c.citizenRating ?? "",
  ]);
  const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `history-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function AgentHistoryPage() {
  const { t } = useLang();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage]   = useState(1);
  const [loading, setLoading] = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [from,     setFrom]     = useState("");
  const [to,       setTo]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (category) params.set("category", category);
    if (from)     params.set("from", from);
    if (to)       params.set("to", to);
    const res  = await fetch(`/api/agent/history?${params}`);
    const data = await res.json();
    setComplaints(data.complaints ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [page, category, from, to]);

  useEffect(() => { load(); }, [load]);

  const filtered = search.trim() ? complaints.filter(c => c.title.toLowerCase().includes(search.toLowerCase())) : complaints;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl flex items-center gap-2">
            <History className="w-5 h-5 text-primary sm:w-6 sm:h-6" /> {t("السجل","History")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{total} {t("شكوى محلولة أو مغلقة","resolved or closed complaints")}</p>
        </div>
        <button onClick={() => exportCSV(filtered, t)} disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-accent disabled:opacity-40 transition-colors self-start sm:self-auto">
          <Download className="w-4 h-4" /> {t("تصدير CSV","Export CSV")}
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
        <div className="relative w-full sm:w-auto">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("بحث بالعنوان...","Search by title...")}
            className="h-9 ps-9 pe-3 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-48" />
        </div>
        <Select value={category || "__all__"} onValueChange={v => { setCategory(v === "__all__" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder={t("كل الفئات","All categories")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t("كل الفئات","All categories")}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-xl border border-border bg-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring flex-1 sm:flex-none" />
          <span className="text-muted-foreground text-sm shrink-0">—</span>
          <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-xl border border-border bg-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring flex-1 sm:flex-none" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
                </div>
                <div className="h-5 bg-muted rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium">{t("لا توجد نتائج","No results found")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("جرب تغيير الفلاتر","Try adjusting your filters")}</p>
          </motion.div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4">
                <CategoryIcon name={c.category.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span>{c.category.name}</span>
                    <span>·</span>
                    <span>{t("من:","From:")} {c.submittedBy.name}</span>
                    {c.resolvedAt && <><span>·</span><span>{t("حُل:","Resolved:")} {new Date(c.resolvedAt).toLocaleDateString()}</span></>}
                  </div>
                  {c.citizenRating !== null && <div className="mt-1.5"><StarRating rating={c.citizenRating} /></div>}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 bg-primary/10 text-primary">
                  {c.status.replace(/_/g," ")}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-xl border border-border hover:bg-accent disabled:opacity-40 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm text-muted-foreground">{page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages} className="p-2 rounded-xl border border-border hover:bg-accent disabled:opacity-40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
