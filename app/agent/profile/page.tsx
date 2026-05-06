"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, Lock, Save, CheckCircle2, AlertCircle,
  Pencil, X, FileText, Tag, Activity, Palette, Shield,
} from "lucide-react";
import { useLang } from "@/lib/language-context";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Profile { id: string; name: string; email: string; phone?: string | null; avatarInitials?: string | null }
interface Stats   { total: number; resolved: number; urgent: number }
interface Category { id: string; name: string; nameEn: string; color: string }

const COLOR_THEMES = [
  { id: "default", labelAr: "نيفي",    labelEn: "Navy",    color: "#1E3A5F" },
  { id: "ocean",   labelAr: "سماوي",   labelEn: "Ocean",   color: "#0369a1" },
  { id: "emerald", labelAr: "زمردي",   labelEn: "Emerald", color: "#065f46" },
  { id: "violet",  labelAr: "بنفسجي",  labelEn: "Violet",  color: "#5b21b6" },
  { id: "rose",    labelAr: "وردي",    labelEn: "Rose",    color: "#9f1239" },
  { id: "amber",   labelAr: "عنبري",   labelEn: "Amber",   color: "#92400e" },
  { id: "slate",   labelAr: "رمادي",   labelEn: "Slate",   color: "#1e293b" },
];

type Tab = "info" | "activity" | "appearance";

