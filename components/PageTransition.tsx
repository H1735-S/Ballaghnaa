'use client'

import { useEffect, useState, useRef, createContext, useContext, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Ctx {
  trigger: (href: string) => void
}

const TransitionCtx = createContext<Ctx>({ trigger: () => {} })
export const usePageTransition = () => useContext(TransitionCtx)

function Overlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.55 }}
        >
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ scaleY: 1, originY: '0%' }}
            animate={{ scaleY: 0, originY: '100%' }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-4"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Image
                src="/logo-new.png"
                alt="بلّغنا"
                width={72}
                height={72}
                className="object-contain logo-img"
                priority
              />
            </motion.div>

            <motion.span
              className="text-2xl font-black tracking-tight text-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              بلّغنا
            </motion.span>

            <motion.div className="w-36 h-0.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PageTransition({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [show, setShow] = useState(false)
  const prevPathRef = useRef(pathname)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showFor900 = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setShow(true)
    timerRef.current = setTimeout(() => setShow(false), 900)
  }, [])

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname
      showFor900()
    }
  }, [pathname, showFor900])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const trigger = useCallback(
    (href: string) => {
      showFor900()
      setTimeout(() => router.push(href), 450)
    },
    [router, showFor900]
  )

  return (
    <TransitionCtx.Provider value={{ trigger }}>
      <Overlay show={show} />
      {children}
    </TransitionCtx.Provider>
  )
}