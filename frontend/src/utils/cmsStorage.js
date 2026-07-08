const STORAGE_KEY = 'biobooks_gallery_images'
const TESTIMONIALS_STORAGE_KEY = 'biobooks_testimonials'

function mergeGalleryItems(storedItems = []) {
  const defaults = getDefaultGalleryItems()
  const merged = [...(Array.isArray(storedItems) ? storedItems : [])]

  defaults.forEach((defaultItem) => {
    const alreadyExists = merged.some((item) => item.id === defaultItem.id)
    const sameAlbumAndUrl = merged.some((item) => item.album_id === defaultItem.album_id && item.image_url === defaultItem.image_url)

    if (!alreadyExists && !sameAlbumAndUrl) {
      merged.push(defaultItem)
    }
  })

  return merged
}

export function getDefaultGalleryItems() {
  return [
    {
      id: 'default-hero-1',
      album_id: 'hero',
      image_url: '/images/books-cover-real.jpg',
      alt_fr: 'Image de la première page d’accueil',
      alt_en: 'Homepage hero image',
      alt_ar: 'صورة الصفحة الأولى الرئيسية',
      display_order: 1,
    },
    {
      id: 'default-book1-1',
      album_id: 'book1',
      image_url: '/images/book1-cover-real.jpg',
      alt_fr: 'Couverture — Matériels et outils de laboratoire',
      alt_en: 'Cover — Laboratory materials and tools',
      alt_ar: 'الغلاف — المواد والأدوات المخبرية',
      display_order: 1,
    },
    {
      id: 'default-book1-2',
      album_id: 'book1',
      image_url: '/images/book1-back-real.jpg',
      alt_fr: 'Dos du livre — Matériels et outils de laboratoire',
      alt_en: 'Back cover — Laboratory materials and tools',
      alt_ar: 'الظهر — المواد والأدوات المخبرية',
      display_order: 2,
    },
    {
      id: 'default-book1-3',
      album_id: 'book1',
      image_url: '/images/book1-page1-real.jpg',
      alt_fr: 'Page 1 — Liste des matériels et consommables',
      alt_en: 'Page 1 — List of materials and consumables',
      alt_ar: 'الصفحة 1 — قائمة المواد واللوازم',
      display_order: 3,
    },
    {
      id: 'default-book1-4',
      album_id: 'book1',
      image_url: '/images/book1-page2-real.jpg',
      alt_fr: 'Page 2 — Suite de la liste & milieux de cultures',
      alt_en: 'Page 2 — Continuation of the list and culture media',
      alt_ar: 'الصفحة 2 — استكمال القائمة ووسط النمو',
      display_order: 4,
    },
    {
      id: 'default-book1-5',
      album_id: 'book1',
      image_url: '/images/book1-page3-real.jpg',
      alt_fr: 'Page 3 — Équipements et technologies',
      alt_en: 'Page 3 — Equipment and technologies',
      alt_ar: 'الصفحة 3 — المعدات والتقنيات',
      display_order: 5,
    },
    {
      id: 'default-book1-6',
      album_id: 'book1',
      image_url: '/images/book1-page4-real.jpg',
      alt_fr: 'Page 4 — Formes & importance des milieux de culture & Milieu BCP',
      alt_en: 'Page 4 — Forms and importance of culture media and BCP medium',
      alt_ar: 'الصفحة 4 — أشكال وأهمية أوساط الزراعة ووسط BCP',
      display_order: 6,
    },
    {
      id: 'default-book2-1',
      album_id: 'book2',
      image_url: '/images/book2-cover-real.jpg',
      alt_fr: 'Couverture — Guide pratique des techniques des analyses médicales',
      alt_en: 'Cover — Practical guide to medical analysis techniques',
      alt_ar: 'الغلاف — دليل عملي لتقنيات التحاليل الطبية',
      display_order: 1,
    },
    {
      id: 'default-book2-2',
      album_id: 'book2',
      image_url: '/images/book2-sommaire1-real.jpg',
      alt_fr: 'Sommaire Page 3 — Généralités, prélèvements sanguins & anticoagulants',
      alt_en: 'Contents Page 3 — Generalities, blood sampling and anticoagulants',
      alt_ar: 'الصفحة 3 — العموميات وسحب الدم ومضادات التخثر',
      display_order: 2,
    },
    {
      id: 'default-book2-3',
      album_id: 'book2',
      image_url: '/images/book2-sommaire2-real.jpg',
      alt_fr: 'Sommaire Page 3 & Droits Réservés',
      alt_en: 'Contents Page 3 and reserved rights',
      alt_ar: 'الصفحة 3 والحقوق محفوظة',
      display_order: 3,
    },
    {
      id: 'default-book2-4',
      album_id: 'book2',
      image_url: '/images/book2-sommaire3-real.jpg',
      alt_fr: 'Sommaire Page 4 & 5 — Dosages biochimiques, analyses immunologiques',
      alt_en: 'Contents Pages 4 & 5 — Biochemical assays and immunological analyses',
      alt_ar: 'الصفحات 4 و5 — التحاليل الكيميائية الحيوية والتحاليل المناعية',
      display_order: 4,
    },
    {
      id: 'default-book2-5',
      album_id: 'book2',
      image_url: '/images/book2-page1-real.jpg',
      alt_fr: 'Page 26-27 — Retrait d\'aiguille, étiquetage des tubes & préparation du sérum/plasma',
      alt_en: 'Pages 26-27 — Needle withdrawal, tube labeling and serum/plasma preparation',
      alt_ar: 'الصفحات 26-27 — سحب الإبرة، وتوسيم الأنابيب وإعداد المصل/البلازما',
      display_order: 5,
    },
    {
      id: 'default-book2-6',
      album_id: 'book2',
      image_url: '/images/book2-page2-real.jpg',
      alt_fr: 'Page 80-81 — Dosage de l\'Urée colorimétrique & Créatinine',
      alt_en: 'Pages 80-81 — Colorimetric urea and creatinine assays',
      alt_ar: 'الصفحات 80-81 — قياس اليوريا والكراتينين اللوني',
      display_order: 6,
    },
    {
      id: 'default-book2-7',
      album_id: 'book2',
      image_url: '/images/book2-back-real.jpg',
      alt_fr: 'Dos du livre — Guide pratique des techniques des analyses médicales',
      alt_en: 'Back cover — Practical guide to medical analysis techniques',
      alt_ar: 'الظهر — دليل عملي لتقنيات التحاليل الطبية',
      display_order: 7,
    },
  ]
}

