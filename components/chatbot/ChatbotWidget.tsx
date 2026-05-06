"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Trash2,
  ChevronDown, ChevronUp, FileText, Search, Settings,
  Users, FolderOpen, BarChart2, ClipboardList, Tag, TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLang } from "@/lib/language-context";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface SuggestionGroup {
  label: { ar: string; en: string };
  icon: React.ReactNode;
  items: { ar: string; en: string }[];
}

const iconClass = "w-3.5 h-3.5 text-primary shrink-0";

const SUGGESTIONS: Record<string, SuggestionGroup[]> = {
  citizen: [
    {
      label: { ar: "رفع الشكاوى", en: "Submitting Complaints" },
      icon: <FileText className={iconClass} />,
      items: [
        { ar: "كيف أرفع شكوى جديدة؟", en: "How do I submit a new complaint?" },
        { ar: "هل يمكنني رفع شكوى بشكل مجهول؟", en: "Can I submit a complaint anonymously?" },
        { ar: "ما هي التصنيفات المتاحة للشكاوى؟", en: "What complaint categories are available?" },
        { ar: "كيف أختار الأولوية المناسبة؟", en: "How do I choose the right priority?" },
        { ar: "هل يمكنني إرفاق صور أو ملفات؟", en: "Can I attach images or files?" },
      ],
    },
    {
      label: { ar: "المتابعة والحالات", en: "Tracking & Status" },
      icon: <Search className={iconClass} />,
      items: [
        { ar: "كيف أتابع حالة شكواي؟", en: "How do I track my complaint?" },
        { ar: "ما معنى حالة in_review؟", en: "What does in_review status mean?" },
        { ar: "ما معنى حالة assigned؟", en: "What does assigned status mean?" },
        { ar: "ما معنى حالة escalated؟", en: "What does escalated status mean?" },
        { ar: "متى تُعتبر الشكوى مغلقة؟", en: "When is a complaint considered closed?" },
        { ar: "كيف أعرف إذا تم حل شكواي؟", en: "How do I know if my complaint is resolved?" },
      ],
    },
    {
      label: { ar: "الحساب والإعدادات", en: "Account & Settings" },
      icon: <Settings className={iconClass} />,
      items: [
        { ar: "كيف أعدّل بيانات حسابي؟", en: "How do I update my profile?" },
        { ar: "كيف أغيّر كلمة المرور؟", en: "How do I change my password?" },
        { ar: "كيف أستعرض سجل شكاواي؟", en: "How do I view my complaint history?" },
        { ar: "هل يمكنني حذف شكوى بعد رفعها؟", en: "Can I delete a complaint after submitting?" },
      ],
    },
  ],

  agent: [
    {
      label: { ar: "إدارة الشكاوى", en: "Complaint Management" },
      icon: <ClipboardList className={iconClass} />,
      items: [
        { ar: "كيف أحدّث حالة الشكوى؟", en: "How do I update a complaint status?" },
        { ar: "كيف أضيف تعليقاً داخلياً؟", en: "How do I add an internal comment?" },
        { ar: "كيف أرى الشكاوى المسندة إليّ؟", en: "How do I view my assigned complaints?" },
        { ar: "كيف أتعامل مع شكوى عالية الأولوية؟", en: "How do I handle a high priority complaint?" },
        { ar: "كيف أطلب تصعيد شكوى؟", en: "How do I request complaint escalation?" },
      ],
    },
    {
      label: { ar: "التصنيفات والتخصص", en: "Categories & Specialization" },
      icon: <Tag className={iconClass} />,
      items: [
        { ar: "كيف أطلب تصنيفاً جديداً؟", en: "How do I request a new category?" },
        { ar: "كيف أرى تخصصاتي الحالية؟", en: "How do I view my current specializations?" },
        { ar: "ما الفرق بين التصنيفات المتاحة؟", en: "What is the difference between categories?" },
      ],
    },
    {
      label: { ar: "الأداء والإحصائيات", en: "Performance & Stats" },
      icon: <TrendingUp className={iconClass} />,
      items: [
        { ar: "كيف أرى إحصائياتي الشهرية؟", en: "How do I view my monthly stats?" },
        { ar: "كيف يتم احتساب معدل الإنجاز؟", en: "How is my completion rate calculated?" },
        { ar: "كيف أحسّن تقييمي؟", en: "How do I improve my rating?" },
        { ar: "كيف أرى سجل نشاطاتي؟", en: "How do I view my activity log?" },
      ],
    },
  ],

  supervisor: [],

  admin: [
    {
      label: { ar: "إدارة المستخدمين", en: "User Management" },
      icon: <Users className={iconClass} />,
      items: [
        { ar: "كيف أضيف مستخدماً جديداً؟", en: "How do I add a new user?" },
        { ar: "كيف أغيّر دور مستخدم؟", en: "How do I change a user's role?" },
        { ar: "كيف أوقف حساب مستخدم مؤقتاً؟", en: "How do I suspend a user account?" },
        { ar: "كيف أراجع طلبات تغيير الأدوار؟", en: "How do I review role change requests?" },
        { ar: "كيف أربط وكيلاً بمشرف؟", en: "How do I assign an agent to a supervisor?" },
      ],
    },
    {
      label: { ar: "التصنيفات والأقسام", en: "Categories & Departments" },
      icon: <Tag className={iconClass} />,
      items: [
        { ar: "كيف أضيف تصنيفاً جديداً؟", en: "How do I add a new category?" },
        { ar: "كيف أراجع طلبات التصنيف المعلقة؟", en: "How do I review pending category requests?" },
        { ar: "كيف أحذف أو أعدّل تصنيفاً؟", en: "How do I delete or edit a category?" },
        { ar: "كيف أدير الأقسام؟", en: "How do I manage departments?" },
      ],
    },
    {
      label: { ar: "التحليلات والنظام", en: "Analytics & System" },
      icon: <BarChart2 className={iconClass} />,
      items: [
        { ar: "كيف أرى إحصائيات النظام الكاملة؟", en: "How do I view full system analytics?" },
        { ar: "ما هي الشكاوى الأكثر تكراراً؟", en: "What are the most frequent complaints?" },
        { ar: "كيف أرى سجل النشاطات؟", en: "How do I view the activity log?" },
        { ar: "كيف أعدّل إعدادات النظام؟", en: "How do I modify system settings?" },
        { ar: "كيف أصدّر تقريراً شاملاً؟", en: "How do I export a comprehensive report?" },
      ],
    },
  ],
};



