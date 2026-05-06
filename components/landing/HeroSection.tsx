'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLang } from '@/lib/language-context'

const VIDEO_URL = 'https://www.youtube.com/embed/Sr_gyfJK2N0?autoplay=1'

export function HeroSection() {
  const { t } = useLang()
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-background -z-10" />
      <div className="absolute inset-0 opacity-[0.04] -z-10"
        style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-center lg:text-start">

            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              {t('منصة إدارة الشكاوى', 'Complaint Management Platform')}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight">
              {t('إدارة الشكاوى،', 'Complaints management,')}
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('بالطريقة الصحيحة', 'done right')}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t(
                'بلّغنا تساعد فريقك على تجميع وترتيب وحل كل شكوى بشكل أسرع مع تحليلات فورية وسير عمل ذكي.',
                'Ballaghna helps your team centralize, prioritize, and resolve every complaint faster with real-time analytics and smart workflows.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-base px-8">
                  {t('ابدأ الآن', 'Get started')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <button onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 px-8 h-11 text-base font-semibold border-2 border-border bg-card hover:bg-accent text-foreground rounded-lg transition-colors">
                <Play className="h-5 w-5 text-primary" />
                {t('شاهد العرض', 'Watch demo')}
              </button>
            </div>

            <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              {[t('لا يلزم بطاقة ائتمان', 'No credit card required'), t('إعداد في دقائق', 'Setup in minutes')].map(txt => (
                <div key={txt} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {txt}
                </div>
              ))}
            </div>
          </motion.div>

          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block">
            <div className="relative">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -end-4 bg-card border border-border rounded-2xl shadow-xl p-4 w-60 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('تم حل الشكوى', 'Complaint resolved')}</p>
                    <p className="text-sm font-semibold text-foreground">CMP-1042 {t('مغلقة', 'Closed')}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -start-4 bg-card border border-border rounded-2xl shadow-xl p-4 w-60 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('تنبيه جديد', 'New alert')}</p>
                    <p className="text-sm font-semibold text-foreground">{t('أولوية حرجة', 'Critical priority')}</p>
                  </div>
                </div>
              </motion.div>

              <div className="bg-card rounded-3xl shadow-xl p-7 border border-border">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">{t('لوحة التحكم', 'Dashboard')}</h3>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-2.5 bg-border rounded w-3/4 mb-1.5" />
                          <div className="h-2 bg-border/60 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{t('متوسط الحل', 'Avg Resolution')}</span><span>72%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      
      <AnimatePresence>
        {videoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setVideoOpen(false)}>
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{t('شاهد العرض', 'Watch demo')}</span>
                </div>
                <button onClick={() => setVideoOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe src={VIDEO_URL} className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title="بلّغنا Demo" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
