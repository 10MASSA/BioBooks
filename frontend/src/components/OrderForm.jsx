import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Banknote, Loader2 } from 'lucide-react'
import { DELIVERY_FEE, getProductPrice } from '../utils/constants'
import { WILAYAS_DATA } from '../utils/wilayas_data'
import ProductSelector from './ProductSelector'

export default function OrderForm() {
  const { t, i18n } = useTranslation()
  const [productId, setProductId] = useState('pack')
  const [quantity, setQuantity] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderData, setOrderData] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm()

  const selectedWilayaCode = watch('wilaya')
  const currentLang = i18n.language || 'fr'

  const selectedWilayaObj = WILAYAS_DATA.find((w) => w.code === selectedWilayaCode)
  const communesList = selectedWilayaObj ? selectedWilayaObj.communes : []

  const unitPrice = getProductPrice(productId)
  const subtotal = unitPrice * quantity
  const total = subtotal + DELIVERY_FEE

  const onSubmit = async (data) => {
    setSubmitting(true)

    const selectedWilaya = WILAYAS_DATA.find((w) => w.code === data.wilaya)
    const wilayaName = selectedWilaya
      ? currentLang === 'ar'
        ? selectedWilaya.ar
        : currentLang === 'en'
          ? selectedWilaya.en
          : selectedWilaya.fr
      : data.wilaya

    const order = {
      ...data,
      wilaya: wilayaName,
      product_type: productId,
      product_name: t(`products.${productId}.name`),
      quantity,
      unit_price: unitPrice,
      subtotal,
      delivery_fee: DELIVERY_FEE,
      total,
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })

      if (!res.ok) throw new Error('Failed')

      const result = await res.json()
      setOrderData({ ...order, id: result.id })
      setSubmitted(true)
      reset()
    } catch {
      setOrderData(order)
      setSubmitted(true)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none ${
      hasError
        ? 'border-red-400 bg-red-50 focus:border-red-500'
        : 'border-gray-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
    }`

  if (submitted) {
    return (
      <>
        <ProductSelector
          productId={productId}
          setProductId={setProductId}
          quantity={quantity}
          setQuantity={setQuantity}
        />
        <section id="order" className="py-20 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('order.success.title')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('order.success.message', {
                  name: `${orderData?.first_name} ${orderData?.last_name}`,
                  product: orderData?.product_name,
                  qty: orderData?.quantity,
                  phone: orderData?.phone,
                })}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setOrderData(null)
                  setQuantity(1)
                  setProductId('pack')
                }}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                {t('order.success.newOrder')}
              </button>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <ProductSelector
        productId={productId}
        setProductId={setProductId}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <section id="order" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('order.title')}
            </h2>
            <p className="text-gray-600">{t('order.subtitle')}</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('order.firstName')} *
                </label>
                <input
                  {...register('first_name', { required: t('order.required') })}
                  className={inputClass(errors.first_name)}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('order.lastName')} *
                </label>
                <input
                  {...register('last_name', { required: t('order.required') })}
                  className={inputClass(errors.last_name)}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('order.phone')} *
              </label>
              <input
                type="tel"
                {...register('phone', {
                  required: t('order.required'),
                  pattern: {
                    value: /^0[5-7][0-9]{8}$/,
                    message: t('order.invalidPhone'),
                  },
                })}
                placeholder="05XX XX XX XX"
                className={inputClass(errors.phone)}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('order.wilaya')} *
                </label>
                <select
                  {...register('wilaya', { required: t('order.required') })}
                  className={inputClass(errors.wilaya)}
                  onChange={(e) => {
                    register('wilaya').onChange(e)
                    setValue('commune', '')
                  }}
                >
                  <option value="">{t('order.selectWilaya')}</option>
                  {WILAYAS_DATA.map((w) => {
                    const localizedWilayaName =
                      currentLang === 'ar' ? w.ar : currentLang === 'en' ? w.en : w.fr
                    return (
                      <option key={w.code} value={w.code}>
                        {w.code} - {localizedWilayaName}
                      </option>
                    )
                  })}
                </select>
                {errors.wilaya && (
                  <p className="text-red-500 text-sm mt-1">{errors.wilaya.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('order.commune')} *
                </label>
                <select
                  {...register('commune', { required: t('order.required') })}
                  disabled={!selectedWilayaCode}
                  className={inputClass(errors.commune)}
                >
                  <option value="">
                    {selectedWilayaCode
                      ? t('order.selectCommune')
                      : t('order.selectWilayaFirst')}
                  </option>
                  {communesList.map((c, idx) => {
                    const localizedCommName =
                      currentLang === 'ar' ? c.ar : currentLang === 'en' ? c.en : c.fr
                    return (
                      <option key={idx} value={localizedCommName}>
                        {localizedCommName}
                      </option>
                    )
                  })}
                </select>
                {errors.commune && (
                  <p className="text-red-500 text-sm mt-1">{errors.commune.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('order.address')} *
              </label>
              <textarea
                rows={3}
                {...register('address', { required: t('order.required') })}
                className={inputClass(errors.address)}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="bg-primary-50 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>{t('order.product')}</span>
                <span className="font-semibold text-end max-w-[60%]">
                  {t(`products.${productId}.name`)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t('order.quantity')}</span>
                <span className="font-semibold">{quantity} × {unitPrice} DA</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t('order.subtotal')}</span>
                <span className="font-semibold">{subtotal} DA</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t('order.delivery')}</span>
                <span className="font-semibold">{DELIVERY_FEE} DA</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary-700 pt-3 border-t border-primary-200">
                <span>{t('order.total')}</span>
                <span>{total} DA</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <Banknote className="w-6 h-6 text-green-600 shrink-0" />
              <span className="text-green-800 font-medium">✓ {t('order.payment')}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('order.submitting')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('order.submit')}
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  )
}
