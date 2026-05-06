'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/language-context'


function SaudiFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} xmlns="http://www.w3.org/2000/svg">
      
      <rect width="20" height="14" fill="#006C35" />
      
      
      <rect x="3" y="6.8" width="14" height="0.7" rx="0.3" fill="white" />
      
      <rect x="14.5" y="5.8" width="0.7" height="2.7" rx="0.3" fill="white" />
      
      <rect x="9.65" y="3.5" width="0.7" height="3" rx="0.3" fill="white" />
      
      <path d="M10 3.5 Q8 2.5 7 3" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      <path d="M10 3.5 Q9 2 8.5 1.8" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      <path d="M10 3.5 Q10 1.8 10 1.5" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      <path d="M10 3.5 Q11 2 11.5 1.8" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      <path d="M10 3.5 Q12 2.5 13 3" stroke="white" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function USFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} xmlns="http://www.w3.org/2000/svg">
      
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
        <rect key={i} x="0" y={i * (14/13)} width="20" height={14/13}
          fill={i % 2 === 0 ? '#B22234' : '#FFFFFF'} />
      ))}
      
      <rect x="0" y="0" width="8" height="7.7" fill="#3C3B6E" />
      
      {[0,1,2,3,4].map(row =>
        [0,1,2,3,4,5].map(col => (
          <circle key={`${row}-${col}`}
            cx={0.7 + col * 1.2 + (row % 2 === 0 ? 0 : 0.6)}
            cy={0.8 + row * 1.4}
            r="0.35" fill="white" />
        ))
      )}
    </svg>
  )
}


const LANGS = [
  { code: 'ar' as const, label: 'العربية', short: 'AR', Flag: SaudiFlag },
  { code: 'en' as const, label: 'English', short: 'EN', Flag: USFlag   },
]

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)

  const current = LANGS.find(l => l.code === lang) ?? LANGS[0]

  return (
    <div className={cn('relative', className)}>

      
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className={cn(
          'flex h-9 items-center gap-2 rounded-xl border px-2.5 text-xs font-medium',
          'border-border bg-background text-foreground',
          'hover:bg-accent transition-colors duration-150',
          open && 'bg-accent'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={lang}
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1,   rotate: 0   }}
            exit={{   opacity: 0, scale: 0.7,  rotate: 10  }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="flex items-center gap-1.5"
          >
            <span className="overflow-hidden rounded-sm shadow-sm" style={{ width: 20, height: 14 }}>
              <current.Flag className="w-full h-full" />
            </span>
            <span>{current.short}</span>
          </motion.span>
        </AnimatePresence>

        
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className="text-muted-foreground"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.95,  y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                'absolute end-0 top-full z-50 mt-2 w-40',
                'rounded-xl border border-border bg-popover shadow-lg',
                'overflow-hidden py-1'
              )}
            >
              {LANGS.map((l, i) => {
                const active = lang === l.code
                return (
                  <motion.button
                    key={l.code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { setLang(l.code); setOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    
                    <span className="overflow-hidden rounded-sm shadow-sm shrink-0" style={{ width: 22, height: 15 }}>
                      <l.Flag className="w-full h-full" />
                    </span>

                    <span className="flex-1 text-start">{l.label}</span>

                    
                    {active && (
                      <motion.span
                        layoutId="lang-active-dot"
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
