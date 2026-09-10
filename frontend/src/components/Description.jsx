import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { BookOpen, FlaskConical, CheckCircle2, GraduationCap, Lightbulb } from 'lucide-react'
import { PRODUCTS, formatPrice } from '../utils/constants'
import { smoothScrollTo } from '../utils/smoothScroll'
import { useProducts } from '../context/ProductsContext'
import { useCms } from '../context/CmsContext'

export default function Description() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'fr'
  const { products, loading, productsList } = useProducts()
  const { getText, getFeatures, cmsLoading } = useCms()

  const icons = [FlaskConical, BookOpen, GraduationCap, Lightbulb]
  const gradients = [
    'from-blue-500 to-blue-700',
    'from-orange-500 to-orange-600',
    'from-green-500 to-green-700',
    'from-purple-500 to-purple-700'
  ]
  const iconColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6']

  // Get all active products from productsList, excluding the pack
  const activeProducts = productsList ? productsList.filter(p => p.is_active && p.id !== 'pack') : []
  
  // Use dynamic products if available, otherwise fall back to hardcoded books
  const books = activeProducts.length > 0 ? activeProducts.map((p, idx) => ({
    key: p.id,
    productId: p.id,
    icon: icons[idx % icons.length],
    gradient: gradients[idx % gradients.length],
    iconColor: iconColors[idx % iconColors.length],
  })) : [
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

  const sectionTitle = getText('description.title', currentLang) || t('description.title')
  const sectionSubtitle = getText('description.subtitle', currentLang) || t('description.subtitle')
  const promoText = getText('description.promo', currentLang) || t('description.promo')

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
            {sectionTitle}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            {sectionSubtitle}
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary-50 border border-primary-100 rounded-2xl px-6 py-4 max-w-3xl mx-auto text-primary-800 font-semibold shadow-sm text-base leading-relaxed"
          >
            💡 {promoText}
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {books.map((book, idx) => {
            const Icon = book.icon
            // Use CMS features if available, otherwise fall back to i18n
            const cmsFeatures = getFeatures(book.productId, currentLang)
            const rawItems = cmsFeatures.length > 0 ? cmsFeatures : t(`description.${book.key}.items`, { returnObjects: true })
            const items = Array.isArray(rawItems) ? rawItems : []
            const price = formatPrice((!loading && products[book.productId]?.price) ? products[book.productId].price : (PRODUCTS[book.productId]?.price ?? 0))

            // Title: use DB translated name from products context, or CMS text, or i18n
            let bookTitle
            const fallbackTitle = t(`description.${book.key}.title`)
            if (!loading && products[book.productId]?.name) {
              const dbProduct = products[book.productId]
              if (currentLang === 'en') bookTitle = dbProduct.name_en || fallbackTitle
              else if (currentLang === 'ar') bookTitle = dbProduct.name_ar || fallbackTitle
              else bookTitle = dbProduct.name || fallbackTitle
            } else {
              bookTitle = fallbackTitle
            }

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
                        {bookTitle}
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
                    onClick={(e) => smoothScrollTo(e, '#products')}
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
          <p className="text-lg font-semibold mb-2">
            {(() => {
              const p = products?.pack
              if (!loading && p?.name) {
                if (currentLang === 'en') return p.name_en || t('products.pack.name')
                if (currentLang === 'ar') return p.name_ar || t('products.pack.name')
                return p.name
              }
              return t('products.pack.name')
            })()}
          </p>
          <p className="text-4xl font-black mb-4">
            {formatPrice((!loading && products?.pack?.price) ? products.pack.price : PRODUCTS.pack.price)} DA
          </p>
          <a
            href="#products"
            onClick={(e) => smoothScrollTo(e, '#products')}
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
          >
            {t('hero.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

