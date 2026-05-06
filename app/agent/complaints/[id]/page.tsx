"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, MessageSquare, Send, Lock, Unlock,
  CircleDot, Eye, UserCheck, Wrench, CheckCircle2, XCircle, ChevronDown,
} from "lucide-react";
import { useLang } from "@/lib/language-context";
import { CategoryIcon } from "@/lib/category-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplaintExtraInfo } from "@/components/complaint/ComplaintExtraInfo";

interface Comment { id: string; body: string; isInternal: boolean; createdAt: string; author: { name: string; avatarInitials?: string | null } }
interface StatusHistory { newStatus: string; createdAt: string; note?: string | null; changedBy: { name: string } }
interface Attachment { id: string; filename: string; url: string; mimeType?: string | null; sizeBytes?: number | null }
interface Complaint {
  id: string; trackingCode?: string | null; title: string; body?: string | null;
  status: string; priority: string; createdAt: string;
  nationalId?: string | null; phoneNumber?: string | null; gender?: string | null;
  latitude?: number | null; longitude?: number | null; address?: string | null;
  aiAnalysis?: string | null; isAnonymous?: boolean;
  category: { name: string; color: string };
  submittedBy: { name: string; avatarInitials?: string | null; email: string };
  assignee?: { name: string; avatarInitials?: string | null } | null;
  attachments: Attachment[];
  comments: Comment[];
  statusHistory: StatusHistory[];
}

const STATUS_FLOW = [
  { key: "open",        ar: "مفتوحة",       en: "Open",        icon: CircleDot    },
  { key: "in_review",   ar: "قيد المراجعة", en: "In Review",   icon: Eye          },
  { key: "assigned",    ar: "مُعيَّنة",     en: "Assigned",    icon: UserCheck    },
  { key: "in_progress", ar: "جارٍ العمل",   en: "In Progress", icon: Wrench       },
  { key: "resolved",    ar: "محلولة",       en: "Resolved",    icon: CheckCircle2 },
  { key: "closed",      ar: "مغلقة",        en: "Closed",      icon: XCircle      },
];

const AGENT_STATUSES = ["in_review", "in_progress", "resolved", "closed", "rejected"];

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

