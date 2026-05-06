'use client'

import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  className,
}: ChartCardProps) {
  return (
    <Card className={`border border-gray-200 transition-shadow ${className ?? ''}`}>
      <div className="p-6 hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
        <div>{children}</div>
      </div>
    </Card>
  )
}
