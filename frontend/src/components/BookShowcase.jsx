import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  { src: '/images/books-showcase1.jpg', alt: 'BioBooks Showcase 1' },
  { src: '/images/books-showcase2.jpg', alt: 'BioBooks Showcase 2' },
  { src: '/images/books-showcase3.jpg', alt: 'BioBooks Showcase 3' },
  { src: '/images/book-page1.jpg', alt: 'BioBooks Page 1' },
  { src: '/images/book-page2.jpg', alt: 'BioBooks Page 2' },
  { src: '/images/book-page3.jpg', alt: 'BioBooks Page 3' },
  { src: '/images/book-page4.jpg', alt: 'BioBooks Page 4' },
  { src: '/images/book-page5.jpg', alt: 'BioBooks Page 5' },
  { src: '/images/book-sommaire1.jpg', alt: 'BioBooks Sommaire 1' },
  { src: '/images/book-sommaire2.jpg', alt: 'BioBooks Sommaire 2' },
]

export default function BookShowcase() {
  const { t } = useTranslation()
  const [activeIdx, setActiveIdx] = useState(null)

  const nextImg = () => {
    setActiveIdx((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1))
  }

  const prevImg = () => {
    setActiveIdx((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1))
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('showcase.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('showcase.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              onClick={() => setActiveIdx(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 aspect-[4/3] flex items-center justify-center"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/95 text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="w-5 h-5 text-primary-600" />
                  {t('gallery.zoom')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveIdx(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImg()
              }}
              className="absolute left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImg()
              }}
              className="absolute right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={() => setActiveIdx(null)}
              className="max-w-5xl max-h-[85vh] relative flex items-center justify-center"
            >
              <img
                src={IMAGES[activeIdx].src}
                alt={IMAGES[activeIdx].alt}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