function ComplaintStepper({ status }: { status: string }) {
  const { t } = useLang();
  const activeIdx = Math.max(0, STATUS_FLOW.findIndex(s => s.key === status));
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">{t("مسار الشكوى", "Complaint Journey")}</p>
      <div className="relative flex items-start justify-between gap-1 overflow-x-auto pb-1">
        <div className="absolute top-4 start-0 end-0 h-px bg-border mx-8" />
        <div className="absolute top-4 start-0 h-px bg-primary transition-all duration-700"
          style={{ width: activeIdx === 0 ? "0%" : `${(activeIdx / (STATUS_FLOW.length - 1)) * 100}%`, marginInlineStart: "2rem" }} />
        {STATUS_FLOW.map((step, i) => {
          const Icon = step.icon;
          const done = i < activeIdx; const active = i === activeIdx;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5 flex-1 min-w-[40px]">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.06 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done ? "bg-primary border-primary text-primary-foreground" :
                  active ? "bg-primary/10 border-primary text-primary ring-4 ring-primary/20" :
                           "bg-background border-border text-muted-foreground"
                }`}>
                <Icon className="w-3.5 h-3.5" />
              </motion.div>
              <span className={`text-[10px] font-medium text-center leading-tight hidden sm:block ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>
                {t(step.ar, step.en)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AgentComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLang();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading]     = useState(true);

  
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [saving, setSaving]         = useState(false);

  
  const [comment, setComment]       = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending]       = useState(false);

  const load = async () => {
    const res = await fetch(`/api/agent/complaints/${id}`);
    if (!res.ok) { router.push("/agent/complaints"); return; }
    const data = await res.json();
    setComplaint(data);
    setNewStatus(data.status);
    setLoading(false);
  };

  
  useEffect(() => { load(); }, [id]);

  const changeStatus = async () => {
    if (!newStatus || newStatus === complaint?.status) return;
    setSaving(true);
    await fetch(`/api/agent/complaints/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, note: statusNote || undefined }),
    });
    setSaving(false); setStatusNote(""); setStatusOpen(false);
    await load();
  };

  const sendComment = async () => {
    if (!comment.trim()) return;
    setSending(true);
    await fetch(`/api/agent/complaints/${id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: comment, isInternal }),
    });
    setSending(false); setComment("");
    await load();
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)}</div>;
  if (!complaint) return null;

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("رجوع", "Back")}
      </button>

      
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-2">{complaint.title}</h1>
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(complaint.createdAt).toLocaleDateString()}</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><CategoryIcon name={complaint.category.name} size="sm" />{complaint.category.name}</span>
              <span>·</span>
              <span>{t("من:", "From:")} {complaint.submittedBy.name}</span>
              {complaint.trackingCode && <><span>·</span><span className="font-mono text-primary">{complaint.trackingCode}</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status] ?? "bg-muted text-muted-foreground"}`}>
              {complaint.status.replace(/_/g, " ")}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[complaint.priority] ?? ""}`}>{complaint.priority}</span>
          </div>
        </div>
        {complaint.body && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{complaint.body}</p>}
      </motion.div>

      
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <ComplaintStepper status={complaint.status} />
      </motion.div>

      
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <ComplaintExtraInfo
          nationalId={complaint.nationalId}
          phoneNumber={complaint.phoneNumber}
          gender={complaint.gender}
          latitude={complaint.latitude}
          longitude={complaint.longitude}
          address={complaint.address}
          aiAnalysis={complaint.aiAnalysis}
          attachments={complaint.attachments}
          role="agent"
          isAnonymous={complaint.isAnonymous}
        />
      </motion.div>

      
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden">
        <button onClick={() => setStatusOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 hover:bg-accent/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground text-sm">{t("تغيير الحالة", "Change Status")}</span>
          </div>
          <motion.div animate={{ rotate: statusOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {statusOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AGENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <motion.button onClick={changeStatus} disabled={saving || newStatus === complaint.status}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {saving ? <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {t("تطبيق", "Apply")}
                  </motion.button>
                </div>
                <textarea value={statusNote} onChange={e => setStatusNote(e.target.value)} rows={2}
                  placeholder={t("ملاحظة اختيارية...", "Optional note...")}
                  className="w-full rounded-xl border border-border bg-input text-foreground text-sm px-4 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> {t("التعليقات", "Comments")} ({complaint.comments.length})
          </h2>
          <div className="space-y-3">
            {complaint.comments.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
                {t("لا توجد تعليقات بعد", "No comments yet")}
              </div>
            ) : complaint.comments.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-4 border ${c.isInternal ? "bg-amber-500/5 border-amber-500/20" : "bg-card border-border"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {c.author.avatarInitials ?? c.author.name[0]}
                  </div>
                  <span className="text-sm font-medium text-foreground">{c.author.name}</span>
                  {c.isInternal && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                      <Lock className="w-3 h-3" /> {t("داخلي", "Internal")}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ms-auto">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </motion.div>
            ))}
          </div>

          
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsInternal(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${!isInternal ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                <Unlock className="w-3.5 h-3.5" /> {t("رد للمواطن", "Reply to Citizen")}
              </button>
              <button onClick={() => setIsInternal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${isInternal ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                <Lock className="w-3.5 h-3.5" /> {t("ملاحظة داخلية", "Internal Note")}
              </button>
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              placeholder={isInternal ? t("ملاحظة داخلية للفريق...", "Internal note for the team...") : t("رد للمواطن...", "Reply to citizen...")}
              className="w-full rounded-xl border border-border bg-input text-foreground text-sm px-4 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
            <button onClick={sendComment} disabled={sending || !comment.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {sending ? <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" /> : <Send className="w-4 h-4" />}
              {t("إرسال", "Send")}
            </button>
          </div>
        </div>

        
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> {t("تاريخ الحالة", "Status History")}
          </h2>
          <div className="bg-card border border-border rounded-2xl p-4">
            {complaint.statusHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t("لا يوجد تاريخ", "No history yet")}</p>
            ) : (
              <div className="relative space-y-0">
                {complaint.statusHistory.map((h, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 relative pb-4 last:pb-0">
                    {i < complaint.statusHistory.length - 1 && <div className="absolute start-3.5 top-7 bottom-0 w-px bg-border" />}
                    <div className={`relative z-10 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      i === complaint.statusHistory.length - 1 ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"
                    }`}><CircleDot className="w-3 h-3" /></div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[h.newStatus] ?? "bg-muted text-muted-foreground"}`}>
                        {h.newStatus.replace(/_/g, " ")}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{h.changedBy.name} · {new Date(h.createdAt).toLocaleDateString()}</p>
                      {h.note && <p className="text-xs text-muted-foreground/80 mt-0.5 italic">{h.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("معلومات المواطن", "Citizen Info")}</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {complaint.submittedBy.avatarInitials ?? complaint.submittedBy.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{complaint.submittedBy.name}</p>
                <p className="text-xs text-muted-foreground">{complaint.submittedBy.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
