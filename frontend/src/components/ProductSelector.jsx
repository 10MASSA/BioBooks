import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Minus, Plus, BookOpen, FlaskConical, Gift, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../utils/constants'

const PRODUCT_CONFIG = [
  { id: 'book1', icon: FlaskConical, color: 'border-blue-400 bg-blue-50', badge: 'bg-blue-600' },
  { id: 'book2', icon: BookOpen, color: 'border-orange-400 bg-orange-50', badge: 'bg-orange-600' },
  { id: 'pack', icon: Gift, color: 'border-primary-400 bg-primary-50', badge: 'bg-primary-600', popular: true },
]

export default function ProductSelector({ productId, setProductId, quantity, setQuantity }) {
  const { t } = useTranslation()
  const unitPrice = PRODUCTS[productId].price
  const total = unitPrice * quantity

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h2>
          <p className="text-gray-600">{t('products.subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {PRODUCT_CONFIG.map((p, idx) => {
            const Icon = p.icon
            const product = PRODUCTS[p.id]
            const selected = productId === p.id

            return (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setProductId(p.id)}
                className={`relative text-start p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selected
                    ? `${p.color} border-current shadow-lg scale-[1.02] ring-2 ring-primary-500/30`
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-3 h-3" />
                    {t('products.bestOffer')}
                  </span>
                )}
                <div className={`w-10 h-10 ${p.badge} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">
                  {t(`products.${p.id}.name`)}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {t(`products.${p.id}.short`)}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-primary-700">{product.price}</span>
                  <span className="text-sm font-semibold text-gray-500">DA</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">{product.originalPrice} DA</span>
                  )}
                </div>
                {selected && (
                  <div className="absolute top-3 end-3 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-3xl p-6 sm:p-8 shadow-lg"
        >
          <p className="text-center text-sm font-semibold text-gray-600 mb-4">
            {t(`products.${productId}.name`)} — {unitPrice} DA
          </p>

          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 rounded-2xl bg-white border-2 border-primary-300 flex items-center justify-center text-primary-700 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-4xl font-black text-primary-700">{quantity}</span>
              <span className="text-gray-500 font-medium block text-sm mt-1">
                {quantity === 1 ? t('products.unit') : t('products.units')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
              className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center pt-4 border-t border-primary-200">
            <span className="text-gray-500">{t('products.subtotal')} : </span>
            <span className="text-3xl font-black text-primary-700">{total} DA</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