export default function AgentProfilePage() {
  const { t, lang } = useLang();
  const { data: session } = useSession();
  const uid = session?.user?.id ?? "guest";
  const [tab, setTab] = useState<Tab>("info");

  const [profile, setProfile]   = useState<Profile | null>(null);
  const [stats, setStats]       = useState<Stats | null>(null);
  const [specs, setSpecs]       = useState<Category[]>([]);
  const [activity, setActivity] = useState<{ data: [string, number][]; year: number } | null>(null);
  const [msg, setMsg]           = useState<{ type: "success" | "error"; text: string } | null>(null);

  
  const [pw, setPw]         = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  
  const [theme, setTheme]           = useState<"system" | "light" | "dark">("system");
  const [colorTheme, setColorTheme] = useState("default");

  useEffect(() => {
    fetch("/api/citizen/profile").then(r => r.json()).then(setProfile);
    fetch("/api/agent/stats").then(r => r.json()).then(setStats);
    fetch("/api/agent/specializations").then(r => r.json()).then(setSpecs);
    fetch("/api/agent/activity").then(r => r.json()).then(setActivity).catch(() => {});
    const savedTheme = localStorage.getItem(`theme_${uid}`);
    setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : "system");
    setColorTheme(localStorage.getItem(`colorTheme_${uid}`) ?? "default");
  }, [uid]);

  const flash = (type: "success" | "error", text: string) => {
    setMsg({ type, text }); setTimeout(() => setMsg(null), 3500);
  };

  const patchProfile = async (data: Record<string, string>) => {
    const res = await fetch("/api/citizen/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { flash("error", json.error); return; }
    setProfile(json);
    flash("success", t("تم الحفظ", "Saved"));
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { flash("error", t("كلمتا المرور غير متطابقتين", "Passwords don't match")); return; }
    setPwSaving(true);
    const res = await fetch("/api/citizen/profile", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
    });
    const json = await res.json();
    setPwSaving(false);
    if (!res.ok) { flash("error", json.error); return; }
    setPw({ current: "", next: "", confirm: "" });
    flash("success", t("تم تغيير كلمة المرور", "Password changed"));
  };

  function applyTheme(th: "system" | "light" | "dark") {
    setTheme(th);
    if (th === "dark") { document.documentElement.classList.add("dark"); localStorage.setItem(`theme_${uid}`, "dark"); }
    else if (th === "light") { document.documentElement.classList.remove("dark"); localStorage.setItem(`theme_${uid}`, "light"); }
    else { localStorage.removeItem(`theme_${uid}`); document.documentElement.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches); }
  }

  function applyColor(id: string) {
    setColorTheme(id);
    if (id === "default") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem(`colorTheme_${uid}`, id);
  }

  const inputCls = "w-full h-10 rounded-xl border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  const TABS: { id: Tab; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
    { id: "info",       labelAr: "المعلومات",  labelEn: "Info",       icon: User    },
    { id: "activity",   labelAr: "النشاط",     labelEn: "Activity",   icon: Activity },
    { id: "appearance", labelAr: "المظهر",     labelEn: "Appearance", icon: Palette  },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-card border border-border rounded-2xl p-6">
        
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-black text-primary-foreground shadow-xl shadow-primary/25">
              {profile?.avatarInitials ?? "A"}
            </div>
            <span className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-green-500 border-2 border-card" />
          </div>

          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">{profile?.name ?? "—"}</h1>
            <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Shield className="w-3 h-3" /> {t("وكيل", "Agent")}
            </span>
          </div>

          
          {stats && (
            <div className="flex gap-5 shrink-0 sm:border-s sm:border-border sm:ps-5">
              {[
                { label: t("معينة", "Assigned"), value: stats.total,    icon: FileText,     color: "text-primary"   },
                { label: t("محلولة", "Resolved"), value: stats.resolved, icon: CheckCircle2, color: "text-green-600" },
                { label: t("عاجلة",  "Urgent"),   value: stats.urgent,   icon: AlertCircle,  color: "text-red-500"   },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-0.5 justify-center">
                    <s.icon className="w-3 h-3" /> {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        
        {specs.length > 0 && (
          <div className="relative mt-4 pt-4 border-t border-border flex flex-wrap gap-1.5">
            {specs.map(c => (
              <span key={c.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: `${c.color}15`, borderColor: `${c.color}40`, color: c.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                {t(c.name, c.nameEn)}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      
      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={cn("flex items-center gap-2.5 p-3.5 rounded-xl text-sm border",
              msg.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-destructive/10 border-destructive/30 text-destructive")}>
            {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl w-fit">
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
              tab === tb.id
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground")}>
            <tb.icon className="w-3.5 h-3.5" />
            {t(tb.labelAr, tb.labelEn)}
          </button>
        ))}
      </div>

      
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>

          
          {tab === "info" && (
            <div className="grid sm:grid-cols-2 gap-4">

              
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">{t("البيانات الشخصية", "Personal Info")}</p>
                {[
                  { label: t("الاسم", "Name"),   icon: User,  key: "name",  value: profile?.name  ?? "", disabled: false },
                  { label: t("البريد", "Email"),  icon: Mail,  key: "email", value: profile?.email ?? "", disabled: true  },
                  { label: t("الهاتف", "Phone"),  icon: Phone, key: "phone", value: profile?.phone ?? "", disabled: false },
                ].map(f => (
                  <EditField key={f.key} label={f.label} value={f.value} icon={f.icon}
                    disabled={f.disabled}
                    onSave={f.disabled ? undefined : v => patchProfile({ [f.key]: v })} />
                ))}
              </div>

              
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">{t("تغيير كلمة المرور", "Change Password")}</p>
                <form onSubmit={savePassword} className="space-y-3">
                  {[
                    { key: "current" as const, label: t("الحالية", "Current") },
                    { key: "next"    as const, label: t("الجديدة", "New")     },
                    { key: "confirm" as const, label: t("التأكيد", "Confirm") },
                  ].map(f => (
                    <div key={f.key} className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                      <div className="relative">
                        <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="password" value={pw[f.key]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder="••••••••" className={cn(inputCls, "ps-10")} />
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={pwSaving}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground text-sm font-semibold transition-colors mt-1">
                    {pwSaving ? <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" /> : <Save className="w-4 h-4" />}
                    {t("تحديث", "Update")}
                  </button>
                </form>
              </div>
            </div>
          )}

          
          {tab === "activity" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("نشاطي اليومي", "Daily Activity")}</p>
                  <p className="text-xs text-muted-foreground">{t("آخر 12 شهر", "Last 12 months")}</p>
                </div>
                <div className="flex gap-5 text-center">
                  <div>
                    <p className="text-xl font-black text-primary">{activity?.data.reduce((s, [, v]) => s + v, 0) ?? 0}</p>
                    <p className="text-[10px] text-muted-foreground">{t("إجمالي", "Total")}</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-foreground">{activity?.data.filter(([, v]) => v > 0).length ?? 0}</p>
                    <p className="text-[10px] text-muted-foreground">{t("يوم نشط", "Active days")}</p>
                  </div>
                </div>
              </div>
              {activity
                ? <ActivityHeatmap data={activity.data} year={activity.year} lang={lang} />
                : <div className="h-[160px] bg-muted rounded-xl animate-pulse" />}
            </div>
          )}

          
          {tab === "appearance" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <p className="text-sm font-semibold text-foreground">{t("تخصيص المظهر", "Customize Appearance")}</p>

              
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{t("السمة", "Theme")}</p>
                <div className="grid grid-cols-3 gap-3">
                  {(["system", "light", "dark"] as const).map(th => (
                    <button key={th} onClick={() => applyTheme(th)}
                      className={cn("rounded-xl border-2 p-3 text-xs font-medium transition-all",
                        theme === th ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-foreground/70 hover:border-primary/40")}>
                      <div className={cn("mx-auto mb-2 h-8 w-full rounded-lg border",
                        th === "light" ? "bg-white border-slate-200" :
                        th === "dark"  ? "bg-[#1e293b] border-[#334155]" :
                        "bg-gradient-to-r from-white to-[#1e293b] border-slate-300")} />
                      <span className="text-xs font-medium">
                        {th === "system" ? t("تلقائي", "System") : th === "light" ? t("فاتح", "Light") : t("داكن", "Dark")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{t("لون النظام", "Accent Color")}</p>
                <div className="grid grid-cols-7 gap-2">
                  {COLOR_THEMES.map(ct => (
                    <button key={ct.id} onClick={() => applyColor(ct.id)}
                      className={cn("flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all",
                        colorTheme === ct.id ? "border-foreground scale-105" : "border-transparent hover:border-border")}>
                      <span className="w-8 h-8 rounded-full shadow ring-2 ring-white/20" style={{ backgroundColor: ct.color }} />
                      <span className="text-[9px] text-muted-foreground dark:text-slate-300 font-medium truncate w-full text-center">
                        {t(ct.labelAr, ct.labelEn)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}


function EditField({ label, value, icon: Icon, disabled, onSave }: {
  label: string; value: string; icon: React.ElementType;
  disabled?: boolean; onSave?: (v: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const [saving, setSaving]   = useState(false);

  useEffect(() => { setDraft(value); }, [value]);

  const commit = async () => {
    if (!onSave || draft === value) { setEditing(false); return; }
    setSaving(true); await onSave(draft); setSaving(false); setEditing(false);
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Icon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={editing ? draft : value} onChange={e => setDraft(e.target.value)}
            readOnly={!editing || disabled}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
            className={cn(
              "w-full h-10 rounded-xl border text-sm ps-10 pe-4 transition-all",
              editing ? "border-primary bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      : "border-border bg-muted/40 text-foreground cursor-default",
              disabled && "opacity-60 cursor-not-allowed"
            )} />
        </div>
        {!disabled && onSave && (
          editing ? (
            <div className="flex gap-1">
              <button onClick={commit} disabled={saving}
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {saving ? <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => { setDraft(value); setEditing(false); }}
                className="w-8 h-8 rounded-lg border border-border text-muted-foreground flex items-center justify-center hover:bg-accent transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => { setDraft(value); setEditing(true); }}
              className="w-8 h-8 rounded-lg border border-border text-muted-foreground flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
