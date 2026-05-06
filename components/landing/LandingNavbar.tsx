'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useLang } from '@/lib/language-context'
import { useSession } from 'next-auth/react'
import { usePageTransition } from '@/components/PageTransition'

export function LandingNavbar() {
  const { t, isRtl } = useLang()
  const { trigger } = usePageTransition()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  const role = (session?.user as { role?: string })?.role ?? 'citizen'
  const dashboardMap: Record<string, string> = {
    admin: '/dashboard', agent: '/agent', citizen: '/citizen',
  }
  const dashboardHref = dashboardMap[role] ?? '/citizen'

  const navItems = [
    { label: t('المميزات',   'Features'),    href: '/#features'    },
    { label: t('كيف يعمل',  'How it works'), href: '/#how-it-works' },
    { label: t('تتبع شكوى', 'Track'),        href: '/track'        },
    { label: t('المدونة',   'Blog'),         href: '/blog'         },
    { label: t('الأسئلة الشائعة', 'FAQ'),   href: '/faq'          },
    { label: t('من نحن',    'About'),        href: '/about'        },
    { label: t('تواصل معنا','Contact'),      href: '/contact'      },
  ]

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        
        <button onClick={() => trigger('/')} className="flex items-center gap-2.5 shrink-0 cursor-pointer bg-transparent border-0 p-0">
          <Image src="/logo-new.png" alt="Ballaghna" width={48} height={48} quality={100} className="object-contain logo-img" priority />
          <span className="text-xl font-black tracking-tight text-foreground">
            {t('بلّغنا', 'Ballaghna')}
          </span>
        </button>

        
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              <motion.span
                className="absolute -bottom-1 start-0 h-0.5 rounded-full bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.25 }}
              />
            </Link>
          ))}
        </nav>

        
        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-1.5 ms-1">
            <div className="h-5 w-px bg-border mx-0.5" />
            {session ? (
              <>
                <span className="text-xs text-muted-foreground font-medium px-2">{session.user?.name}</span>
                <Link href={dashboardHref}>
                  <Button size="sm" className="gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {t('لوحة التحكم', 'Dashboard')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('دخول', 'Sign in')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t('ابدأ', 'Get started')}</Button>
                </Link>
              </>
            )}
          </div>
          
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border hover:bg-accent transition-colors ms-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border mt-1">
                {session ? (
                  <Link href={dashboardHref} className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full gap-1.5">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      {t('لوحة التحكم', 'Dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">{t('تسجيل الدخول', 'Sign in')}</Button>
                    </Link>
                    <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full">{t('ابدأ الآن', 'Get started')}</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
