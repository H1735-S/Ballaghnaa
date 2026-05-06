'use client'

import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { AboutContent } from '@/components/landing/AboutContent'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <AboutContent />
    </div>
  )
}
