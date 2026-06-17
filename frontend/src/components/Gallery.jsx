import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { GALLERY_IMAGES } from '../utils/constants'

export default function Gallery() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [zoomed, setZoomed] = useState(null)

  const next = () => setCurrent((c) => (c + 1) % GALLERY_IMAGES.length)
  const prev = () => setCurrent((c) => (c - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-gray-600 text-lg">{t('gallery.subtitle')}</p>
        </motion.div>

        <div className="hidden md:grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl"
            onClick={() => setZoomed(0)}
          >
            <img
              src={GALLERY_IMAGES[0].src}
              alt={GALLERY_IMAGES[0].alt}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {GALLERY_IMAGES.slice(1).map((img, i) => (
              <motion.div
                key={img.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg"
                onClick={() => setZoomed(i + 1)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="md:hidden relative">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={GALLERY_IMAGES[current].src}
              alt={GALLERY_IMAGES[current].alt}
              className="w-full h-72 object-cover"
              onClick={() => setZoomed(current)}
            />
            <button
              onClick={prev}
              className="absolute start-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute end-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">{t('gallery.zoom')}</p>
        </div>
      </div>

      <AnimatePresence>
        {zoomed !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setZoomed(null)}
          >
            <button
              className="absolute top-4 end-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setZoomed(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={GALLERY_IMAGES[zoomed].src}
              alt={GALLERY_IMAGES[zoomed].alt}
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
