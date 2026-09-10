import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, CheckCircle2, ShieldCheck, Truck, Banknote,
  Minus, Plus, Send, Loader2, Home, Briefcase,
  Sparkles, ChevronLeft, ChevronRight, BookOpen,
  ShoppingBag, AlertCircle, Maximize2, X, ZoomIn
} from 'lucide-react'
import { PRODUCTS, formatPrice, API_URL } from '../utils/constants'
import { useProducts } from '../context/ProductsContext'
import { useCms } from '../context/CmsContext'
import { WILAYAS_DATA } from '../utils/wilayas_data'

// Clean 4 Key Hero Thumbnails
const HERO_THUMBNAILS = [
  { id: 't-pack', url: '/images/books-cover-real.jpg', label: 'Pack Complet', category: 'pack' },
  { id: 't-b1', url: '/images/book1-cover-real.jpg', label: 'Matériels & Outils', category: 'book1' },
  { id: 't-b2', url: '/images/book2-cover-real.jpg', label: 'Techniques d’Analyses', category: 'book2' },
  { id: 't-pages', url: '/images/book2-page1-real.jpg', label: 'Pages Intérieures', category: 'interior' },
]

// Full Preview Pages for the "Look Inside / Feuilleter" Modal
const BOOK_PAGES_PREVIEW = [
  { id: 1, url: '/images/books-cover-real.jpg', title_fr: 'Pack Complet — Les 2 Livres', title_ar: 'عرض الباك الكامل — الكتابين معاً' },
  { id: 2, url: '/images/book1-cover-real.jpg', title_fr: 'Livre 1 — Matériels & Outils de Laboratoire', title_ar: 'الكتاب 1 — عتاد وأدوات المخبر' },
  { id: 3, url: '/images/book1-page1-real.jpg', title_fr: 'Livre 1 — Équipements et Automates FNS', title_ar: 'الكتاب 1 — أجهزة وأوتومات التحاليل' },
  { id: 4, url: '/images/book1-page2-real.jpg', title_fr: 'Livre 1 — Micro-pipettes et Cellules de Comptage', title_ar: 'الكتاب 1 — الماصات الدقيقة وخلايا العد' },
  { id: 5, url: '/images/book-sommaire1.jpg', title_fr: 'Livre 1 — Sommaire et Chapitres', title_ar: 'الكتاب 1 — الفهرس وأقسام الكتاب' },
  { id: 6, url: '/images/book2-cover-real.jpg', title_fr: 'Livre 2 — Guide des Techniques d’Analyses', title_ar: 'الكتاب 2 — دليل تقنيات التحاليل الطبية' },
  { id: 7, url: '/images/book2-page1-real.jpg', title_fr: 'Livre 2 — Prélèvements Sanguins et Protocoles', title_ar: 'الكتاب 2 — تقنيات سحب الدم وأخذ العينات' },
  { id: 8, url: '/images/book2-page2-real.jpg', title_fr: 'Livre 2 — Dosages Biochimiques & Formules', title_ar: 'الكتاب 2 — التحاليل البيوكيميائية والمعادلات' },
  { id: 9, url: '/images/book2-sommaire1-real.jpg', title_fr: 'Livre 2 — Sommaire des 110 Techniques', title_ar: 'الكتاب 2 — فهرس أكثر من 110 تقنية' },
]

