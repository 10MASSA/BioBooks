import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LogOut, Download, Trash2, RefreshCw, Lock, Package,
  Bell, X, ShoppingBag, Settings, Globe, TrendingUp,
  CheckCircle2, Clock, Truck, XCircle, AlertCircle, Eye,
  ChevronDown, Search, BookOpen
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../utils/constants'
import ProductsTab from '../components/ProductsTab'
import CmsTab from '../components/CmsTab'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_CONFIG = {
  pending:   { label: 'En attente',  color: 'bg-amber-100 text-amber-800 border-amber-200',   icon: Clock },
  confirmed: { label: 'Confirmée',   color: 'bg-blue-100 text-blue-800 border-blue-200',       icon: CheckCircle2 },
  shipped:   { label: 'Expédiée',    color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck },
  delivered: { label: 'Livrée',      color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'Annulée',     color: 'bg-red-100 text-red-800 border-red-200',          icon: XCircle },
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
    playTone(523.25, now, 0.15)
    playTone(659.25, now + 0.12, 0.3)
  } catch (error) {
    console.error('Failed to play sound:', error)
  }
}

export default function Admin() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('orders')
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [newOrderToast, setNewOrderToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
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
      if (!res.ok) {
        setOrders((prev) => (Array.isArray(prev) ? prev : []))
        return
      }
      const data = await res.json()
      const validData = Array.isArray(data) ? data : []
      setOrders((prevOrders) => {
        const safePrev = Array.isArray(prevOrders) ? prevOrders : []
        if (safePrev.length > 0 && validData.length > safePrev.length) {
          const diff = validData.length - safePrev.length
          playNotificationSound()
          setNewOrderToast(`🛒 ${diff} nouvelle(s) commande(s) reçue(s) !`)
        }
        return validData
      })
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [token, apiBase])

  useEffect(() => { if (token) fetchOrders() }, [token, fetchOrders])

  useEffect(() => {
    if (!token) return
    const interval = setInterval(() => fetchOrders(), 15000)
    return () => clearInterval(interval)
  }, [token, fetchOrders])

  useEffect(() => {
    if (newOrderToast) {
      const timer = setTimeout(() => setNewOrderToast(''), 5000)
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
        body: JSON.stringify({ password: (password || '').trim() }),
      })
      if (res.status === 401) { setLoginError('Mot de passe incorrect'); return }
      if (!res.ok) { setLoginError(`Erreur serveur (${res.status}). Réessayez.`); return }
      const { token: newToken } = await res.json()
      localStorage.setItem('admin_token', newToken)
      setToken(newToken)
    } catch {
      setLoginError('Impossible de contacter le serveur.')
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
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  const deleteOrder = async (id) => {
    if (!confirm('Supprimer cette commande définitivement ?')) return
    await fetch(`${apiBase}/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchOrders()
  }

  const exportExcel = () => {
    window.open(`${apiBase}/api/admin/orders/export?token=${token}`, '_blank')
  }

  // Stats calculation
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + Number(o.total || 0), 0),
  }

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = !searchQuery || 
      `${o.first_name} ${o.last_name} ${o.phone} ${o.wilaya}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // ─── LOGIN PAGE ───
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-primary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10 w-full max-w-md"
        >
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Espace Administrateur</h1>
            <p className="text-slate-500 text-sm mt-1">Bio Books — Tableau de bord</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-10 pe-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary-600/25 hover:scale-[1.02] cursor-pointer"
            >
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // ─── DASHBOARD ───
  return (
    <div className="min-h-screen bg-slate-100">

      {/* New Order Toast */}
      <AnimatePresence>
        {newOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-emerald-500 text-sm"
          >
            <Bell className="w-5 h-5 animate-bounce shrink-0" />
            <span>{newOrderToast}</span>
            <button onClick={() => setNewOrderToast('')} className="hover:bg-white/10 p-1 rounded-lg ml-2 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header ── */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-slate-900 text-base leading-none block">Bio Books</span>
                <span className="text-xs text-slate-500 font-medium">Administration</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                title="Rafraîchir"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-600' : ''}`} />
              </button>
              <button
                onClick={exportExcel}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-xs font-bold shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exporter Excel
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 pt-1 overflow-x-auto">
            {[
              { id: 'orders',   label: 'Commandes',       icon: ShoppingBag, count: stats.total },
              { id: 'products', label: 'Produits',         icon: Package },
              { id: 'cms',      label: "Contenu du Site",  icon: Globe },
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Commandes', value: stats.total, icon: ShoppingBag, color: 'text-primary-700', bg: 'bg-primary-50 border-primary-200' },
                { label: 'En Attente',      value: stats.pending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
                { label: 'Livrées',         value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
                { label: 'Chiffre d\'affaires', value: `${stats.revenue.toLocaleString()} DA`, icon: TrendingUp, color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className={`bg-white rounded-2xl border ${stat.bg} p-4 flex items-center gap-3 shadow-sm`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone, wilaya..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto ps-3 pe-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-500 appearance-none font-medium cursor-pointer"
                >
                  <option value="all">Tous les statuts</option>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button
                onClick={exportExcel}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>

            {/* Orders Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Aucune commande trouvée</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {['N°', 'Client', 'Téléphone', 'Produit', 'Qté', 'Total', 'Wilaya', 'Statut', 'Date', ''].map((col) => (
                            <th key={col} className="px-4 py-3 text-start text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map((order) => {
                          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                          return (
                            <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3.5 font-mono text-xs text-slate-400">#{order.id}</td>
                              <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                                {order.first_name} {order.last_name}
                              </td>
                              <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap font-medium" dir="ltr">
                                {order.phone}
                              </td>
                              <td className="px-4 py-3.5 max-w-[160px]">
                                <span className="block text-xs font-semibold text-slate-800 truncate" title={order.product_name}>
                                  {order.product_name || order.product_type}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-center font-bold text-slate-800">{order.quantity}</td>
                              <td className="px-4 py-3.5 font-extrabold text-primary-700 whitespace-nowrap">{Number(order.total || 0).toLocaleString()} DA</td>
                              <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap text-xs">{order.wilaya}</td>
                              <td className="px-4 py-3.5">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateStatus(order.id, e.target.value)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer outline-none ${cfg.color}`}
                                >
                                  {STATUSES.map((s) => (
                                    <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap text-xs">
                                {new Date(order.created_at).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' })}
                              </td>
                              <td className="px-4 py-3.5">
                                <button
                                  onClick={() => deleteOrder(order.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {filteredOrders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                    return (
                      <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="font-black text-slate-900">{order.first_name} {order.last_name}</span>
                            <span className="block text-xs text-slate-400 font-mono mt-0.5">#{order.id} · {new Date(order.created_at).toLocaleDateString('fr-DZ')}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${cfg.color}`}>{cfg.label}</span>
                        </div>
                        <div className="space-y-1.5 text-sm mb-3">
                          <div className="flex justify-between"><span className="text-slate-500">Tél :</span><span className="font-semibold" dir="ltr">{order.phone}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Produit :</span><span className="font-semibold text-end max-w-[60%] truncate">{order.product_name || order.product_type}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Qté :</span><span className="font-semibold">{order.quantity}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Total :</span><span className="font-extrabold text-primary-700">{Number(order.total || 0).toLocaleString()} DA</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Wilaya :</span><span className="font-semibold">{order.wilaya}</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`flex-1 px-2.5 py-2 rounded-xl text-xs font-bold border cursor-pointer outline-none ${cfg.color}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <ProductsTab token={token} />
        )}

        {/* CMS TAB */}
        {activeTab === 'cms' && (
          <CmsTab token={token} />
        )}

      </main>
    </div>
  )
}
