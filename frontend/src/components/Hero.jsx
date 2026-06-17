import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Gift, ArrowDown, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../utils/constants'

export default function Hero() {
  const { t } = useTranslation()
  const [stock, setStock] = useState(47)

  useEffect(() => {
    const interval = setInterval(() => {
      setStock((prev) => (prev > 12 ? prev - 1 : prev))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 start-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-400/30 text-accent-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Gift className="w-4 h-4" />
              {t('hero.badge')}
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              {t('hero.title')}
            </h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-5xl sm:text-6xl font-black text-accent-400 animate-countdown">
                {PRODUCTS.pack.price}
              </span>
              <span className="text-2xl text-white/80 font-semibold">DA</span>
              <span className="text-white/50 line-through text-xl">{PRODUCTS.pack.originalPrice} DA</span>
            </div>

            <p className="text-white/70 text-sm mb-6">{t('hero.orIndividual')}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20">
                {t('products.book1.name')} — {PRODUCTS.book1.price} DA
              </span>
              <span className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20">
                {t('products.book2.name')} — {PRODUCTS.book2.price} DA
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-red-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              {t('hero.stock', { count: stock })}
            </motion.div>

            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl animate-pulse-glow transition-all hover:scale-105"
            >
              {t('hero.cta')}
              <ArrowDown className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent-400/30 to-primary-400/30 rounded-3xl blur-2xl" />
              <img
                src="/images/books-cover.png"
                alt="BioBooks"
                className="relative w-full max-w-lg mx-auto drop-shadow-2xl rounded-2xl"
              />
            </div>
          </motion.div>
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