export default function Hero() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'fr'
  const isRtl = currentLang === 'ar'
  const { products, productsList, loading, cart, updateCartQuantity } = useProducts()
  const { cms, getText } = useCms()

  // Main Hero image & thumbnails
  const [thumbnails, setThumbnails] = useState(HERO_THUMBNAILS)
  const [activeThumbIndex, setActiveThumbIndex] = useState(0)

  // "Look Inside" / "Feuilleter" Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPageIndex, setModalPageIndex] = useState(0)

  // Order submission state
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [deliveryType, setDeliveryType] = useState('home')
  const [cartError, setCartError] = useState('')

  // Active products list from DB or fallback
  const displayProducts = useMemo(() => {
    if (productsList && productsList.length > 0) {
      return productsList.filter(p => p.is_active !== 0 && p.is_active !== false)
    }
    return [
      { id: 'pack', name: 'Pack — Les 2 livres ensemble', name_ar: 'عرض الباك: الكتابين معاً', price: 1500, original_price: 1700 },
      { id: 'book1', name: 'Matériels & Outils de Laboratoire (T1)', name_ar: 'عتاد وأدوات المخبر', price: 500, original_price: 700 },
      { id: 'book2', name: "Techniques d'Analyses Médicales (T2)", name_ar: 'تقنيات التحاليل الطبية', price: 1200, original_price: 1500 },
    ]
  }, [productsList])

  // Sync custom product images from Admin if uploaded
  useEffect(() => {
    let items = [...HERO_THUMBNAILS]
    if (!loading && products) {
      if (products.pack?.image) {
        items = items.map(it => it.category === 'pack' ? { ...it, url: products.pack.image } : it)
      }
      if (products.book1?.image) {
        items = items.map(it => it.category === 'book1' ? { ...it, url: products.book1.image } : it)
      }
      if (products.book2?.image) {
        items = items.map(it => it.category === 'book2' ? { ...it, url: products.book2.image } : it)
      }
    }
    setThumbnails(items)
  }, [products, loading])

  const activeMedia = thumbnails[activeThumbIndex] || thumbnails[0]

  // Modal navigation
  const nextModalPage = useCallback(() => {
    setModalPageIndex((prev) => (prev + 1) % BOOK_PAGES_PREVIEW.length)
  }, [])

  const prevModalPage = useCallback(() => {
    setModalPageIndex((prev) => (prev - 1 + BOOK_PAGES_PREVIEW.length) % BOOK_PAGES_PREVIEW.length)
  }, [])

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return
      if (e.key === 'Escape') setIsModalOpen(false)
      if (e.key === 'ArrowRight') isRtl ? prevModalPage() : nextModalPage()
      if (e.key === 'ArrowLeft') isRtl ? nextModalPage() : prevModalPage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, isRtl, nextModalPage, prevModalPage])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm()

  const selectedWilayaCode = watch('wilaya')
  const selectedWilayaObj = WILAYAS_DATA.find((w) => w.code === selectedWilayaCode)
  const communesList = selectedWilayaObj ? selectedWilayaObj.communes : []

  // Dynamic Product Pricing helper
  const getUnitPrice = useCallback((pId) => {
    const p = products[pId]
    if (p?.price) return Number(p.price)
    const found = displayProducts.find(dp => dp.id === pId)
    if (found?.price) return Number(found.price)
    return PRODUCTS[pId]?.price || (pId === 'pack' ? 1500 : pId === 'book1' ? 500 : 1200)
  }, [products, displayProducts])

  const getProductTitle = useCallback((pId, fallback) => {
    const p = products[pId] || displayProducts.find(dp => dp.id === pId)
    if (!p) return fallback
    if (currentLang === 'ar' && p.name_ar) return p.name_ar
    if (currentLang === 'en' && p.name_en) return p.name_en
    return p.name || fallback
  }, [products, displayProducts, currentLang])

  // Cart Calculations across all active products
  const cartSummary = useMemo(() => {
    const items = []
    let totalQty = 0
    let grandTotal = 0

    displayProducts.forEach(prod => {
      const qty = cart[prod.id] || 0
      if (qty > 0) {
        const uPrice = getUnitPrice(prod.id)
        const lineTotal = uPrice * qty
        totalQty += qty
        grandTotal += lineTotal
        items.push({
          id: prod.id,
          name: getProductTitle(prod.id, prod.name),
          qty,
          unitPrice: uPrice,
          lineTotal
        })
      }
    })

    return { items, totalQty, grandTotal }
  }, [cart, displayProducts, getUnitPrice, getProductTitle])

  const handleProductRowClick = (pId) => {
    if ((cart[pId] || 0) === 0) {
      updateCartQuantity(pId, 1, true)
    }
    if (pId === 'book1') {
      const idx = thumbnails.findIndex(g => g.category === 'book1')
      if (idx !== -1) setActiveThumbIndex(idx)
    } else if (pId === 'book2') {
      const idx = thumbnails.findIndex(g => g.category === 'book2')
      if (idx !== -1) setActiveThumbIndex(idx)
    } else if (pId === 'pack') {
      setActiveThumbIndex(0)
    }
  }

  const onSubmit = async (data) => {
    if (cartSummary.totalQty === 0) {
      setCartError(currentLang === 'ar' ? 'الرجاء اختيار كتاب واحد على الأقل' : 'Veuillez sélectionner au moins un livre.')
      return
    }
    setCartError('')
    setSubmitting(true)
    const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

    const selectedWilaya = WILAYAS_DATA.find((w) => w.code === data.wilaya)
    const wilayaName = selectedWilaya
      ? currentLang === 'ar'
        ? selectedWilaya.ar
        : currentLang === 'en'
          ? selectedWilaya.en
          : selectedWilaya.fr
      : data.wilaya

    let finalAddress = data.address ? data.address.trim() : ''
    if (deliveryType === 'office' && !finalAddress) {
      finalAddress = t('order.deliveryOffice') || 'Livraison au bureau'
    }

    const itemsDescription = cartSummary.items.map(it => `${it.qty} × ${it.name}`).join(' + ')
    const primaryType = cartSummary.items.length === 1 ? cartSummary.items[0].id : 'pack'

    const order = {
      ...data,
      address: finalAddress,
      wilaya: wilayaName,
      product_type: primaryType,
      product_name: itemsDescription,
      quantity: cartSummary.totalQty,
      unit_price: cartSummary.items.length === 1 ? cartSummary.items[0].unitPrice : 0,
      subtotal: cartSummary.grandTotal,
      delivery_fee: 0,
      total: cartSummary.grandTotal,
    }

    try {
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })

      if (!res.ok) throw new Error('Failed')
      const result = await res.json()
      setOrderData({ ...order, id: result.id })
      setSubmitted(true)
      reset()
    } catch {
      setOrderData(order)
      setSubmitted(true)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-3.5 rounded-2xl border-2 text-sm transition-all outline-none ${
      hasError
        ? 'border-red-400 bg-red-50/50 focus:border-red-500'
        : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-100'
    }`

  return (
    <section id="order" className="py-8 sm:py-14 bg-gradient-to-b from-slate-100/70 via-slate-50 to-white border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ─── LEFT COLUMN: Clean Hero Media + Look Inside Button ─── */}
          <div className="lg:col-span-6 flex flex-col gap-5 lg:sticky lg:top-28">
            
            {/* Main Showcase Frame */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl flex items-center justify-center select-none group cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              {/* Promo Badge */}
              <div className="absolute top-4 start-4 z-20 bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{getText('hero.badge', currentLang) || (currentLang === 'ar' ? 'الأكثر طلباً 🔥' : 'Best-Seller 🔥')}</span>
              </div>

              {/* Animated Media Display */}
              <div className="w-full h-full p-4 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeMedia?.id}
                    src={activeMedia?.url}
                    alt={activeMedia?.label}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </AnimatePresence>
              </div>

              {/* Floating "Feuilleter / Look Inside" Button */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsModalOpen(true)
                  }}
                  className="bg-slate-900/85 hover:bg-slate-900 text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{currentLang === 'ar' ? '📖 تصفح صفحات حقيقية من الكتاب (تكبير)' : '📖 Feuilleter les pages réelles du livre'}</span>
                  <ZoomIn className="w-4 h-4 opacity-70" />
                </button>
              </div>
            </div>

            {/* Clean 4 Thumbnails Strip */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((item, idx) => {
                const isActive = activeThumbIndex === idx
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveThumbIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden border-2 bg-white p-1.5 transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isActive
                        ? 'border-primary-600 ring-2 ring-primary-200 scale-105 shadow-md z-10'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center block px-1">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Guarantee Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  ))}
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">4.9 / 5</span>
                  <span className="text-slate-500 text-xs block font-medium">
                    {currentLang === 'ar' ? '+500 زبون راضٍ بالجزائر' : '+500 professionnels satisfaits'}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {currentLang === 'ar' ? 'طبعة أصلية 100%' : 'Édition 100% Originale'}
              </span>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: Order Form & Mini-Cart ─── */}
          <div className="lg:col-span-6">
            
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-emerald-200 shadow-2xl p-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                  {t('order.success.title') || 'Commande confirmée !'}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
                  {t('order.success.message', {
                    name: `${orderData?.first_name || ''} ${orderData?.last_name || ''}`,
                    product: orderData?.product_name || 'Livres',
                    qty: orderData?.quantity || 1,
                    phone: orderData?.phone || '',
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setOrderData(null)
                    updateCartQuantity('pack', 1, true)
                  }}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-600/30 cursor-pointer"
                >
                  {t('order.success.newOrder') || 'Passer une nouvelle commande'}
                </button>
              </motion.div>
            ) : (
              
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
                
                {/* Header */}
                <div className="mb-6 text-center sm:text-start">
                  <div className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-primary-200">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{currentLang === 'ar' ? 'سلة الطلب السريع' : 'Votre Panier Express'}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {currentLang === 'ar' ? 'حدد الكمية وأكد طلبك' : 'Choisissez vos quantités & commandez'}
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    {currentLang === 'ar' ? 'يمكنك طلب عدة كتب معاً بسهولة — الدفع عند الاستلام' : 'Commandez plusieurs livres en une seule fois — Paiement à la réception'}
                  </p>
                </div>

                {/* 1. DYNAMIC MINI-CART ITEMS LIST (Loaded from DB/Admin) */}
                <div className="mb-6 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. {currentLang === 'ar' ? 'حدد عدد الكتب المطلوبة من كل منتج' : 'Sélectionnez vos livres et leurs quantités'} :
                  </label>

                  <div className="space-y-3">
                    {displayProducts.map((prod) => {
                      const isPack = prod.id === 'pack'
                      const isSelected = (cart[prod.id] || 0) > 0
                      const price = getUnitPrice(prod.id)
                      const origPrice = prod.original_price ? Number(prod.original_price) : null
                      const title = getProductTitle(prod.id, prod.name)

                      return (
                        <div
                          key={prod.id}
                          onClick={() => handleProductRowClick(prod.id)}
                          className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50/80 shadow-md ring-2 ring-primary-200'
                              : isPack
                                ? 'border-amber-300 bg-amber-50/25 hover:border-amber-400'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {isPack && (
                            <span className="absolute -top-2.5 end-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full shadow-sm">
                              ⭐ {currentLang === 'ar' ? 'العرض الأفضل' : 'Pack Recommandé'}
                            </span>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <span className="text-xs font-black">✓</span>}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {title}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-primary-700 font-extrabold">
                                    {formatPrice(price)} DA {currentLang === 'ar' ? 'للنسخة' : '/ exemplaire'}
                                  </span>
                                  {origPrice && origPrice > price && (
                                    <span className="text-[11px] text-slate-400 line-through">
                                      {formatPrice(origPrice)} DA
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Quantity Counter */}
                            <div
                              className="flex items-center gap-2 self-end sm:self-center bg-white border border-slate-300 rounded-xl p-1 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(prod.id, -1)}
                                disabled={(cart[prod.id] || 0) <= 0}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                aria-label="Moins"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-black text-slate-900 text-sm px-2 min-w-[24px] text-center">
                                {cart[prod.id] || 0}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(prod.id, 1)}
                                className="w-8 h-8 rounded-lg bg-primary-600 hover:bg-primary-700 flex items-center justify-center text-white transition-colors cursor-pointer"
                                aria-label="Plus"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 2. ORDER FORM FIELDS */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t('order.firstName') || 'Prénom'} *
                      </label>
                      <input
                        type="text"
                        {...register('first_name', { required: t('order.required') || 'Obligatoire' })}
                        placeholder={currentLang === 'ar' ? 'الاسم' : 'Votre prénom'}
                        className={inputClass(errors.first_name)}
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t('order.lastName') || 'Nom'} *
                      </label>
                      <input
                        type="text"
                        {...register('last_name', { required: t('order.required') || 'Obligatoire' })}
                        placeholder={currentLang === 'ar' ? 'اللقب' : 'Votre nom'}
                        className={inputClass(errors.last_name)}
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('order.phone') || 'Téléphone'} *
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      {...register('phone', {
                        required: t('order.required') || 'Obligatoire',
                        pattern: {
                          value: /^0[5-7][0-9]{8}$/,
                          message: t('order.invalidPhone') || 'Numéro invalide (ex: 0550123456)',
                        },
                      })}
                      placeholder="05XX XX XX XX"
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t('order.wilaya') || 'Wilaya'} *
                      </label>
                      <select
                        {...register('wilaya', { required: t('order.required') || 'Obligatoire' })}
                        className={inputClass(errors.wilaya)}
                        onChange={(e) => {
                          register('wilaya').onChange(e)
                          setValue('commune', '')
                        }}
                      >
                        <option value="">{t('order.selectWilaya') || 'Sélectionnez une wilaya'}</option>
                        {WILAYAS_DATA.map((w) => {
                          const localizedName = currentLang === 'ar' ? w.ar : currentLang === 'en' ? w.en : w.fr
                          return (
                            <option key={w.code} value={w.code}>
                              {w.code} - {localizedName}
                            </option>
                          )
                        })}
                      </select>
                      {errors.wilaya && (
                        <p className="text-red-500 text-xs mt-1">{errors.wilaya.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t('order.commune') || 'Commune'} *
                      </label>
                      <select
                        {...register('commune', { required: t('order.required') || 'Obligatoire' })}
                        disabled={!selectedWilayaCode}
                        className={inputClass(errors.commune)}
                      >
                        <option value="">
                          {selectedWilayaCode
                            ? (t('order.selectCommune') || 'Sélectionnez une commune')
                            : (t('order.selectWilayaFirst') || 'Choisissez d’abord la wilaya')}
                        </option>
                        {communesList.map((c, idx) => {
                          const locCommName = currentLang === 'ar' ? c.ar : currentLang === 'en' ? c.en : c.fr
                          return (
                            <option key={idx} value={locCommName}>
                              {locCommName}
                            </option>
                          )
                        })}
                      </select>
                      {errors.commune && (
                        <p className="text-red-500 text-xs mt-1">{errors.commune.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('order.deliveryMethod') || 'Type de livraison'} *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('home')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          deliveryType === 'home'
                            ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>{t('order.deliveryHome') || 'À domicile'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('office')}
                        className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          deliveryType === 'office'
                            ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>{t('order.deliveryOffice') || 'Au bureau (Stop Desk)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {deliveryType === 'home'
                        ? (t('order.address') || 'Adresse complète') + ' *'
                        : t('order.addressOptional') || 'Adresse (Optionnelle)'}
                    </label>
                    <textarea
                      rows={2}
                      {...register('address', { required: deliveryType === 'home' ? (t('order.required') || 'Obligatoire') : false })}
                      className={inputClass(deliveryType === 'home' ? errors.address : null)}
                      placeholder={
                        deliveryType === 'home'
                          ? (currentLang === 'ar' ? 'مثال: حي 50 مسكن، عمارة ب، رقم 4...' : 'Ex: Cité 50 logements, Bâtiment B...')
                          : (currentLang === 'ar' ? 'اسم المكتب أو مكان العمل (اختياري)...' : "Nom du bureau ou société (optionnel)...")
                      }
                    />
                    {deliveryType === 'home' && errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  {/* LIVE CART SUMMARY BOX */}
                  <div className="bg-primary-50/80 border-2 border-primary-200 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider border-b border-primary-200/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-primary-700" />
                        {currentLang === 'ar' ? 'ملخص طلبك :' : 'Détail de votre commande :'}
                      </span>
                      <span>{cartSummary.totalQty} {currentLang === 'ar' ? 'كتب' : (cartSummary.totalQty > 1 ? 'livres' : 'livre')}</span>
                    </div>

                    {cartSummary.items.length === 0 ? (
                      <p className="text-xs text-amber-700 font-bold py-1">
                        ⚠️ {currentLang === 'ar' ? 'يرجى تحديد كمية 1 على الأقل أعلاه' : 'Veuillez sélectionner au moins 1 livre ci-dessus.'}
                      </p>
                    ) : (
                      cartSummary.items.map(it => (
                        <div key={it.id} className="flex justify-between text-xs text-slate-700">
                          <span>{it.qty} × {it.name}</span>
                          <span className="font-bold text-slate-900">{formatPrice(it.lineTotal)} DA</span>
                        </div>
                      ))
                    )}

                    <div className="flex justify-between items-baseline text-base font-black text-primary-900 pt-2.5 border-t border-primary-200/80">
                      <span>{currentLang === 'ar' ? 'المجموع (بدون التوصيل) :' : 'Total à payer (sans livraison) :'}</span>
                      <span className="text-2xl text-primary-700 font-black">{formatPrice(cartSummary.grandTotal)} DA</span>
                    </div>
                  </div>

                  {cartError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{cartError}</span>
                    </div>
                  )}

                  {/* ANIMATED BUTTON */}
                  <button
                    type="submit"
                    disabled={submitting || cartSummary.totalQty === 0}
                    className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-lg py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-cta animate-btn-shine flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>{t('order.submitting') || 'Envoi en cours...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{currentLang === 'ar' ? '🛒 تأكيد الطلب الآن' : '🛒 Confirmer la commande'}</span>
                      </>
                    )}
                  </button>

                  {/* COD Assurance Badges */}
                  <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <Banknote className="w-4 h-4" />
                      {currentLang === 'ar' ? 'دفع عند الاستلام' : 'Paiement à la réception'}
                    </span>
                    <span className="flex items-center gap-1.5 text-primary-700">
                      <Truck className="w-4 h-4" />
                      {currentLang === 'ar' ? 'توصيل 69 ولاية' : 'Livraison 69 Wilayas'}
                    </span>
                  </div>

                </form>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ═══════════ LOOK INSIDE / FEUILLETER FULLSCREEN MODAL ═══════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
            
            {/* Modal Overlay Close Click */}
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            {/* Modal Content Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-700/50"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                      {currentLang === 'ar' ? BOOK_PAGES_PREVIEW[modalPageIndex].title_ar : BOOK_PAGES_PREVIEW[modalPageIndex].title_fr}
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">
                      {currentLang === 'ar' ? `صفحة ${modalPageIndex + 1} من ${BOOK_PAGES_PREVIEW.length}` : `Page ${modalPageIndex + 1} sur ${BOOK_PAGES_PREVIEW.length}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Large Page Viewer with Navigation */}
              <div className="relative flex-1 bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-hidden select-none min-h-[350px] sm:min-h-[480px]">
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={modalPageIndex}
                    src={BOOK_PAGES_PREVIEW[modalPageIndex].url}
                    alt="Page preview"
                    initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRtl ? 30 : -30 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl drop-shadow-2xl"
                  />
                </AnimatePresence>

                {/* Left / Right Arrow Buttons */}
                <button
                  type="button"
                  onClick={isRtl ? nextModalPage : prevModalPage}
                  className="absolute start-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xl transition-all hover:scale-110 cursor-pointer"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <button
                  type="button"
                  onClick={isRtl ? prevModalPage : nextModalPage}
                  className="absolute end-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xl transition-all hover:scale-110 cursor-pointer"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>

              {/* Modal Footer: Mini-Strip + Direct Order button */}
              <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex gap-2 overflow-x-auto py-1">
                  {BOOK_PAGES_PREVIEW.map((pg, idx) => (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => setModalPageIndex(idx)}
                      className={`w-10 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        modalPageIndex === idx
                          ? 'border-primary-500 ring-2 ring-primary-400/50 scale-105'
                          : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={pg.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    const el = document.getElementById('order')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm shrink-0 shadow-lg cursor-pointer"
                >
                  {currentLang === 'ar' ? 'اطلب الآن' : 'Commander maintenant'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
