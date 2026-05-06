'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Book, Code, Video, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const docs = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics and set up your first complaint management system in minutes',
  },
  {
    icon: Code,
    title: 'API Documentation',
    description: 'Integrate Ballaghna with your existing tools using our comprehensive APIs',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides to master all features of Ballaghna',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Find answers to common questions and troubleshooting tips',
  },
]

export function DocsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="docs" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            Documentation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Resources and support
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Everything you need to succeed with Ballaghna
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {docs.map((doc, index) => (
            <motion.div
              key={doc.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <doc.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {doc.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="#">
              <Button variant="outline" size="lg">
                Browse all docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#">
              <Button size="lg">
                Contact support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
