'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/lib/language-context'

export function TermsContent() {
  const { t } = useLang()

  const sections = [
    {
      titleAr: '١. قبول الشروط',
      titleEn: '1. Acceptance of Terms',
      bodyAr: 'باستخدامك لمنصة بلّغنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام المنصة.',
      bodyEn: 'By using the Ballaghna platform, you agree to be bound by these terms and conditions. If you do not agree to any part of them, please do not use the platform.',
    },
    {
      titleAr: '٢. استخدام الخدمة',
      titleEn: '2. Use of Service',
      bodyAr: 'يُسمح لك باستخدام بلّغنا للأغراض المشروعة فقط. يُحظر استخدام المنصة لأي نشاط غير قانوني أو ضار أو مسيء.',
      bodyEn: 'You are permitted to use Ballaghna for lawful purposes only. Using the platform for any illegal, harmful, or abusive activity is prohibited.',
    },
    {
      titleAr: '٣. الحسابات والمسؤولية',
      titleEn: '3. Accounts and Responsibility',
      bodyAr: 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك وعن جميع الأنشطة التي تتم من خلاله. يجب إخطارنا فوراً في حال الاشتباه بأي استخدام غير مصرح به.',
      bodyEn: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur through it. You must notify us immediately of any suspected unauthorized use.',
    },
    {
      titleAr: '٤. الملكية الفكرية',
      titleEn: '4. Intellectual Property',
      bodyAr: 'جميع المحتويات والتصاميم والكود الخاص بـ بلّغنا هي ملكية حصرية للشركة. لا يُسمح بنسخها أو توزيعها دون إذن كتابي مسبق.',
      bodyEn: 'All content, designs, and code belonging to Ballaghna are the exclusive property of the company. Copying or distributing them without prior written permission is not permitted.',
    },
    {
      titleAr: '٥. إخلاء المسؤولية',
      titleEn: '5. Disclaimer',
      bodyAr: 'تُقدَّم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المنصة.',
      bodyEn: 'The service is provided "as is" without any express or implied warranties. We are not liable for any direct or indirect damages resulting from the use of the platform.',
    },
    {
      titleAr: '٦. إنهاء الخدمة',
      titleEn: '6. Termination',
      bodyAr: 'نحتفظ بالحق في تعليق أو إنهاء حسابك في حال انتهاك هذه الشروط، مع إشعار مسبق كلما أمكن ذلك.',
      bodyEn: 'We reserve the right to suspend or terminate your account in case of violation of these terms, with prior notice whenever possible.',
    },
    {
      titleAr: '٧. التواصل معنا',
      titleEn: '7. Contact Us',
      bodyAr: 'لأي استفسارات حول هذه الشروط، تواصل معنا على: legal@Ballaghna.com',
      bodyEn: 'For any inquiries about these terms, contact us at: legal@Ballaghna.com',
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
            {t('شروط الاستخدام', 'Terms of Service')}
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
