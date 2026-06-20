import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  GraduationCap, Lightbulb, Palette, Syringe,
  Beaker, BookMarked, TrendingUp,
} from 'lucide-react'

const ICONS = [
  GraduationCap, Lightbulb, Palette, Syringe,
  Beaker, BookMarked, TrendingUp,
]

export default function Advantages() {
  const { t } = useTranslation()
  const items = t('advantages.items', { returnObjects: true })

  return (
    <section className="py-20 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('advantages.title')}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 cursor-pointer transition-all duration-300"
              >
                <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent-400" />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-400 font-bold text-lg">✓</span>
                  <span className="font-medium">{item}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
