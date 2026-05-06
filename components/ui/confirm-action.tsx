"use client";

import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

interface ConfirmActionProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void | Promise<void>;
  trigger: (props: { onClick: () => void; disabled: boolean }) => ReactNode;
  variant?: "danger" | "primary";
  loadingLabel?: string;
}

export function ConfirmAction({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  trigger,
  variant = "danger",
  loadingLabel,
}: ConfirmActionProps) {
  const { t } = useLang();
  const titleId = useId();
  const descId = useId();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {trigger({ onClick: () => setOpen(true), disabled: submitting })}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] overflow-y-auto bg-background/96 backdrop-blur-xl"
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative min-h-screen w-full"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,95,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,95,143,0.12),transparent_28%)]" />

              <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border/80 bg-background/90 shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
                  <div className="border-b border-border/70 bg-gradient-to-r from-primary/12 via-primary/5 to-transparent px-6 py-5 sm:px-8">
                    <div
                      className={cn(
                        "mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border shadow-sm",
                        variant === "danger"
                          ? "border-destructive/15 bg-destructive/10 text-destructive"
                          : "border-primary/15 bg-primary/10 text-primary"
                      )}
                    >
                      <AlertTriangle className="h-6 w-6" />
                    </div>

                    <h3 id={titleId} className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {title}
                    </h3>
                    <p id={descId} className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {description}
                    </p>
                  </div>

                  <div className="grid gap-6 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-border bg-muted/35 p-5">
                        <p className="text-sm font-semibold text-foreground">
                          {variant === "danger"
                            ? t("العملية تحتاج تأكيد نهائي", "This action needs final confirmation")
                            : t("تأكيد الجلسة", "Session confirmation")}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {variant === "danger"
                            ? t(
                                "الخطوة دي محمية لتجنب أي حذف بالخطأ ولتحافظ على نفس تجربة النظام في الإجراءات الحساسة.",
                                "This step is protected to prevent accidental deletion and keep sensitive actions consistent across the system."
                              )
                            : t(
                                "بنظهر شاشة التأكيد دي قبل إنهاء الجلسة عشان تسجيل الخروج يكون مقصود وواضح للمستخدم.",
                                "We show this confirmation screen before ending the session so sign out feels intentional and clear."
                              )}
                        </p>
                      </div>

                      <div className="rounded-[1.5rem] border border-border bg-background p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
                          {variant === "danger"
                            ? t("حذف محمي", "Protected delete")
                            : t("خروج محمي", "Protected exit")}
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                              "h-full rounded-full",
                              variant === "danger" ? "bg-destructive" : "bg-primary"
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-border bg-muted/25 p-5">
                      <p className="text-sm font-semibold text-foreground">
                        {t("اختر الخطوة التالية", "Choose the next step")}
                      </p>
                      <div className="mt-5 flex flex-col gap-3">
                        <Button
                          type="button"
                          variant={variant === "danger" ? "danger" : "primary"}
                          className="h-12 rounded-2xl text-sm"
                          onClick={handleConfirm}
                          disabled={submitting}
                        >
                          {submitting ? loadingLabel ?? confirmLabel : confirmLabel}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 rounded-2xl text-sm"
                          onClick={() => setOpen(false)}
                          disabled={submitting}
                        >
                          {cancelLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
