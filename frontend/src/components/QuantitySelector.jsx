import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Minus, Plus, Package } from 'lucide-react'
import { PRICE_PER_PACK } from '../utils/constants'

export default function QuantitySelector({ quantity, setQuantity }) {
  const { t } = useTranslation()
  const total = quantity * PRICE_PER_PACK

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('quantity.title')}
          </h2>
          <p className="text-gray-500">
            {t('quantity.perPack', { price: PRICE_PER_PACK })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-3xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-14 h-14 rounded-2xl bg-white border-2 border-primary-300 flex items-center justify-center text-primary-700 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Minus className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Package className="w-6 h-6 text-primary-600" />
                <span className="text-5xl font-black text-primary-700">{quantity}</span>
              </div>
              <span className="text-gray-500 font-medium">
                {quantity === 1 ? t('quantity.pack') : t('quantity.packs')}
              </span>
            </div>

            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
              className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3].map((q) => (
              <button
                key={q}
                onClick={() => setQuantity(q)}
                className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  quantity === q
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {q} = {q * PRICE_PER_PACK} DA
              </button>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-primary-200">
            <span className="text-gray-500 text-lg">{t('quantity.total')} : </span>
            <span className="text-3xl font-black text-primary-700">{total} DA</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
