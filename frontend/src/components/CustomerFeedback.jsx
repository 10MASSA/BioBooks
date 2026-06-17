import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ZoomIn, X } from 'lucide-react'

const FEEDBACKS = [
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

export default function CustomerFeedback() {
  const { t } = useTranslation()
  const [activeSrc, setActiveSrc] = useState(null)

  return (
    <section id="feedback" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {FEEDBACKS.map((fb, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              onClick={() => setActiveSrc(fb.src)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-gray-50 border-2 border-gray-100 shadow-md p-4 flex flex-col items-center justify-center hover:shadow-xl hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-full flex items-center justify-between px-3 pb-3 border-b border-gray-200 mb-4">
                <span className="font-semibold text-gray-700">{fb.user}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                  {fb.lang}
                </span>
              </div>

              <div className="relative w-full aspect-[9/16] max-h-[420px] overflow-hidden rounded-2xl border border-gray-200 flex items-center justify-center bg-white">
                <img
                  src={fb.src}
                  alt={`Feedback ${fb.lang}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/95 text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-5 h-5 text-primary-600" />
                    {t('gallery.zoom')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveSrc(null)}
          >
            <button
              onClick={() => setActiveSrc(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-lg w-full max-h-[90vh] p-2 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeSrc}
                alt="Zoomed feedback"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
