import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { BookOpen, FlaskConical, CheckCircle2 } from 'lucide-react'
import { PRODUCTS } from '../utils/constants'

export default function Description() {
  const { t } = useTranslation()

  const books = [
    {
      key: 'book1',
      productId: 'book1',
      icon: FlaskConical,
      gradient: 'from-blue-500 to-blue-700',
      iconColor: '#3b82f6',
    },
    {
      key: 'book2',
      productId: 'book2',
      icon: BookOpen,
      gradient: 'from-orange-500 to-orange-600',
      iconColor: '#f59e0b',
    },
  ]

  return (
    <section id="description" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('description.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            {t('description.subtitle')}
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary-50 border border-primary-100 rounded-2xl px-6 py-4 max-w-3xl mx-auto text-primary-800 font-semibold shadow-sm text-base leading-relaxed"
          >
            💡 {t('description.promo')}
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {books.map((book, idx) => {
            const Icon = book.icon
            const items = t(`description.${book.key}.items`, { returnObjects: true })
            const price = PRODUCTS[book.productId].price

            return (
              <motion.div
                key={book.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${book.gradient} p-6`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {t(`description.${book.key}.title`)}
                      </h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-black text-xl shrink-0">
                      {price} DA
                    </div>
                  </div>
                </div>

                <ul className="p-6 space-y-3">
                  {items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.2 + i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: book.iconColor }} />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="px-6 pb-6">
                  <a
                    href="#products"
                    className="block text-center py-3 rounded-xl font-semibold text-white transition-colors"
                    style={{ backgroundColor: book.iconColor }}
                  >
                    {t('description.orderBook', { price })}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-center text-white shadow-xl"
        >
          <p className="text-lg font-semibold mb-2">{t('products.pack.name')}</p>
          <p className="text-4xl font-black mb-4">{PRODUCTS.pack.price} DA</p>
          <a
            href="#products"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            {t('hero.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
