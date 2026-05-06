'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 50 complaints',
      'Basic analytics',
      'Email support',
      '1 team member',
      'Community access',
    ],
  },
  {
    name: 'Professional',
    price: '$49',
    description: 'For growing teams',
    features: [
      'Unlimited complaints',
      'Advanced analytics',
      'Priority email support',
      'Up to 10 team members',
      'Custom workflows',
      'API access',
      'SLA monitoring',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      '24/7 phone support',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'On-premise option',
      'Advanced security',
    ],
  },
]

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Plans for all team sizes
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Choose the perfect plan to streamline your complaint management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border transition-all duration-300 p-8 ${
                plan.popular
                  ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-xl scale-105'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900'
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full"
                >
                  Most Popular
                </motion.div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== 'Free' && plan.price !== 'Custom' && (
                    <span className="text-neutral-600 dark:text-neutral-400">/month</span>
                  )}
                </div>
              </div>

              <Link href="/dashboard" className="block mb-8">
                <Button 
                  size="lg"
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white'
                  }`}
                >
                  Get Started
                </Button>
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
