"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Trash2, X, AlertTriangle } from "lucide-react";
import { useLang } from "@/lib/language-context";

interface Props {
  open: boolean;
  type?: "logout" | "delete";
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const config = {
  logout: {
    icon: LogOut,
    gradient: "from-primary/20 to-primary/5",
    ring: "ring-primary/20",
    iconColor: "text-primary",
    btnClass: "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25",
  },
  delete: {
    icon: Trash2,
    gradient: "from-destructive/20 to-destructive/5",
    ring: "ring-destructive/20",
    iconColor: "text-destructive",
    btnClass: "bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/25",
  },
};

export function ConfirmDialog({
  open, type = "logout", title, description, confirmLabel, onConfirm, onCancel,
}: Props) {
  const { t } = useLang();
  const cfg = config[type];
  const Icon = cfg.icon;

  const defaultTitle = type === "logout"
    ? t("تسجيل الخروج", "Sign out")
    : t("تأكيد الحذف", "Confirm Delete");

  const defaultDesc = type === "logout"
    ? t("هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟", "Are you sure you want to sign out of your account?")
    : t("هذا الإجراء لا يمكن التراجع عنه.", "This action cannot be undone.");

  const defaultConfirm = type === "logout"
    ? t("تسجيل الخروج", "Sign out")
    : t("حذف", "Delete");

  return (
    <AnimatePresence>
      {open && (
        <>
          
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
          />

          
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.85, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
            >
              <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">

                
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${cfg.gradient} pointer-events-none`} />

                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={onCancel}
                  className="absolute top-4 end-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>

                <div className="relative px-6 pt-8 pb-6 space-y-6">
                  
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.06 }}
                    className="flex justify-center"
                  >
                    <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${cfg.gradient} ring-4 ${cfg.ring} flex items-center justify-center`}>
                      
                      <motion.div
                        className={`absolute inset-0 rounded-3xl ring-4 ${cfg.ring}`}
                        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <Icon className={`w-9 h-9 ${cfg.iconColor}`} strokeWidth={1.8} />
                    </div>
                  </motion.div>

                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center space-y-2"
                  >
                    <h3 className="text-lg font-bold text-foreground">{title ?? defaultTitle}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description ?? defaultDesc}</p>
                  </motion.div>

                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col gap-2.5"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onConfirm}
                      className={`w-full h-11 rounded-2xl text-sm font-semibold text-white transition-all ${cfg.btnClass}`}
                    >
                      {confirmLabel ?? defaultConfirm}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={onCancel}
                      className="w-full h-11 rounded-2xl border border-border text-sm font-medium text-foreground hover:bg-accent transition-all"
                    >
                      {t("إلغاء", "Cancel")}
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
