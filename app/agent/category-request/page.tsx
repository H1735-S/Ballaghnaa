"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Send, CheckCircle2, X, Clock, Plus } from "lucide-react";
import { useLang } from "@/lib/language-context";

interface CategoryRequest {
  id: string;
  nameAr: string;
  nameEn?: string | null;
  description?: string | null;
  status: string;
  rejectionNote?: string | null;
  createdAt: string;
}

const STATUS_CFG = {
  approved: { color: "text-green-600", bg: "bg-green-500/8 border-green-500/20", icon: CheckCircle2 },
  rejected: { color: "text-red-600",   bg: "bg-red-500/8 border-red-500/20",     icon: X           },
  pending:  { color: "text-amber-600", bg: "bg-amber-500/8 border-amber-500/20", icon: Clock       },
};

export default function CategoryRequestPage() {
  const { t } = useLang();
  const [requests, setRequests]   = useState<CategoryRequest[]>([]);
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [form, setForm]           = useState({ nameAr: "", nameEn: "", description: "" });
  const [msg, setMsg]             = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/agent/category-request")
      .then(r => r.json())
      .then(d => setRequests(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr.trim()) return;
    setSending(true);
    const res = await fetch("/api/agent/category-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    if (res.ok) {
      const newReq = await res.json();
      setRequests(prev => [newReq, ...prev]);
      setForm({ nameAr: "", nameEn: "", description: "" });
      showMsg("success", t("تم إرسال الطلب للمشرف", "Request sent to supervisor"));
    } else {
      showMsg("error", t("حدث خطأ، حاول مرة أخرى", "An error occurred, please try again"));
    }
  };

  const pending  = requests.filter(r => r.status === "pending").length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("طلب فئة جديدة", "Request New Category")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("اقترح فئة جديدة وسيتم مراجعتها من قبل المشرف", "Suggest a new category to be reviewed by your supervisor")}
          </p>
        </div>
        {pending > 0 && (
          <span className="ms-auto shrink-0 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
            {pending} {t("معلق", "pending")}
          </span>
        )}
      </div>

      
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm border ${
              msg.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-destructive/10 border-destructive/30 text-destructive"
            }`}>
            {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground text-sm">{t("طلب جديد", "New Request")}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            {t("سيتم إرسال الطلب للمشرف للمراجعة والموافقة", "Request will be sent to supervisor for review and approval")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("الاسم بالعربية *", "Arabic Name *")}
              </label>
              <input
                required
                value={form.nameAr}
                onChange={e => setForm(p => ({ ...p, nameAr: e.target.value }))}
                placeholder={t("مثال: الصحة", "e.g. الصحة")}
                className="w-full h-10 rounded-xl border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("الاسم بالإنجليزية", "English Name")}
              </label>
              <input
                value={form.nameEn}
                onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))}
                placeholder="e.g. Health"
                className="w-full h-10 rounded-xl border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("السبب / الوصف", "Reason / Description")}
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder={t("لماذا تحتاج هذه الفئة؟", "Why is this category needed?")}
              className="w-full rounded-xl border border-border bg-input text-foreground text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !form.nameAr.trim()}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm font-semibold transition-colors"
          >
            {sending
              ? <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              : <Send className="w-4 h-4" />}
            {t("إرسال الطلب", "Send Request")}
          </button>
        </form>
      </motion.div>

      
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold text-foreground text-sm mb-4">{t("طلباتي السابقة", "My Previous Requests")}</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="py-10 text-center">
            <Tag className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{t("لا توجد طلبات سابقة", "No previous requests")}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {requests.map((r, i) => {
              const cfg = STATUS_CFG[r.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.pending;
              const Icon = cfg.icon;
              return (
                <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground truncate">{r.nameAr}</p>
                      <span className={`text-xs font-semibold shrink-0 ${cfg.color}`}>
                        {r.status === "approved" ? t("مقبول", "Approved")
                          : r.status === "rejected" ? t("مرفوض", "Rejected")
                          : t("قيد المراجعة", "Pending")}
                      </span>
                    </div>
                    {r.nameEn && <p className="text-xs text-muted-foreground mt-0.5">{r.nameEn}</p>}
                    {r.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.description}</p>}
                    {r.rejectionNote && (
                      <p className="text-xs text-red-600 mt-1">{r.rejectionNote}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
