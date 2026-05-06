"use client";

import { MapPin, Phone, CreditCard, User2, Brain, Paperclip, ExternalLink, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useLang } from "@/lib/language-context";

interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

interface AiAnalysis {
  severity?: string;
  severityReason?: string;
  suggestedPriority?: string;
  summary?: string;
  keywords?: string[];
  estimatedResolutionDays?: number;
  recommendations?: string;
  isUrgent?: boolean;
  confidence?: number;
}

interface Props {
  nationalId?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  aiAnalysis?: string | null;
  attachments?: Attachment[];
  
  role?: "citizen" | "agent" | "admin";
  isAnonymous?: boolean;
}

const severityColors: Record<string, string> = {
  low:      "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  medium:   "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  high:     "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 dark:text-red-400",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ComplaintExtraInfo({
  nationalId, phoneNumber, gender,
  latitude, longitude, address,
  aiAnalysis, attachments = [],
  role = "citizen", isAnonymous = false,
}: Props) {
  const { t } = useLang();

  const canSeeSensitive = role !== "citizen";

  
  let ai: AiAnalysis | null = null;
  if (aiAnalysis) {
    try { ai = typeof aiAnalysis === "string" ? JSON.parse(aiAnalysis) : aiAnalysis; } catch {  }
  }

  const hasLocation   = latitude != null && longitude != null;
  const hasAddress    = !!address;
  const hasSensitive  = canSeeSensitive && !isAnonymous && (nationalId || phoneNumber || gender);
  const hasAttachments = attachments.length > 0;
  const hasAi         = !!ai;

  if (!hasLocation && !hasAddress && !hasSensitive && !hasAttachments && !hasAi) return null;

  return (
    <div className="space-y-3">

      
      {hasAi && ai && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">{t("تحليل الذكاء الاصطناعي", "AI Analysis")}</h3>
            {ai.isUrgent && (
              <span className="ms-auto flex items-center gap-1 text-xs font-medium text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                {t("عاجل", "Urgent")}
              </span>
            )}
          </div>

          {ai.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">{ai.summary}</p>
          )}

          <div className="grid grid-cols-2 gap-2">
            {ai.severity && (
              <div className="rounded-xl bg-muted/40 px-3 py-2">
                <p className="text-[10px] text-muted-foreground mb-0.5">{t("مستوى الخطورة", "Severity")}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityColors[ai.severity] ?? ""}`}>
                  {ai.severity}
                </span>
              </div>
            )}
            {ai.estimatedResolutionDays != null && (
              <div className="rounded-xl bg-muted/40 px-3 py-2">
                <p className="text-[10px] text-muted-foreground mb-0.5">{t("وقت الحل المتوقع", "Est. Resolution")}</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">
                    {ai.estimatedResolutionDays} {t("يوم", "days")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {ai.keywords && ai.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ai.keywords.map((kw, i) => (
                <span key={i} className="text-[11px] bg-primary/8 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {ai.recommendations && canSeeSensitive && (
            <div className="rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <p className="text-[11px] font-semibold text-primary">{t("التوصية", "Recommendation")}</p>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{ai.recommendations}</p>
            </div>
          )}

          {ai.confidence != null && (
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-muted-foreground">{t("دقة التحليل", "Confidence")}</p>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(ai.confidence * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{Math.round(ai.confidence * 100)}%</p>
            </div>
          )}
        </div>
      )}

      
      {(hasLocation || hasAddress) && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">{t("الموقع", "Location")}</h3>
          </div>
          {hasAddress && (
            <p className="text-sm text-muted-foreground">{address}</p>
          )}
          {hasLocation && (
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {t("عرض على الخريطة", "View on map")}
              {` (${latitude?.toFixed(5)}, ${longitude?.toFixed(5)})`}
            </a>
          )}
        </div>
      )}

      
      {hasSensitive && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t("بيانات المواطن", "Citizen Details")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nationalId && (
              <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
                <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{t("الرقم القومي", "National ID")}</p>
                  <p className="text-sm font-mono font-medium text-foreground">{nationalId}</p>
                </div>
              </div>
            )}
            {phoneNumber && (
              <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{t("رقم الموبايل", "Phone")}</p>
                  <p className="text-sm font-medium text-foreground" dir="ltr">{phoneNumber}</p>
                </div>
              </div>
            )}
            {gender && (
              <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
                <User2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{t("الجنس", "Gender")}</p>
                  <p className="text-sm font-medium text-foreground">
                    {gender === "male" ? t("ذكر", "Male") : t("أنثى", "Female")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      
      {hasAttachments && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-primary shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">
              {t("المرفقات", "Attachments")} ({attachments.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {attachments.map((att) => {
              const isImage = att.mimeType?.startsWith("image/");
              const isVideo = att.mimeType?.startsWith("video/");
              return (
                <div key={att.id} className="rounded-xl border border-border overflow-hidden bg-muted/20">
                  {isImage && (
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      
                      <img
                        src={att.url}
                        alt={att.filename}
                        className="w-full h-28 object-cover hover:opacity-90 transition-opacity"
                      />
                    </a>
                  )}
                  {isVideo && (
                    <video
                      src={att.url}
                      controls
                      className="w-full h-28 object-cover bg-black"
                    />
                  )}
                  {!isImage && !isVideo && (
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 hover:bg-accent transition-colors"
                    >
                      <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground truncate">{att.filename}</span>
                    </a>
                  )}
                  <div className="px-2 py-1.5 border-t border-border">
                    <p className="text-[10px] text-muted-foreground truncate">{att.filename}</p>
                    {att.sizeBytes && (
                      <p className="text-[10px] text-muted-foreground/60">{formatBytes(att.sizeBytes)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
