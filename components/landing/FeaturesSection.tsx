'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquareWarning, BarChart3, Shield, Bell, Users, CheckCircle2 } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export function FeaturesSection() {
  const { t } = useLang()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    { icon: MessageSquareWarning, title: t('شكاوى مركزية',    'Centralized Complaints'), description: t('التقط وتتبع وأدر كل شكوى في مساحة عمل موحدة.',                                    'Capture, track, and manage every complaint in one unified workspace.') },
    { icon: BarChart3,            title: t('تحليلات فورية',   'Real-time Analytics'),    description: t('افهم الاتجاهات ومعدلات الحل وأداء الفريق بلمحة.',                                  'Understand trends, resolution rates, and team performance at a glance.') },
    { icon: Shield,               title: t('تصعيد الأولويات','Priority Escalation'),    description: t('تصعيد تلقائي للمشكلات الحرجة حتى لا يفوتك شيء.',                                  'Automatically escalate critical issues so nothing falls through the cracks.') },
    { icon: Bell,                 title: t('إشعارات ذكية',   'Smart Notifications'),    description: t('أبقِ فريقك على اطلاع بتنبيهات دقيقة وفي الوقت المناسب.',                          'Keep your team informed with targeted, timely alerts and reminders.') },
    { icon: Users,                title: t('تعاون الفريق',   'Team Collaboration'),     description: t('عيّن وعلّق وحل الشكاوى معاً عبر الأقسام.',                                         'Assign, comment, and resolve complaints together across departments.') },
    { icon: CheckCircle2,         title: t('تتبع الحل',      'Resolution Tracking'),    description: t('راقب مستويات الخدمة والجداول الزمنية مع سجلات تدقيق كاملة.',                       'Monitor SLAs and resolution timelines with full audit trails.') },
  ]

  return (
    <section id="features" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('ما نقدمه', 'What we offer')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('كل ما يحتاجه فريقك', 'Everything your team needs')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('مبني لفرق الدعم ومديري العمليات ونجاح العملاء — كل شيء في منصة واحدة.', 'Built for support teams, operations managers, and customer success — all in one platform.')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
