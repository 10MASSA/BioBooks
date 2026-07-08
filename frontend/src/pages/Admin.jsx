import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LogOut, Download, Trash2, RefreshCw, Lock, Package, Bell, X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../utils/constants'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const playTone = (freq, startTime, duration) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }
    const now = audioCtx.currentTime
    playTone(523.25, now, 0.15) // C5
    playTone(659.25, now + 0.12, 0.3) // E5
  } catch (error) {
    console.error('Failed to play sound:', error)
  }
}

import ProductsTab from '../components/ProductsTab'
import CmsTab from '../components/CmsTab'

export default function Admin() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('orders')
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [newOrderToast, setNewOrderToast] = useState('')
  const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

  const fetchOrders = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        localStorage.removeItem('admin_token')
        setToken('')
        return
      }
      const data = await res.json()
      
      setOrders((prevOrders) => {
        if (prevOrders.length > 0 && data.length > prevOrders.length) {
          const diff = data.length - prevOrders.length
          playNotificationSound()
          setNewOrderToast(`${diff} nouvelle(s) commande(s) reçue(s) !`)
        }
        return data
      })
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchOrders()
  }, [token, fetchOrders])

  // Polling for new orders every 15 seconds
  useEffect(() => {
    if (!token) return
    const interval = setInterval(() => {
      fetchOrders()
    }, 15000)
    return () => clearInterval(interval)
  }, [token, fetchOrders])

  // Clear toast after 5 seconds
  useEffect(() => {
    if (newOrderToast) {
      const timer = setTimeout(() => {
        setNewOrderToast('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [newOrderToast])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setLoginError(t('admin.invalidPassword'))
        return
      }
      const { token: newToken } = await res.json()
      localStorage.setItem('admin_token', newToken)
      setToken(newToken)
    } catch {
      setLoginError(t('admin.invalidPassword'))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
    setOrders([])
  }

  const updateStatus = async (id, status) => {
    await fetch(`${apiBase}/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  const deleteOrder = async (id) => {
    if (!confirm(t('admin.confirmDelete'))) return
    await fetch(`${apiBase}/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchOrders()
  }

  const exportExcel = () => {
    window.open(`${apiBase}/api/admin/orders/export?token=${token}`, '_blank')
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            {t('admin.title')}
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('admin.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none"
              required
            />
          </div>
          {loginError && (
            <p className="text-red-500 text-sm mb-4">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            {t('admin.loginBtn')}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <AnimatePresence>
        {newOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-green-500"
          >
            <Bell className="w-6 h-6 animate-bounce shrink-0" />
            <span>{newOrderToast}</span>
            <button 
              onClick={() => setNewOrderToast('')} 
              className="hover:bg-white/10 p-1 rounded-lg transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">{t('admin.title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              {t('admin.export')}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              {t('admin.logout')}
            </button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 mt-4 flex gap-4 border-b">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-2 px-2 font-bold text-sm transition-colors ${activeTab === 'orders' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📦 Commandes
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-2 px-2 font-bold text-sm transition-colors ${activeTab === 'products' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🏷️ Produits
          </button>
          <button 
            onClick={() => setActiveTab('cms')}
            className={`pb-2 px-2 font-bold text-sm transition-colors ${activeTab === 'cms' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🌐 Contenu du Site
          </button>
        </div>
      </header>

      {activeTab === 'orders' ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t('admin.orders')} ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center text-gray-500">
            {t('admin.noOrders')}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['id', 'name', 'phone', 'product', 'wilaya', 'commune', 'quantity', 'total', 'status', 'date', 'actions'].map((col) => (
                      <th key={col} className="px-4 py-3 text-start font-semibold text-gray-600 whitespace-nowrap">
                        {t(`admin.columns.${col}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">#{order.id}</td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {order.first_name} {order.last_name}
                      </td>
                      <td className="px-4 py-3 dir-ltr whitespace-nowrap">{order.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs max-w-[140px] truncate" title={order.product_name}>
                        {order.product_name || order.product_type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{order.wilaya}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{order.commune}</td>
                      <td className="px-4 py-3 text-center">{order.quantity}</td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">{order.total} DA</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{t(`admin.status.${s}`)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      ) : activeTab === 'products' ? (
        <main className="max-w-7xl mx-auto py-4">
          <ProductsTab token={token} />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto py-4">
          <CmsTab token={token} />
        </main>
      )}
    </div>
  )
}
