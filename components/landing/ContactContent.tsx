'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { useLang } from '@/lib/language-context'
import { Button } from '@/components/ui/button'

export function ContactContent() {
  const { t } = useLang()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputClass = "w-full h-11 px-4 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"

  const info = [
    { icon: Mail,    label: t('البريد الإلكتروني', 'Email'),   value: 'support@Ballaghna.com'              },
    { icon: Phone,   label: t('الهاتف',            'Phone'),   value: '+20 11 51680022'                 },
    { icon: MapPin,  label: t('الموقع',            'Location'),value: t('أسيوط، مصر', 'Assiut, Egypt') },
  ]

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('تواصل معنا', 'Contact us')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('نحن هنا للمساعدة', "We're here to help")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('تواصل معنا وسنرد عليك في أقرب وقت ممكن.', "Reach out and we'll get back to you as soon as possible.")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="space-y-6">
            {info.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-card border border-border rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8 bg-card border border-border rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t('تم الإرسال!', 'Message sent!')}</h3>
                <p className="text-muted-foreground">{t('سنتواصل معك قريباً.', "We'll be in touch soon.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t('الاسم', 'Name')}</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder={t('أكتب اسمك', 'Enter Your Name')} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t('البريد الإلكتروني', 'Email')}</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="example@email.com" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{t('الرسالة', 'Message')}</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none" />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  {t('إرسال الرسالة', 'Send message')}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
