'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/language-context'

export function CTASection() {
  const { t } = useLang()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-muted/40 border border-border p-8 sm:p-12 md:p-16">
          <div className="absolute top-0 end-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 start-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('ابدأ إدارة شكاواك بذكاء اليوم', 'Start managing complaints smarter today')}
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('هل أنت مستعد لتبسيط شكاواك؟', 'Ready to streamline your complaints?')}
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t(
                'انضم إلى مئات الفرق التي تستخدم بلّغنا بالفعل للحل بشكل أسرع وخدمة أفضل وعلاقات أقوى مع العملاء.',
                'Join hundreds of teams already using Ballaghna to resolve faster, serve better, and build stronger customer relationships.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg h-14 px-8 gap-2">
                  {t('ابدأ مجاناً', 'Get started free')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                  {t('تسجيل الدخول', 'Sign in')}
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
              {[t('مجاني تماماً', 'Completely free'), t('لا يلزم بطاقة ائتمان', 'No credit card required'), t('دعم على مدار الساعة', '24/7 support')].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
