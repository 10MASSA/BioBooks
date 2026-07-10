export const DELIVERY_FEE = 450
export const API_URL = import.meta.env.VITE_API_URL || 'https://biobooks-production.up.railway.app'

export const PRODUCTS = {
  book1: {
    id: 'book1',
    price: 700,
    image: '/images/book1-cover.svg',
  },
  book2: {
    id: 'book2',
    price: 1600,
    image: '/images/book2-cover.svg',
  },
  pack: {
    id: 'pack',
    price: 2000,
    image: '/images/pack-main.svg',
    originalPrice: 2300,
  },
}

export const getProductPrice = (productId) => PRODUCTS[productId]?.price ?? 0

export const formatPrice = (price) => {
  if (price === null || price === undefined) return ''
  return Number(price) % 1 === 0 ? String(Math.round(Number(price))) : String(price)
}

export const WHATSAPP_NUMBERS = [
  { number: '0674790645', link: 'https://wa.me/213674790645' },
  { number: '0557345457', link: 'https://wa.me/213557345457' },
]

export const MESSENGER_LINK = 'https://m.me/yourpage'
export const FACEBOOK_LINK = 'https://facebook.com/yourpage'

export const GALLERY_IMAGES = [
  { src: '/images/books-cover-real.jpg', alt: 'books' },
  { src: '/images/pricing-banner.png', alt: 'pricing' },
  { src: '/images/book1-cover.svg', alt: 'book1' },
  { src: '/images/book2-cover.svg', alt: 'book2' },
  { src: '/images/content-sample1.svg', alt: 'content1' },
  { src: '/images/content-sample2.svg', alt: 'content2' },
]
