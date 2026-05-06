'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/language-context'

const posts = [
  {
    slug: 'complaint-management-best-practices',
    titleAr: 'أفضل ممارسات إدارة الشكاوى في 2025',
    titleEn: 'Complaint Management Best Practices in 2025',
    excerptAr: 'تعرف على أحدث الأساليب والاستراتيجيات لإدارة شكاوى العملاء بكفاءة وفعالية.',
    excerptEn: 'Discover the latest methods and strategies for managing customer complaints efficiently.',
    date: '2025-03-15',
    readAr: '5 دقائق',
    readEn: '5 min read',
    categoryAr: 'إدارة الشكاوى',
    categoryEn: 'Complaint Management',
  },
  {
    slug: 'customer-experience-tips',
    titleAr: 'كيف تحول الشكوى إلى فرصة لتحسين تجربة العميل',
    titleEn: 'How to Turn a Complaint into a Customer Experience Opportunity',
    excerptAr: 'الشكاوى ليست مشكلة — هي بيانات قيّمة تساعدك على تحسين منتجك وخدمتك.',
    excerptEn: 'Complaints are not problems — they are valuable data that help you improve your product and service.',
    date: '2025-02-28',
    readAr: '7 دقائق',
    readEn: '7 min read',
    categoryAr: 'تجربة العملاء',
    categoryEn: 'Customer Experience',
  },
  {
    slug: 'sla-monitoring-guide',
    titleAr: 'دليل مراقبة مستويات الخدمة (SLA) للمبتدئين',
    titleEn: 'Beginner\'s Guide to SLA Monitoring',
    excerptAr: 'ما هو الـ SLA؟ وكيف تضع أهدافاً واقعية وتراقب أداء فريقك بشكل فعّال؟',
    excerptEn: 'What is SLA? How to set realistic goals and monitor your team\'s performance effectively.',
    date: '2025-02-10',
    readAr: '6 دقائق',
    readEn: '6 min read',
    categoryAr: 'عمليات',
    categoryEn: 'Operations',
  },
  {
    slug: 'team-collaboration-complaints',
    titleAr: 'تعاون الفريق في حل الشكاوى: دليل عملي',
    titleEn: 'Team Collaboration in Complaint Resolution: A Practical Guide',
    excerptAr: 'كيف تبني ثقافة فريق تتعاون بفعالية لحل الشكاوى وتحقيق رضا العملاء.',
    excerptEn: 'How to build a team culture that collaborates effectively to resolve complaints.',
    date: '2025-01-20',
    readAr: '8 دقائق',
    readEn: '8 min read',
    categoryAr: 'فريق العمل',
    categoryEn: 'Team',
  },
  {
    slug: 'analytics-complaint-trends',
    titleAr: 'استخدام التحليلات لفهم أنماط الشكاوى',
    titleEn: 'Using Analytics to Understand Complaint Patterns',
    excerptAr: 'كيف تستخدم البيانات والتحليلات لاكتشاف الأنماط المتكررة وحلها قبل أن تتفاقم.',
    excerptEn: 'How to use data and analytics to discover recurring patterns and resolve them before they escalate.',
    date: '2025-01-05',
    readAr: '6 دقائق',
    readEn: '6 min read',
    categoryAr: 'تحليلات',
    categoryEn: 'Analytics',
  },
  {
    slug: 'escalation-strategies',
    titleAr: 'استراتيجيات التصعيد الفعّال للشكاوى الحرجة',
    titleEn: 'Effective Escalation Strategies for Critical Complaints',
    excerptAr: 'متى وكيف تصعّد الشكوى؟ دليل شامل لضمان عدم سقوط أي شكوى حرجة بين الشقوق.',
    excerptEn: 'When and how to escalate a complaint? A comprehensive guide to ensure no critical complaint falls through the cracks.',
    date: '2024-12-18',
    readAr: '5 دقائق',
    readEn: '5 min read',
    categoryAr: 'إدارة الشكاوى',
    categoryEn: 'Complaint Management',
  },
]

export function BlogContent() {
  const { t, lang } = useLang()

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('المدونة', 'Blog')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('مقالات ونصائح', 'Articles & Tips')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('كل ما تحتاج معرفته عن إدارة الشكاوى وتجربة العملاء', 'Everything you need to know about complaint management and customer experience')}
          </p>
        </motion.div>

        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article key={post.slug}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-300 group flex flex-col">

              
              <div className="h-44 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{(lang === 'ar' ? post.titleAr : post.titleEn)[0]}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3 w-fit">
                  {lang === 'ar' ? post.categoryAr : post.categoryEn}
                </span>

                <h2 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                  {lang === 'ar' ? post.titleAr : post.titleEn}
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {lang === 'ar' ? post.excerptAr : post.excerptEn}
                </p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{lang === 'ar' ? post.readAr : post.readEn}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
                    {t('اقرأ المزيد', 'Read more')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  )
}