function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === "") { i++; continue; }

    
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-1 ps-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    
    if (/^[-•]\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-•]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-•]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-1 my-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    
    elements.push(
      <p key={i} className="text-sm leading-relaxed">
        <InlineText text={line} />
      </p>
    );
    i++;
  }

  return <div className="space-y-1.5">{elements}</div>;
}


function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}



interface Props {
  role?: string;
}

export function ChatbotWidget({ role = "citizen" }: Props) {
  const { lang, t, isRtl } = useLang();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "guest";

  const storageKey = `chatbot_history_${userId}`;

  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isMounted, setIsMounted]   = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  const groups = SUGGESTIONS[role] ?? SUGGESTIONS.citizen;

  
  useEffect(() => {
    setIsMounted(true);
    if (!userId || userId === "guest") return;
    fetch("/api/chatbot/history")
      .then(r => r.ok ? r.json() : [])
      .then((rows: { id: string; role: string; text: string }[]) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setMessages(rows.map(r => ({ id: r.id, role: r.role as "user" | "assistant", text: r.text })));
        }
      })
      .catch(() => {});
  }, [userId]);

  
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (messages.length > 0) {
        
        const toSave = messages.slice(-60);
        localStorage.setItem(storageKey, JSON.stringify(toSave));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {  }
  }, [messages, storageKey, isMounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 320);
  }, [isOpen]);

  const sendMessage = useCallback(async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;

    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: message };
    setMessages(prev => [...prev, userMsg]);

    const history = messages.map(m => ({ role: m.role, text: m.text }));

    try {
      const res  = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      const reply = res.ok
        ? (data.reply ?? t("عذراً، لم أتمكن من الإجابة.", "Sorry, I couldn't respond."))
        : (data.error ?? t("عذراً، حدث خطأ.", "Sorry, an error occurred."));

      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: reply };
      setMessages(prev => [...prev, assistantMsg]);

      
      if (userId && userId !== "guest") {
        fetch("/api/chatbot/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([
            { role: "user", text: message },
            { role: "assistant", text: reply },
          ]),
        }).catch(() => {});
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: "assistant",
        text: t("عذراً، حدث خطأ في الاتصال.", "Sorry, connection error."),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, t, userId]);

  const clearChat = () => {
    setMessages([]);
    setConfirmClear(false);
    setExpandedGroup(0);
    setShowSuggestions(false);
    if (userId && userId !== "guest") {
      fetch("/api/chatbot/history", { method: "DELETE" }).catch(() => {});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const hasMessages = messages.length > 0;

  if (!isMounted) return null;

  return (
    <>
      
      <motion.div
        className={`fixed bottom-6 z-50 ${isRtl ? "left-6" : "right-6"}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <button
            onClick={() => setIsOpen(v => !v)}
            className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 flex items-center justify-center relative transition-colors overflow-hidden"
            aria-label={t("فتح المساعد", "Open assistant")}
          >
            <AnimatePresence mode="wait">
              {isOpen
                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X className="w-5 h-5 text-white" />
                  </motion.div>
                : <motion.div key="logo" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Image src="/logo-new.png" alt="بلّغنا" width={36} height={36} className="object-contain brightness-0 invert" />
                  </motion.div>
              }
            </AnimatePresence>
            <span className="absolute inset-0 rounded-2xl bg-primary/30 animate-ping opacity-20" />
          </button>
        </motion.div>
      </motion.div>

      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: isRtl ? -20 : 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: 56, x: isRtl ? -16 : 16, scale: 0.82, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            dir={isRtl ? "rtl" : "ltr"}
            className={`fixed bottom-24 z-50 w-[22rem] max-w-[calc(100vw-3rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-background ${isRtl ? "left-6" : "right-6"}`}
            style={{ height: "min(580px, calc(100vh - 8rem))" }}
          >
            
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary dark:bg-primary/40 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 overflow-hidden">
                <Image src="/logo-new.png" alt="بلّغنا" width={28} height={28} className="object-contain brightness-0 invert contrast-150" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">
                  {t("مساعد بلّغنا", "Ballaghna Assistant")}
                </p>
                <p className="text-[11px] text-white/60 leading-tight">
                </p>
              </div>

              {hasMessages && !confirmClear && (
                <button
                  onClick={() => setConfirmClear(true)}
                  title={t("مسح المحادثة", "Clear chat")}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              {confirmClear && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1">
                  <span className="text-xs text-white">{t("مسح؟", "Clear?")}</span>
                  <button onClick={clearChat} className="text-xs px-2 py-0.5 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-colors">
                    {t("نعم", "Yes")}
                  </button>
                  <button onClick={() => setConfirmClear(false)} className="text-xs px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white border border-white/20 transition-colors">
                    {t("لا", "No")}
                  </button>
                </div>
              )}
            </div>

            
            <div className="flex-1 overflow-y-auto">

              
              {(!hasMessages || showSuggestions) && (
                <div className="p-4 space-y-2">
                  {hasMessages && (
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                      {t("العودة للمحادثة", "Back to chat")}
                    </button>
                  )}
                  <p className="text-xs text-muted-foreground mb-3 px-0.5">
                    {t("اختر سؤالاً أو اكتب ما تريد معرفته", "Pick a question or type anything below")}
                  </p>

                  {groups.map((group, gi) => {
                    const isExpanded = expandedGroup === gi;
                    return (
                      <div key={gi} className="rounded-xl border border-border overflow-hidden">
                        <button
                          onClick={() => setExpandedGroup(isExpanded ? null : gi)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 hover:bg-muted/70 transition-colors"
                        >
                          {group.icon}
                          <span className="flex-1 text-xs font-semibold text-foreground text-start">
                            {lang === "ar" ? group.label.ar : group.label.en}
                          </span>
                          {isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          }
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="divide-y divide-border/60">
                                {group.items.map((item, ii) => (
                                  <button
                                    key={ii}
                                    onClick={() => sendMessage(lang === "ar" ? item.ar : item.en)}
                                    className="w-full text-start px-3 py-2.5 hover:bg-accent/60 transition-colors text-[13px] text-muted-foreground hover:text-foreground"
                                  >
                                    {lang === "ar" ? item.ar : item.en}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

              
              {hasMessages && !showSuggestions && (
                <div className="p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5 me-2 overflow-hidden">
                          <Image src="/logo-new.png" alt="" width={18} height={18} className="object-contain brightness-0 invert contrast-150" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm text-sm leading-relaxed"
                          : "bg-muted/60 border border-border text-foreground rounded-tl-sm"
                      }`}>
                        {msg.role === "assistant"
                          ? <FormattedMessage text={msg.text} />
                          : msg.text
                        }
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5 me-2 overflow-hidden">
                        <Image src="/logo-new.png" alt="" width={18} height={18} className="object-contain brightness-0 invert contrast-150" />
                      </div>
                      <div className="bg-muted/60 border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                        <span className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-primary/60"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  )}

                  {!isLoading && (
                    <div className="flex justify-center pt-1">
                      <button
                        onClick={() => setShowSuggestions(true)}
                        className="text-[11px] text-muted-foreground hover:text-foreground border border-border/60 rounded-full px-3 py-1 hover:bg-accent transition-colors"
                      >
                        {t("عرض الأسئلة الشائعة", "Browse suggestions")}
                      </button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            
            <div className="px-3 py-3 border-t border-border bg-muted/10 flex gap-2 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("اكتب سؤالك...", "Type your question...")}
                disabled={isLoading}
                dir={isRtl ? "rtl" : "ltr"}
                className="flex-1 h-9 px-3 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
                aria-label={t("إرسال", "Send")}
              >
                <Send className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
