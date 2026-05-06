'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export function TrackingSection() {
  const { t } = useLang()
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [code, setCode] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    router.push(`/track?id=${encodeURIComponent(code.trim())}`)
  }

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-10 md:p-14 text-center"
        >
          
          <div className="pointer-events-none absolute -top-16 -end-16 w-56 h-56 rounded-full bg-primary/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -start-16 w-56 h-56 rounded-full bg-primary/6 blur-3xl" />

          <div className="relative z-10 space-y-6">
            
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            >
              <Search className="w-3.5 h-3.5" />
              {t('تتبع شكواك', 'Track Your Complaint')}
            </motion.span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {t('هل رفعت شكوى من قبل؟', 'Already submitted a complaint?')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                'أدخل الرقم المرجعي الذي حصلت عليه عند رفع الشكوى لمتابعة حالتها فوراً — بدون تسجيل دخول.',
                'Enter the reference number you received when submitting your complaint to track its status instantly — no login required.'
              )}
            </p>

            
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={t('مثال: RES-2026-00001', 'e.g. RES-2026-00001')}
                  className="w-full h-12 ps-10 pe-4 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
              >
                {t('تتبع', 'Track')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-xs text-muted-foreground">
              {t(
                'الرقم المرجعي يبدأ بـ RES- ويظهر بعد رفع الشكوى مباشرة',
                'The reference number starts with RES- and appears right after submitting your complaint'
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
