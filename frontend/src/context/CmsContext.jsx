import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_URL } from '../utils/constants'
import { getStoredGalleryItems, saveGalleryItems, getStoredTestimonials, saveTestimonials } from '../utils/cmsStorage'

const CmsContext = createContext(null)

export function CmsProvider({ children }) {
  const [cms, setCms] = useState({ texts: [], faq: [], gallery: [], features: [], testimonials: [] })
  const [cmsLoading, setCmsLoading] = useState(true)
  const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

  const fetchCms = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/content`)
      if (res.ok) {
        const data = await res.json()
        const gallery = Array.isArray(data?.gallery) && data.gallery.length > 0
          ? data.gallery
          : getStoredGalleryItems()
        const testimonials = Array.isArray(data?.testimonials) && data.testimonials.length > 0
          ? data.testimonials
          : getStoredTestimonials()
        const merged = { ...data, gallery, testimonials }
        setCms(merged)
        saveGalleryItems(gallery)
        saveTestimonials(testimonials)
      } else {
        setCms(prev => ({ ...prev, gallery: getStoredGalleryItems(), testimonials: getStoredTestimonials() }))
      }
    } catch (err) {
      console.error('CMS fetch error:', err)
      setCms(prev => ({ ...prev, gallery: getStoredGalleryItems(), testimonials: getStoredTestimonials() }))
    } finally {
      setCmsLoading(false)
    }
  }, [apiBase])

  useEffect(() => {
    fetchCms()
  }, [fetchCms])

  // Helper: get a text value by key and language
  const getText = (key, lang = 'fr') => {
    const entry = cms.texts.find(t => t.key_name === key)
    if (!entry) return null
    if (lang === 'en') return entry.en_value || entry.fr_value
    if (lang === 'ar') return entry.ar_value || entry.fr_value
    return entry.fr_value
  }

  // Helper: get features for a product in a given language
  const getFeatures = (productId, lang = 'fr') => {
    return cms.features
      .filter(f => f.product_id === productId)
      .map(f => {
        if (lang === 'en') return f.text_en || f.text_fr
        if (lang === 'ar') return f.text_ar || f.text_fr
        return f.text_fr
      })
  }

  // Helper: get gallery images for an album
  const getGallery = (albumId) => {
    return cms.gallery.filter(img => img.album_id === albumId)
  }

  // Helper: get FAQ in a given language
  const getFaq = (lang = 'fr') => {
    return cms.faq.map(item => ({
      id: item.id,
      q: lang === 'en' ? (item.question_en || item.question_fr) : lang === 'ar' ? (item.question_ar || item.question_fr) : item.question_fr,
      a: lang === 'en' ? (item.answer_en || item.answer_fr) : lang === 'ar' ? (item.answer_ar || item.answer_fr) : item.answer_fr,
    }))
  }

  // Helper: get testimonials in a given language
  const getTestimonials = (lang = 'fr') => {
    return cms.testimonials.map(item => ({
      id: item.id,
      name: item.name,
      text: lang === 'en' ? (item.text_en || item.text_fr) : lang === 'ar' ? (item.text_ar || item.text_fr) : item.text_fr,
      rating: item.rating || 5,
      image_url: item.image_url || null,
    }))
  }

  return (
    <CmsContext.Provider value={{ cms, cmsLoading, fetchCms, getText, getFeatures, getGallery, getFaq, getTestimonials }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
