import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBERS, MESSENGER_LINK } from '../utils/constants'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-gray-600 text-lg">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHATSAPP_NUMBERS.map((wa, i) => (
            <motion.a
              key={wa.number}
              href={wa.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="flex flex-col items-center gap-4 p-8 bg-green-50 border-2 border-green-200 rounded-2xl hover:bg-green-100 transition-colors"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{t('contact.whatsapp')}</p>
                <p className="text-green-700 font-semibold text-lg dir-ltr">{wa.number}</p>
              </div>
              <span className="text-sm text-green-600 font-medium">{t('contact.chatNow')}</span>
            </motion.a>
          ))}

          <motion.a
            href={MESSENGER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center gap-4 p-8 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors"
          >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">{t('contact.messenger')}</p>
              <p className="text-blue-700 font-semibold">Facebook</p>
            </div>
            <span className="text-sm text-blue-600 font-medium">{t('contact.chatNow')}</span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
