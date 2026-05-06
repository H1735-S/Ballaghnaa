'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Plus, Search, CheckCircle } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export function HowItWorksSection() {
  const { t } = useLang()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const steps = [
    { icon: Plus,         step: '01', title: t('أنشئ واستقبل', 'Create & Capture'),      description: t('سجّل الشكاوى بمعلومات تفصيلية ومرفقات ومستويات أولوية لتتبع أفضل وتنظيم أمثل.', 'Register complaints with detailed information, attachments, and priority levels for better tracking.') },
    { icon: Search,       step: '02', title: t('حلّل ورتّب',   'Analyze & Prioritize'),  description: t('احصل على رؤى فورية مع تحليلات في الوقت الحقيقي وتصنيف ذكي للتركيز على الأهم.',    'Get instant insights with real-time analytics and smart categorization to focus on what matters most.') },
    { icon: CheckCircle,  step: '03', title: t('حل وتتبع',     'Resolve & Track'),       description: t('عيّن المهام وتعاون مع فريقك وراقب تقدم الحل مع سجلات تدقيق كاملة.',              'Assign tasks, collaborate with your team, and monitor resolution progress with full audit trails.') },
  ]

  return (
    <section id="how-it-works" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('خطوات بسيطة', 'Simple steps')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('كيف يعمل', 'How it works')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('ثلاث خطوات بسيطة فقط لتبسيط عملية إدارة الشكاوى', 'Just three simple steps to streamline your complaint management process')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-[3.5rem] start-[16%] end-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }} className="relative">
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/40 transition-all duration-300 h-full">
                <div className="absolute -top-4 end-6 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
                  {step.step}
                </div>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mt-2">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              <h3 className="text-lg sm:text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
