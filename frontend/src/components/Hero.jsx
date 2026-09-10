import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Gift, ArrowDown, Sparkles } from 'lucide-react'
import { PRODUCTS, formatPrice } from '../utils/constants'
import { useTilt } from '../utils/useTilt'
import { smoothScrollTo } from '../utils/smoothScroll'
import { useProducts } from '../context/ProductsContext'
import { useCms } from '../context/CmsContext'

export default function Hero() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'fr'
  const { products, loading, productsList } = useProducts()
  const { getText, getGallery } = useCms()
  const [stock, setStock] = useState(47)
  const { tiltStyle, handleMouseMove, handleMouseLeave } = useTilt(10, 1.03)

  // Get pack product specifically
  const packProduct = productsList ? productsList.find(p => p.id === 'pack') : (products?.pack || null)
  const heroGalleryImages = getGallery('hero')
  const packImage = heroGalleryImages.length > 0
    ? heroGalleryImages[0].image_url
    : ((!loading && packProduct?.image) ? packProduct.image : '/images/books-cover-real.jpg')

  useEffect(() => {
    const interval = setInterval(() => {
      setStock((prev) => (prev > 12 ? prev - 1 : prev))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const badgeText = getText('hero.badge', currentLang) || t('hero.badge')
  const bonusTitle = getText('hero.bonus', currentLang) || t('hero.bonus')
  const bonusDesc = getText('hero.bonusDescription', currentLang) || t('hero.bonusDescription')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 start-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-400/30 text-accent-300 px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit"
            >
              <Gift className="w-4 h-4" />
              {badgeText}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              {t('hero.title', { price: formatPrice((!loading && packProduct?.price) ? packProduct.price : PRODUCTS.pack.price) })}
            </h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-5xl sm:text-6xl font-black text-accent-400 animate-countdown">
                {((!loading && packProduct?.price) ? packProduct.price : PRODUCTS.pack.price).toString().replace(/\.00$/, '')}
              </span>
              <span className="text-2xl text-white/80 font-semibold">DA</span>
              {((!loading && packProduct?.original_price) || PRODUCTS.pack.originalPrice) && (
                <span className="text-white/50 line-through text-xl">
                  {((!loading && packProduct?.original_price) ? packProduct.original_price : PRODUCTS.pack.originalPrice).toString().replace(/\.00$/, '')} DA
                </span>
              )}
            </div>

            {/* Pack Image - Mobile Only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:hidden my-6 relative flex justify-center group"
            >
              <div className="relative max-w-sm w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-4 backdrop-blur-sm shadow-2xl flex items-center justify-center">
                <img
                  src={packImage}
                  alt="BiologyBooks Pack"
                  className="max-h-[220px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-white/10 border border-white/20 p-6 mb-8"
            >
              <p className="text-accent-200 font-semibold mb-2">{bonusTitle}</p>
              <p className="text-white/70">{bonusDesc}</p>
            </motion.div>

            <p className="text-white/70 text-sm mb-6">{t('hero.orIndividual')}</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-red-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              {t('hero.stock', { count: stock })}
            </motion.div>

            <motion.a
              href="#products"
              onClick={(e) => smoothScrollTo(e, '#products')}
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl transition-all w-fit"
            >
              {t('hero.cta')}
              <ArrowDown className="w-5 h-5" />
            </motion.a>
          </div>

          {/* Right Column: Desktop Pack Mockup */}
          <div className="lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 55, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative flex justify-center group"
            >
              <div
                style={tiltStyle}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-6 backdrop-blur-sm shadow-2xl flex items-center justify-center cursor-pointer select-none"
              >
                <img
                  src={packImage}
                  alt="BiologyBooks Pack"
                  className="max-h-[380px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </div>
    </section>
  )
}