export function getStoredGalleryItems() {
  if (typeof window === 'undefined') return getDefaultGalleryItems()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultGalleryItems()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return getDefaultGalleryItems()

    return parsed.length > 0 ? mergeGalleryItems(parsed) : getDefaultGalleryItems()
  } catch {
    return getDefaultGalleryItems()
  }
}

export function saveGalleryItems(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getDefaultTestimonials() {
  return [
    {
      id: 'default-testimonial-1',
      name: 'Acheteur Biologie',
      text_fr: 'السلام عليكم كتاب ماشاء الله فيه تفصيل مختصر لكل تحليل ابتداءا من مراحله الأولى...',
      text_en: 'Hello, this book contains a concise explanation of each analysis from the first stages...',
      text_ar: 'السلام عليكم كتاب ماشاء الله فيه تفصيل مختصر لكل تحليل ابتداءا من مراحله الأولى...',
      rating: 5,
      image_url: '/images/feedback-ar.jpg',
      is_active: true,
      display_order: 1,
    },
    {
      id: 'default-testimonial-2',
      name: 'Étudiante en Biochimie',
      text_fr: "J'ai vraiment adoré ce livre ! Il contient une richesse d'informations précieuses et claires...",
      text_en: 'I really loved this book! It contains a wealth of valuable and clear information...',
      text_ar: 'أحببت هذا الكتاب حقًا! يحتوي على ثروة من المعلومات القيمة والواضحة...',
      rating: 5,
      image_url: '/images/feedback-fr.jpg',
      is_active: true,
      display_order: 2,
    },
  ]
}

export function getStoredTestimonials() {
  if (typeof window === 'undefined') return getDefaultTestimonials()

  try {
    const raw = window.localStorage.getItem(TESTIMONIALS_STORAGE_KEY)
    if (!raw) return getDefaultTestimonials()

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultTestimonials()
  } catch {
    return getDefaultTestimonials()
  }
}

export function saveTestimonials(items) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(items))
}
