'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/lib/language-context'

export function PrivacyContent() {
  const { t } = useLang()

  const sections = [
    {
      titleAr: '١. المعلومات التي نجمعها',
      titleEn: '1. Information We Collect',
      bodyAr: 'نجمع المعلومات التي تقدمها مباشرة مثل الاسم والبريد الإلكتروني عند التسجيل. كما نجمع بيانات الاستخدام تلقائياً مثل عنوان IP ونوع المتصفح وصفحات الزيارة.',
      bodyEn: 'We collect information you provide directly such as name and email when registering. We also automatically collect usage data such as IP address, browser type, and pages visited.',
    },
    {
      titleAr: '٢. كيف نستخدم معلوماتك',
      titleEn: '2. How We Use Your Information',
      bodyAr: 'نستخدم معلوماتك لتقديم الخدمة وتحسينها، وإرسال الإشعارات المتعلقة بحسابك، والرد على استفساراتك، وتحليل أنماط الاستخدام لتحسين المنصة.',
      bodyEn: 'We use your information to provide and improve the service, send account-related notifications, respond to your inquiries, and analyze usage patterns to improve the platform.',
    },
    {
      titleAr: '٣. مشاركة المعلومات',
      titleEn: '3. Information Sharing',
      bodyAr: 'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات مع مزودي الخدمة الذين يساعدوننا في تشغيل المنصة، وذلك وفق اتفاقيات سرية صارمة.',
      bodyEn: 'We do not sell or rent your personal information to third parties. We may share information with service providers who help us operate the platform, under strict confidentiality agreements.',
    },
    {
      titleAr: '٤. أمان البيانات',
      titleEn: '4. Data Security',
      bodyAr: 'نستخدم تشفير SSL وأحدث معايير الأمان لحماية بياناتك. نراجع ممارساتنا الأمنية بانتظام ونحدّثها للحماية من التهديدات الجديدة.',
      bodyEn: 'We use SSL encryption and the latest security standards to protect your data. We regularly review and update our security practices to protect against new threats.',
    },
    {
      titleAr: '٥. حقوقك',
      titleEn: '5. Your Rights',
      bodyAr: 'يحق لك الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها في أي وقت. يمكنك أيضاً طلب نسخة من بياناتك أو الاعتراض على معالجتها عبر التواصل معنا.',
      bodyEn: 'You have the right to access, correct, or delete your personal data at any time. You can also request a copy of your data or object to its processing by contacting us.',
    },
    {
      titleAr: '٦. ملفات تعريف الارتباط (Cookies)',
      titleEn: '6. Cookies',
      bodyAr: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك التحكم في إعدادات الكوكيز من متصفحك.',
      bodyEn: 'We use cookies to improve your experience and remember your preferences. You can control cookie settings from your browser.',
    },
    {
      titleAr: '٧. التواصل معنا',
      titleEn: '7. Contact Us',
      bodyAr: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية، تواصل معنا على: privacy@Ballaghna.com',
      bodyEn: 'If you have any questions about this Privacy Policy, contact us at: privacy@Ballaghna.com',
    },
  ]

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('قانوني', 'Legal')}
          </span>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {t('سياسة الخصوصية', 'Privacy Policy')}
          </h1>
          <p className="text-muted-foreground">
            {t('آخر تحديث: مارس 2025', 'Last updated: March 2025')}
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-7">
              <h2 className="text-lg font-bold text-foreground mb-3">{t(s.titleAr, s.titleEn)}</h2>
              <p className="text-muted-foreground leading-relaxed">{t(s.bodyAr, s.bodyEn)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
