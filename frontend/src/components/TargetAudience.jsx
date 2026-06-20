import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Microscope, Pill, Stethoscope, HeartPulse, Dna,
  Atom, Shield, Bug, FlaskConical, Leaf,
} from 'lucide-react'

const ICONS = [
  Microscope, Atom, Pill, Stethoscope, HeartPulse,
  FlaskConical, Atom, Shield, Bug, Dna,
]

const COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-purple-100 text-purple-600',
  'bg-red-100 text-red-600',
  'bg-pink-100 text-pink-600',
  'bg-yellow-100 text-yellow-600',
  'bg-indigo-100 text-indigo-600',
  'bg-teal-100 text-teal-600',
  'bg-orange-100 text-orange-600',
  'bg-emerald-100 text-emerald-600',
]

export default function TargetAudience() {
  const { t } = useTranslation()
  const fields = t('audience.fields', { returnObjects: true })

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('audience.title')}
          </h2>
          <p className="text-gray-600 text-lg">{t('audience.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {fields.map((field, i) => {
            const Icon = ICONS[i] || Leaf
            return (
              <motion.div
                key={field}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-md border border-gray-100 cursor-pointer select-none transition-all duration-300 hover:shadow-xl hover:border-primary-100"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${COLORS[i]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800 text-center">{field}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
