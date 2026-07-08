import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ZoomIn, X, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useCms } from '../context/CmsContext'

const FEEDBACKS_DEFAULT = [
  {
    src: '/images/feedback-ar.jpg',
    lang: 'ar',
    user: 'Acheteur Biologie',
    snippet: 'السلام عليكم كتاب ماشاء الله فيه تفصيل مختصر لكل تحليل ابتداءا من مراحله الأولى...',
  },
  {
    src: '/images/feedback-fr.jpg',
    lang: 'fr',
    user: 'Étudiante en Biochimie',
    snippet: "J'ai vraiment adoré ce livre ! Il contient une richesse d'informations précieuses et claires...",
  },
]

const getFeedbackImage = (testimonial, fallbackIndex = 0) => {
  if (testimonial?.image_url) return testimonial.image_url
  return fallbackIndex % 2 === 0 ? '/images/feedback-ar.jpg' : '/images/feedback-fr.jpg'
}

export default function CustomerFeedback() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'fr'
  const { getTestimonials, cms } = useCms()

  // Use DB testimonials if available, otherwise fallback
  const dbTestimonials = getTestimonials(currentLang)
  const useDbData = dbTestimonials.length > 0

  // Convert DB testimonials to the same format as FEEDBACKS_DEFAULT
  const FEEDBACKS = useDbData
    ? dbTestimonials.map((t, index) => ({
        src: getFeedbackImage(t, index),
        user: t.name,
        snippet: t.text,
        rating: t.rating,
        isText: true,
      }))
    : FEEDBACKS_DEFAULT

  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoomIndex, setZoomIndex] = useState(null)
  const [direction, setDirection] = useState(0) // -1 pour gauche, 1 pour droite

  // Auto-play toutes les 8 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 8000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % FEEDBACKS.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + FEEDBACKS.length) % FEEDBACKS.length)
  }

  const handleZoomNext = (e) => {
    e.stopPropagation()
    setZoomIndex((prev) => (prev + 1) % FEEDBACKS.length)
  }

  const handleZoomPrev = (e) => {
    e.stopPropagation()
    setZoomIndex((prev) => (prev - 1 + FEEDBACKS.length) % FEEDBACKS.length)
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
    }),
  }

  const activeFeedback = FEEDBACKS[currentIndex]

  return (
    <section id="feedback" className="py-20 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-4">
            <MessageSquare className="w-4 h-4" />
            {t('feedback.title')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('feedback.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('feedback.subtitle')}
          </p>
        </motion.div>

        {/* Conteneur du Carrousel */}
        <div className="relative max-w-md mx-auto px-4 sm:px-12">
          {/* Carte Principale */}
          <div className="relative aspect-[9/16] max-h-[500px] w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden group">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full h-full flex flex-col justify-between"
              >
                {/* En-tête de la carte */}
                <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <span className="font-bold text-gray-800 text-sm sm:text-base">{activeFeedback.user}</span>
                  <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full uppercase tracking-wider font-bold border border-primary-100">
                    {activeFeedback.lang}
                  </span>
                </div>

                {/* Capture d'écran de l'avis */}
                <div
                  onClick={() => setZoomIndex(currentIndex)}
                  className="relative flex-1 w-full overflow-hidden rounded-2xl border border-gray-100 flex items-center justify-center bg-gray-50 cursor-zoom-in"
                >
                  {activeFeedback.src ? (
                    <>
                      <img
                        src={activeFeedback.src}
                        alt={`Feedback ${activeFeedback.lang}`}
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/95 text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIn className="w-5 h-5 text-primary-600" />
                          {t('gallery.zoom')}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center px-6 text-gray-400">
                      <p className="text-sm font-semibold">{t('feedback.textOnly')}</p>
                      <p className="text-xs mt-1">{t('feedback.noImage')}</p>
                    </div>
                  )}
                </div>

                {/* Texte de l'avis */}
                <p className="mt-4 text-xs sm:text-sm text-gray-500 italic text-center px-2 line-clamp-2">
                  "{activeFeedback.snippet}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Flèches de navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-[-15px] sm:left-[-25px] top-1/2 -translate-y-1/2 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-600 p-3 rounded-full shadow-lg border border-gray-100 transition-all z-10 hover:scale-110"
            aria-label={t('feedback.previous')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[-15px] sm:right-[-25px] top-1/2 -translate-y-1/2 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-600 p-3 rounded-full shadow-lg border border-gray-100 transition-all z-10 hover:scale-110"
            aria-label={t('feedback.next')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Points indicateurs (dots) */}
          <div className="flex justify-center gap-2 mt-6">
            {FEEDBACKS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-primary-600 w-6' : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                }`}
                aria-label={t('feedback.slide', { number: idx + 1 })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modale Lightbox Zoomée avec boutons Album */}
      <AnimatePresence>
        {zoomIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setZoomIndex(null)}
          >
            <button
              onClick={() => setZoomIndex(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Contrôles de la modale */}
            <button
              onClick={handleZoomPrev}
              className="absolute left-4 sm:left-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 hover:scale-105"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleZoomNext}
              className="absolute right-4 sm:right-8 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 hover:scale-105"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-lg w-full max-h-[85vh] p-2 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {FEEDBACKS[zoomIndex].src ? (
                <img
                  src={FEEDBACKS[zoomIndex].src}
                  alt="Zoomed feedback"
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl select-none"
                />
              ) : (
                <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white/80">
                  <p className="font-semibold">{t('feedback.textOnly')}</p>
                  <p className="text-sm mt-2">{t('feedback.noImage')}</p>
                </div>
              )}
              <div className="mt-4 text-center text-white/80">
                <span className="font-bold">{FEEDBACKS[zoomIndex].user}</span>
                <span className="mx-2">•</span>
                <span className="uppercase text-xs bg-white/15 px-2 py-0.5 rounded font-semibold">{FEEDBACKS[zoomIndex].lang}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
