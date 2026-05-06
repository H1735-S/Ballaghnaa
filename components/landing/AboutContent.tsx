'use client'

import { motion } from 'framer-motion'
import { Target, Users, Zap } from 'lucide-react'
import { useLang } from '@/lib/language-context'

export function AboutContent() {
  const { t } = useLang()

  const values = [
    { icon: Target, title: t('مهمتنا', 'Our Mission'),   desc: t('تمكين الفرق من حل كل شكوى بكفاءة وشفافية وسرعة.', 'Empowering teams to resolve every complaint with efficiency, transparency, and speed.') },
    { icon: Users,  title: t('فريقنا', 'Our Team'),     desc: t('فريق متنوع من المطورين ومصممي UX وخبراء دعم العملاء.', 'A diverse team of developers, UX designers, and customer support experts.') },
    { icon: Zap,    title: t('رؤيتنا', 'Our Vision'),   desc: t('عالم لا تضيع فيه أي شكوى دون حل.', 'A world where no complaint goes unresolved.') },
  ]

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('من نحن', 'About us')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('نبني مستقبل إدارة الشكاوى', 'Building the future of complaint management')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t(
              'بلّغنا وُلدت من إيمان بسيط: كل شكوى تستحق أن تُسمع وتُحل. نحن نبني الأدوات التي تجعل ذلك ممكناً.',
              'Ballaghna was born from a simple belief: every complaint deserves to be heard and resolved. We build the tools that make that possible.'
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
              <p className="text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center">
          <p className="text-2xl font-semibold text-foreground leading-relaxed">
            {t(
              '"نؤمن أن كل شكوى هي فرصة لتحسين تجربة العميل وبناء ثقة أعمق."',
              '"We believe every complaint is an opportunity to improve the customer experience and build deeper trust."'
            )}
          </p>
          <p className="mt-4 text-muted-foreground">{t('— فريق بلّغنا', '— The Ballaghna Team')}</p>
        </motion.div>
      </div>
    </main>
  )
}
