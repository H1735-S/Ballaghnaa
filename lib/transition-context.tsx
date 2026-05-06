'use client'

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface TransitionContextType {
  trigger: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType>({ trigger: () => {} })

export function useTransition() {
  return useContext(TransitionContext)
}

export function TransitionProvider({ children, onShow }: { children: React.ReactNode; onShow: () => void }) {
  const router = useRouter()

  const trigger = useCallback((href: string) => {
    onShow()
    setTimeout(() => router.push(href), 500)
  }, [onShow, router])

  return (
    <TransitionContext.Provider value={{ trigger }}>
      {children}
    </TransitionContext.Provider>
  )
}
