"use client";

import { ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useLang } from "@/lib/language-context";
import { ConfirmAction } from "@/components/ui/confirm-action";

interface SignOutButtonProps {
  children: (props: { onClick: () => void; disabled: boolean }) => ReactNode;
}

export function SignOutButton({ children }: SignOutButtonProps) {
  const { t } = useLang();

  return (
    <ConfirmAction
      title={t("تسجيل الخروج", "Sign out")}
      description={t(
        "هل أنت متأكد أنك تريد تسجيل الخروج الآن؟ يمكنك تسجيل الدخول مرة أخرى في أي وقت.",
        "Are you sure you want to sign out now? You can sign back in at any time."
      )}
      confirmLabel={t("تأكيد الخروج", "Confirm sign out")}
      cancelLabel={t("إلغاء", "Cancel")}
      loadingLabel={t("جارٍ الخروج...", "Signing out...")}
      variant="primary"
      onConfirm={() => signOut({ callbackUrl: "/login" })}
      trigger={children}
    />
  );
}
