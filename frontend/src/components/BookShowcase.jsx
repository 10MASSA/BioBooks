import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTilt } from '../utils/useTilt'

const ALBUM_1 = [
  { src: '/images/book1-cover-real.jpg', alt: 'Couverture — Matériels et outils de laboratoire' },
  { src: '/images/book1-back-real.jpg', alt: 'Dos du livre — Matériels et outils de laboratoire' },
  { src: '/images/book1-page1-real.jpg', alt: 'Page 1 — Liste des matériels et consommables' },
  { src: '/images/book1-page2-real.jpg', alt: 'Page 2 — Suite de la liste & milieux de cultures' },
  { src: '/images/book1-page3-real.jpg', alt: 'Page 3 — Équipements et technologies' },
  { src: '/images/book1-page4-real.jpg', alt: 'Page 4 — Formes & importance des milieux de culture & Milieu BCP' },
]

const ALBUM_2 = [
  { src: '/images/book2-cover-real.jpg', alt: 'Couverture — Guide pratique des techniques des analyses médicales' },
  { src: '/images/book2-sommaire1-real.jpg', alt: 'Sommaire Page 3 — Généralités, prélèvements sanguins & anticoagulants' },
  { src: '/images/book2-sommaire2-real.jpg', alt: 'Sommaire Page 3 & Droits Réservés' },
  { src: '/images/book2-sommaire3-real.jpg', alt: 'Sommaire Page 4 & 5 — Dosages biochimiques, analyses immunologiques' },
  { src: '/images/book2-page1-real.jpg', alt: 'Page 26-27 — Retrait d\'aiguille, étiquetage des tubes & préparation du sérum/plasma' },
  { src: '/images/book2-page2-real.jpg', alt: 'Page 80-81 — Dosage de l\'Urée colorimétrique & Créatinine' },
  { src: '/images/book2-back-real.jpg', alt: 'Dos du livre — Guide pratique des techniques des analyses médicales' },
]

function AlbumCarousel({ title, images, onZoom }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const { tiltStyle, handleMouseMove, handleMouseLeave } = useTilt(8, 1.02)

  const next = () => {
    setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prev = () => {
    setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center min-h-[3rem] flex items-center justify-center">
        {title}
      </h3>
      
      {/* Main Image Container */}
      <div
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group overflow-hidden rounded-2xl bg-gray-50 aspect-[4/3] flex items-center justify-center border border-gray-100 cursor-pointer select-none"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={images[activeIdx].src}
            alt={images[activeIdx].alt}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover select-none cursor-pointer"
            onClick={() => onZoom(images, activeIdx)}
          />
        </AnimatePresence>

        {/* Hover zoom overlay */}
        <div 
          onClick={() => onZoom(images, activeIdx)}
          className="absolute top-4 right-4 bg-white/95 text-gray-900 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <ZoomIn className="w-5 h-5 text-primary-600" />
        </div>

        {/* Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prev()
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-md text-gray-700 hover:bg-white hover:scale-105 transition-all z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            next()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full shadow-md text-gray-700 hover:bg-white hover:scale-105 transition-all z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots / Pagination */}
      <div className="flex justify-center gap-1.5 mt-5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === activeIdx ? 'bg-primary-600 w-5' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      {/* Thumbnails list */}
      <div className="flex gap-2 mt-4 overflow-x-auto py-1 scrollbar-thin">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative rounded-lg overflow-hidden border-2 shrink-0 w-16 h-12 transition-all ${
              idx === activeIdx ? 'border-primary-500 scale-95 shadow-sm' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function BookShowcase() {
  const { t } = useTranslation()
  const [zoomAlbum, setZoomAlbum] = useState(null)
  const [zoomIdx, setZoomIdx] = useState(null)

  const openZoom = (images, idx) => {
    setZoomAlbum(images)
    setZoomIdx(idx)
  }

  const nextImg = () => {
    if (!zoomAlbum) return
    setZoomIdx((prev) => (prev === zoomAlbum.length - 1 ? 0 : prev + 1))
  }

  const prevImg = () => {
    if (!zoomAlbum) return
    setZoomIdx((prev) => (prev === 0 ? zoomAlbum.length - 1 : prev - 1))
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AlbumCarousel 
              title={t('products.book1.name')} 
              images={ALBUM_1} 
              onZoom={openZoom} 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <AlbumCarousel 
              title={t('products.book2.name')} 
              images={ALBUM_2} 
              onZoom={openZoom} 
            />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {zoomAlbum !== null && zoomIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => {
                setZoomAlbum(null)
                setZoomIdx(null)
              }}
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
              onClick={() => {
                setZoomAlbum(null)
                setZoomIdx(null)
              }}
              className="max-w-5xl max-h-[85vh] relative flex items-center justify-center"
            >
              <img
                src={zoomAlbum[zoomIdx].src}
                alt={zoomAlbum[zoomIdx].alt}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
