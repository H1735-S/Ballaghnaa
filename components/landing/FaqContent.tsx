'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { cn } from '@/lib/utils'

const faqs = [
  {
    qAr: 'ما هو بلّغنا؟',
    qEn: 'What is Ballaghna?',
    aAr: 'بلّغنا هي منصة متكاملة لإدارة الشكاوى تساعد الفرق على تجميع وترتيب وحل كل شكوى بكفاءة مع تحليلات فورية.',
    aEn: 'Ballaghna is a complete complaint management platform that helps teams centralize, prioritize, and resolve every complaint efficiently with real-time analytics.',
  },
  {
    qAr: 'هل يمكنني استخدام بلّغنا مجاناً؟',
    qEn: 'Can I use Ballaghna for free?',
    aAr: 'نعم، نقدم خطة مجانية تتيح لك إدارة حتى 50 شكوى مع الميزات الأساسية. يمكنك الترقية في أي وقت.',
    aEn: 'Yes, we offer a free plan that allows you to manage up to 50 complaints with basic features. You can upgrade at any time.',
  },
  {
    qAr: 'كيف يمكنني إضافة أعضاء الفريق؟',
    qEn: 'How can I add team members?',
    aAr: 'من لوحة التحكم، اذهب إلى إعدادات المستخدمين وأضف أعضاء الفريق بتحديد أدوارهم (مشرف، وكيل، مشاهد).',
    aEn: 'From the dashboard, go to User Settings and add team members by assigning their roles (supervisor, agent, viewer).',
  },
  {
    qAr: 'هل البيانات آمنة؟',
    qEn: 'Is my data secure?',
    aAr: 'نعم، نستخدم تشفير SSL وأحدث معايير الأمان لحماية بياناتك. جميع البيانات مخزنة على خوادم آمنة.',
    aEn: 'Yes, we use SSL encryption and the latest security standards to protect your data. All data is stored on secure servers.',
  },
  {
    qAr: 'هل يدعم بلّغنا اللغة العربية؟',
    qEn: 'Does Ballaghna support Arabic?',
    aAr: 'نعم، بلّغنا يدعم اللغتين العربية والإنجليزية بشكل كامل مع دعم الاتجاه من اليمين لليسار (RTL).',
    aEn: 'Yes, Ballaghna fully supports both Arabic and English with right-to-left (RTL) direction support.',
  },
  {
    qAr: 'كيف أتواصل مع الدعم الفني؟',
    qEn: 'How do I contact technical support?',
    aAr: 'يمكنك التواصل معنا عبر صفحة "تواصل معنا" أو عبر البريد الإلكتروني support@Ballaghna.com وسنرد خلال 24 ساعة.',
    aEn: 'You can reach us through the "Contact Us" page or via email at support@Ballaghna.com and we will respond within 24 hours.',
  },
  {
    qAr: 'هل يمكنني تصدير البيانات؟',
    qEn: 'Can I export my data?',
    aAr: 'نعم، يمكنك تصدير جميع بياناتك بصيغة CSV أو PDF من لوحة التحكم في أي وقت.',
    aEn: 'Yes, you can export all your data in CSV or PDF format from the dashboard at any time.',
  },
  {
    qAr: 'هل هناك تطبيق جوال؟',
    qEn: 'Is there a mobile app?',
    aAr: 'حالياً بلّغنا متاح كتطبيق ويب متجاوب يعمل على جميع الأجهزة. تطبيق الجوال قيد التطوير.',
    aEn: 'Currently Ballaghna is available as a responsive web app that works on all devices. A mobile app is under development.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start hover:bg-muted/40 transition-colors"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown className={cn('w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export function FaqContent() {
  const { t, lang } = useLang()

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">FAQ</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('إجابات على أكثر الأسئلة شيوعاً', 'Answers to the most common questions')}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i}
              q={lang === 'ar' ? faq.qAr : faq.qEn}
              a={lang === 'ar' ? faq.aAr : faq.aEn} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-12 text-center p-8 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-foreground font-semibold mb-2">{t('لم تجد إجابتك؟', "Didn't find your answer?")}</p>
          <p className="text-muted-foreground text-sm mb-4">{t('تواصل معنا وسنساعدك', 'Contact us and we will help you')}</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            {t('تواصل معنا', 'Contact us')}
          </a>
        </motion.div>
      </div>
    </main>
  )
}
