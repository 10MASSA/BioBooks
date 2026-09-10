import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Phone, Globe, Menu, X, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { smoothScrollTo } from '../utils/smoothScroll'

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'fr', label: 'Français' },
]

export default function Header() {
  const { i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentLang = i18n.language || 'fr'

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const changeLang = (code) => {
    i18n.changeLanguage(code)
    setMobileOpen(false)
  }

  const navLinks = [
    { href: '#order', label: currentLang === 'ar' ? 'اطلب الآن' : 'Commander' },
    { href: '#description', label: currentLang === 'ar' ? 'محتوى الكتب' : 'Contenu des livres' },
  ]

  return (
    <div className="w-full z-50 sticky top-0">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 text-center font-semibold flex items-center justify-center gap-4 sm:gap-8 flex-wrap shadow-inner">
        <span>🚚 {currentLang === 'ar' ? 'التوصيل متاح لجميع الـ 69 ولاية' : 'Livraison rapide 69 Wilayas'}</span>
        <span className="hidden sm:inline opacity-30">•</span>
        <span>💳 {currentLang === 'ar' ? 'الدفع عند الاستلام فقط (COD)' : 'Paiement à la livraison'}</span>
        <span className="hidden md:inline opacity-30">•</span>
        <span className="hidden md:inline">⚡ {currentLang === 'ar' ? 'طبعة أصلية وجودة عالية بالألوان' : 'Édition originale illustrée en couleur'}</span>
      </div>

      {/* Main Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary-600/25 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight block">
                  Biology<span className="text-primary-600">Books</span>
                </span>
                <span className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  {currentLang === 'ar' ? 'سلسلة عكوف — تحاليل طبية' : 'Série AKOU — Biologie Médicale'}
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => smoothScrollTo(e, link.href)}
                  className="text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right actions: Lang & Phone & CTA */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/70">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      i18n.language === lang.code
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Order shortcut button */}
              <a
                href="#order"
                onClick={(e) => smoothScrollTo(e, '#order')}
                className="hidden sm:inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-primary-600/20 transition-all hover:scale-105"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{currentLang === 'ar' ? 'اطلب الآن' : 'Commander'}</span>
              </a>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-xl px-4 py-4"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      smoothScrollTo(e, link.href)
                      setMobileOpen(false)
                    }}
                    className="px-4 py-3 text-slate-800 font-bold rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#order"
                  onClick={(e) => {
                    smoothScrollTo(e, '#order')
                    setMobileOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 rounded-xl shadow-md text-sm mt-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {currentLang === 'ar' ? 'اطلب الآن' : 'Commander'}
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}
