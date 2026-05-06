'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/lib/language-context'

export function StatsSection() {
  const { t } = useLang()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { value: '99.9%', label: t('وقت التشغيل',        'Uptime SLA')          },
    { value: '2.4x',  label: t('أسرع في الحل',       'Faster resolution')   },
    { value: '50k+',  label: t('شكوى تمت إدارتها',  'Complaints managed')  },
    { value: '4.9/5', label: t('تقييم العملاء',      'Customer rating')     },
  ]

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
