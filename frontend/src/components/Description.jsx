import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  FlaskConical, Sparkles, Activity, Microscope, FileText,
  ShieldAlert, ChevronRight, ShoppingCart, CheckCircle2
} from 'lucide-react'
import { PRODUCTS, formatPrice } from '../utils/constants'
import { smoothScrollTo } from '../utils/smoothScroll'
import { useProducts } from '../context/ProductsContext'
import { useCms } from '../context/CmsContext'

export default function Description() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'fr'
  const { products, loading, selectSingleProduct } = useProducts()
  const { getText, getFeatures } = useCms()

  const book1Price = formatPrice((!loading && products?.book1?.price) ? products.book1.price : 500)
  const book2Price = formatPrice((!loading && products?.book2?.price) ? products.book2.price : 1200)
  const packPrice = formatPrice((!loading && products?.pack?.price) ? products.pack.price : 1500)

  const book1Image = (!loading && products?.book1?.image) ? products.book1.image : '/images/book1-cover-real.jpg'
  const book2Image = (!loading && products?.book2?.image) ? products.book2.image : '/images/book2-cover-real.jpg'

  // Dynamic CMS Features with default fallback
  const book1Features = getFeatures('book1', currentLang)
  const book2Features = getFeatures('book2', currentLang)

  // Dynamic titles
  const getProductTitle = (pId, fallback) => {
    const p = products[pId]
    if (!p) return fallback
    if (currentLang === 'ar' && p.name_ar) return p.name_ar
    if (currentLang === 'en' && p.name_en) return p.name_en
    return p.name || fallback
  }

  // Dynamic Section Header texts from CMS
  const sectionBadge = getText('description.promo', currentLang) || (currentLang === 'ar' ? 'المحتوى الشامل والتفصيلي' : 'Contenu Pratique & Détaillé')
  const sectionTitle = getText('description.title', currentLang) || (currentLang === 'ar' ? 'ماذا ستجد داخل هذه الكتب ؟' : 'Tout ce que vous allez maîtriser')
  const sectionSubtitle = getText('description.subtitle', currentLang) || (currentLang === 'ar'
    ? 'مرجع تطبيقي عملي 100% يجمع بين صور حقيقية وشروحات مبسطة لجميع تقنيات وأجهزة التحاليل الطبية'
    : 'Deux guides de référence 100% pratiques avec photos réelles, protocoles étape par étape et interprétation des résultats.')

  // Dynamic Mega Pack Banner texts from CMS
  const packBadgeText = getText('pack.badge', currentLang) || getText('hero.bonus', currentLang) || (currentLang === 'ar' ? 'العرض الأكثر توفيراً وطلباً' : 'L’offre recommandée par les laboratoires')
  const packTitleText = getText('pack.title', currentLang) || (currentLang === 'ar'
    ? `اطلب ${getProductTitle('pack', 'الباك الكامل')} ووفر أكثر من 400 دج`
    : `Commandez ${getProductTitle('pack', 'le Pack Complet')} et économisez 400 DA`)
  const packDescText = getText('pack.description', currentLang) || products?.pack?.description || (currentLang === 'ar'
    ? 'سلسلة شاملة تغطي كل ما يحتاجه الممارس والطالب من عتاد المخبر إلى أدق تقنيات التحاليل الطبية.'
    : 'Recevez les 2 ouvrages chez vous avec livraison rapide partout en Algérie. Paiement à la réception.')
  const packPriceLabel = getText('pack.price_label', currentLang) || (currentLang === 'ar' ? 'سعر الباك المخفض :' : 'Prix spécial Pack :')
  const packCodLabel = getText('pack.cod_label', currentLang) || (currentLang === 'ar' ? 'الدفع بعد الاستلام والمعاينة 100%' : 'Paiement à la livraison après vérification')
  const packBtnText = getText('pack.btn', currentLang) || (currentLang === 'ar' ? `🛒 طلب ${getProductTitle('pack', 'الباك')} الآن` : `🛒 Commander ${getProductTitle('pack', 'le Pack')}`)

  const handleOrderClick = (e, productId) => {
    e.preventDefault()
    selectSingleProduct(productId)
    smoothScrollTo(e, '#order')
  }

  return (
    <section id="description" className="py-16 sm:py-24 bg-white relative overflow-hidden scroll-mt-10">
      
      {/* Background subtle decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary-700 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-200 shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>{sectionBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
            {sectionTitle}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {sectionSubtitle}
          </p>
        </motion.div>

        {/* 2 Detailed High-End Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16">
          
          {/* ═══════════ BOOK 1 CARD ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Card Header with Image & Title */}
              <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-white/15 rounded-2xl p-1.5 backdrop-blur-md border border-white/20 shadow-md shrink-0 flex items-center justify-center">
                      <img
                        src={book1Image}
                        alt="Livre 1"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="inline-block bg-blue-500/30 text-blue-100 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-400/30 mb-1">
                        {currentLang === 'ar' ? 'الجزء الأول' : 'Volume 1'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black leading-tight">
                        {getProductTitle('book1', currentLang === 'ar' ? 'عتاد وأدوات المخبر' : 'Matériels & Outils de Laboratoire')}
                      </h3>
                      <p className="text-blue-100 text-xs mt-1">
                        {products?.book1?.description || (currentLang === 'ar' ? 'طبعة ثانية منقحة ومزيدة بالألوان' : 'Guide pratique illustré en couleur')}
                      </p>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="block text-2xl sm:text-3xl font-black text-amber-300">
                      {book1Price} <span className="text-sm font-bold text-white">DA</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content Points */}
              <div className="p-6 sm:p-8 space-y-4">
                {book1Features && book1Features.length > 0 ? (
                  book1Features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                      <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">{feat}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                      <Microscope className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'الأوتومات والأجهزة الآلية :' : 'Automates & Appareils modernes :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'شرح شامل لأجهزة FNS، Ionogramme، وأجهزة الكيمياء الحيوية الأوتوماتيكية مع مبدأ العمل.'
                            : 'Présentation complète des automates (FNS, Ionogramme, Biochimie) et réglages.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <Activity className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'الأدوات والأجهزة المساعدة :' : 'Appareils & Équipements de paillasse :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'طرق تشغيل واستعمال الـ Spectrophotomètre، Centrifugeuse، والميكروسكوب بدقة.'
                            : 'Utilisation du spectrophotomètre, centrifugeuse, bain-marie et microscope optique.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                      <FlaskConical className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'الماصات وخلايا العد والأنابيب :' : 'Pipettes, cellules de numération & tubes :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'معايرة الماصات الدقيقة (Micropipettes)، خلايا Malassez و Nageotte، وأنواع أنابيب السحب.'
                            : 'Maîtrise des micropipettes, cellules de comptage (Malassez, Nageotte) et code couleur des tubes.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'الأمن الحيوي والسلامة بالمخبر :' : 'Sécurité & Prévention des accidents :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'بروتوكولات الوقاية من حوادث التعرض للدم (AES) والتعامل مع النفايات والمخاطر الكيميائية.'
                            : 'Protocoles contre les accidents d’exposition au sang (AES) et gestion des déchets infectieux.'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Direct Order CTA */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                type="button"
                onClick={(e) => handleOrderClick(e, 'book1')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{currentLang === 'ar' ? `طلب ${getProductTitle('book1', 'الكتاب الأول')} (${book1Price} دج)` : `Commander ${getProductTitle('book1', 'le Livre 1')} (${book1Price} DA)`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>


          {/* ═══════════ BOOK 2 CARD ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Card Header with Image & Title */}
              <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-white/15 rounded-2xl p-1.5 backdrop-blur-md border border-white/20 shadow-md shrink-0 flex items-center justify-center">
                      <img
                        src={book2Image}
                        alt="Livre 2"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="inline-block bg-emerald-500/30 text-emerald-100 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30 mb-1">
                        {currentLang === 'ar' ? 'الجزء الثاني' : 'Volume 2'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black leading-tight">
                        {getProductTitle('book2', currentLang === 'ar' ? 'تقنيات التحاليل الطبية' : "Techniques d'Analyses Médicales")}
                      </h3>
                      <p className="text-emerald-100 text-xs mt-1">
                        {products?.book2?.description || (currentLang === 'ar' ? 'أكثر من 110 تقنية مخبرية وتفسير دقيق' : '+110 protocoles détaillés & interprétation')}
                      </p>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="block text-2xl sm:text-3xl font-black text-amber-300">
                      {book2Price} <span className="text-sm font-bold text-white">DA</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content Points */}
              <div className="p-6 sm:p-8 space-y-4">
                {book2Features && book2Features.length > 0 ? (
                  book2Features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">{feat}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <Activity className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'تقنيات السحب وأخذ العينات :' : 'Prélèvements & Anticoagulants :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'تقنيات سحب الدم الوريدي والشرياني، اختيار مضاد التخثر المناسب (EDTA, Héparine, Citrate).'
                            : 'Techniques de prélèvement sanguin, ponctions et choix optimal des anticoagulants.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <Microscope className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'أمراض الدم (Hématologie) ومسحات الدم :' : 'Hématologie & Formule Sanguine (FNS) :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'تعداد الدم الكامل (FNS)، قراءة وتحضير لطاخات الدم (Frottis sanguin) والتعرف على الخلايا.'
                            : 'Numération FNS, frottis sanguins, coloration MGG et morphologie des cellules sanguines.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <FlaskConical className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'التحاليل البيوكيميائية الشاملة :' : 'Dosages Biochimiques Complets :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'سكر الدم، منحنى السكر (HGPO)، اليوريا، الكرياتينين، حمض البول، إنزيمات الكبد، الكوليسترول والدهون.'
                            : 'Glycémie, urée, créatinine, bilan lipidique, hépatique et rénal avec protocoles exacts.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <FileText className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {currentLang === 'ar' ? 'المناعة والأمصال وتفسير النتائج :' : 'Sérologie, Immunologie & Interprétation :'}
                        </strong>
                        <span className="text-xs text-slate-600">
                          {currentLang === 'ar'
                            ? 'تحاليل Toxoplasmose, Rubéole, Hépatites, HIV، الشرائط السريعة، مع جدول القيم العادية والمرضية.'
                            : 'Sérologie infectieuse, tests rapides, ELISA, valeurs de référence et diagnostic.'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Direct Order CTA */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                type="button"
                onClick={(e) => handleOrderClick(e, 'book2')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{currentLang === 'ar' ? `طلب ${getProductTitle('book2', 'الكتاب الثاني')} (${book2Price} دج)` : `Commander ${getProductTitle('book2', 'le Livre 2')} (${book2Price} DA)`}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* ═══════════ COMPLETE PACK MEGA BANNER ═══════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 border-2 border-amber-400/40 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="text-center lg:text-start max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full shadow-md mb-4 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                {packBadgeText}
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white mb-3">
                {packTitleText}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {packDescText}
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-3 shrink-0 w-full lg:w-auto">
              <div className="text-center lg:text-end">
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                  {packPriceLabel}
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white block my-1">
                  {packPrice} <span className="text-2xl font-bold text-amber-400">DA</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {packCodLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => handleOrderClick(e, 'pack')}
                className="w-full sm:w-auto text-center px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer block flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{packBtnText}</span>
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
