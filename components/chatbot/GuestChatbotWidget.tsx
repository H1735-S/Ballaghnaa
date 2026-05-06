"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ChevronDown, ChevronUp, LogIn, UserPlus } from "lucide-react";
import { useLang } from "@/lib/language-context";
import Image from "next/image";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const QUICK_QUESTIONS = [
  { ar: "ما هي منصة بلّغنا؟", en: "What is Ballaghna platform?" },
  { ar: "كيف أرفع شكوى؟", en: "How do I submit a complaint?" },
  { ar: "هل التسجيل مجاني؟", en: "Is registration free?" },
  { ar: "كيف أتابع شكواي؟", en: "How do I track my complaint?" },
  { ar: "هل يمكنني الشكوى بشكل مجهول؟", en: "Can I complain anonymously?" },
  { ar: "ما أنواع الشكاوى المقبولة؟", en: "What types of complaints are accepted?" },
];

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === "") { i++; continue; }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-1 ps-1">
          {items.map((item, idx) => <li key={idx} className="text-sm leading-relaxed">{item}</li>)}
        </ol>
      );
      continue;
    }
    if (/^[-•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-•]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={i} className="space-y-1 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    elements.push(
      <p key={i} className="text-sm leading-relaxed">
        {parts.map((part, pi) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={pi} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
            : <span key={pi}>{part}</span>
        )}
      </p>
    );
    i++;
  }
  return <div className="space-y-1.5">{elements}</div>;
}

export function GuestChatbotWidget() {
  const { lang, t, isRtl } = useLang();
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 320); }, [isOpen]);

  const sendMessage = useCallback(async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isLoading) return;
    setInput("");
    setIsLoading(true);
    setShowQuick(false);
    const newMsg: Message = { id: Date.now().toString(), role: "user", text: message };
    setMessages(prev => [...prev, newMsg]);
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    try {
      const res  = await fetch("/api/public/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      const reply = res.ok
        ? (data.reply ?? t("عذراً، لم أتمكن من الإجابة.", "Sorry, I couldn't respond."))
        : (data.error ?? t("عذراً، حدث خطأ.", "Sorry, an error occurred."));
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: t("عذراً، حدث خطأ في الاتصال.", "Sorry, connection error.") }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!isMounted) return null;

  return (
    <>
      
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: 56, x: -16, scale: 0.82, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            dir={isRtl ? "rtl" : "ltr"}
            className="fixed bottom-24 left-6 z-50 w-[22rem] max-w-[calc(100vw-3rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-background"
            style={{ height: "min(560px, calc(100vh - 8rem))" }}
          >
            
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary dark:bg-primary/40 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 overflow-hidden">
                <Image src="/logo-new.png" alt="بلّغنا" width={28} height={28} className="object-contain brightness-0 invert contrast-150" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">{t("مساعد بلّغنا", "Ballaghna Assistant")}</p>
                <p className="text-[11px] text-green-300 leading-tight">{t("متاح الآن", "Available now")}</p>
              </div>
            </div>

            
            <div className="flex-1 overflow-y-auto">

              
              {showQuick && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">{t("مرحباً! كيف يمكنني مساعدتك؟ اختر سؤالاً أو اكتب ما تريد.", "Hi! How can I help? Pick a question or type below.")}</p>
                  <div className="flex flex-col gap-1.5">
                    {QUICK_QUESTIONS.map((q, i) => (
                      <button key={i} onClick={() => sendMessage(lang === "ar" ? q.ar : q.en)}
                        className="text-start px-3 py-2 rounded-xl border border-border hover:border-primary/80 hover:bg-accent/60 text-[13px] text-muted-foreground hover:text-foreground transition-all">
                        {lang === "ar" ? q.ar : q.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              
              {messages.length > 0 && (
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
                        {msg.role === "assistant" ? <FormattedMessage text={msg.text} /> : msg.text}
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
                            <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60"
                              animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                          ))}
                        </span>
                      </div>
                    </div>
                  )}

                  {!isLoading && !showQuick && (
                    <button onClick={() => setShowQuick(true)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto">
                      <ChevronUp className="w-3.5 h-3.5" />
                      {t("عرض الأسئلة الشائعة", "Show quick questions")}
                    </button>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            
            <div className="px-3 py-2.5 border-t border-border bg-primary/5 flex items-center gap-2 shrink-0">
              <p className="flex-1 text-[11px] text-muted-foreground leading-tight">
                {t("سجّل حساباً لرفع شكواك الآن", "Create an account to submit your complaint")}
              </p>
              <Link href="/register"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors shrink-0">
                <UserPlus className="w-3 h-3" />
                {t("تسجيل", "Register")}
              </Link>
              <Link href="/login"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-[11px] font-semibold hover:bg-accent transition-colors shrink-0">
                <LogIn className="w-3 h-3" />
                {t("دخول", "Login")}
              </Link>
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
              <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
                aria-label={t("إرسال", "Send")}>
                <Send className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
