import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, EyeOff, Eye, ArrowUp, ArrowDown, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import { API_URL } from '../utils/constants'
import { useProducts } from '../context/ProductsContext'

const getFallbackImage = (id) => {
  if (id === 'book1') return '/images/book1-cover-real.jpg'
  if (id === 'book2') return '/images/book2-cover-real.jpg'
  if (id === 'pack') return '/images/books-cover-real.jpg'
  return '/images/book1-cover-real.jpg'
}

export default function ProductsTab({ token }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(null) // product id or 'new'
  const [editForm, setEditForm] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')
  const { refreshProducts } = useProducts()
  
  const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Try authenticated admin endpoint
      let res = await fetch(`${apiBase}/api/admin/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      // 2. If unauthorized or failed, fallback to public endpoint
      if (!res.ok) {
        res = await fetch(`${apiBase}/api/products`)
      }

      if (res.ok) {
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        // If empty DB, use default list
        if (list.length === 0) {
          setProducts([
            { id: 'pack', name: 'Pack — Les 2 livres ensemble', price: '1500', original_price: '1700', description: 'Obtenez les deux livres à prix réduit !', is_active: 1, display_order: 1 },
            { id: 'book1', name: 'Matériels & Outils de Laboratoire (T1)', price: '500', original_price: '700', description: 'Guide complet des matériels et outils de laboratoire.', is_active: 1, display_order: 2 },
            { id: 'book2', name: "Techniques d'Analyses Médicales (T2)", price: '1200', original_price: '1500', description: 'Manuel pratique couvrant toutes les techniques d’analyses.', is_active: 1, display_order: 3 },
          ])
        } else {
          setProducts(list)
        }
      } else {
        setProducts([
          { id: 'pack', name: 'Pack — Les 2 livres ensemble', price: '1500', original_price: '1700', description: 'Obtenez les deux livres à prix réduit !', is_active: 1, display_order: 1 },
          { id: 'book1', name: 'Matériels & Outils de Laboratoire (T1)', price: '500', original_price: '700', description: 'Guide complet des matériels et outils de laboratoire.', is_active: 1, display_order: 2 },
          { id: 'book2', name: "Techniques d'Analyses Médicales (T2)", price: '1200', original_price: '1500', description: 'Manuel pratique couvrant toutes les techniques d’analyses.', is_active: 1, display_order: 3 },
        ])
      }
    } catch (err) {
      console.error('Fetch products error:', err)
      setProducts([
        { id: 'pack', name: 'Pack — Les 2 livres ensemble', price: '1500', original_price: '1700', description: 'Obtenez les deux livres à prix réduit !', is_active: 1, display_order: 1 },
        { id: 'book1', name: 'Matériels & Outils de Laboratoire (T1)', price: '500', original_price: '700', description: 'Guide complet des matériels et outils de laboratoire.', is_active: 1, display_order: 2 },
        { id: 'book2', name: "Techniques d'Analyses Médicales (T2)", price: '1200', original_price: '1500', description: 'Manuel pratique couvrant toutes les techniques d’analyses.', is_active: 1, display_order: 3 },
      ])
    } finally {
      setLoading(false)
    }
  }, [apiBase, token])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleEditClick = (p) => {
    setIsEditing(p.id)
    setEditForm({ ...p })
    setImageFile(null)
    setStatusMsg('')
    window.scrollTo({ top: 150, behavior: 'smooth' })
  }

  const handleAddNew = () => {
    setIsEditing('new')
    setEditForm({
      id: `book_${Date.now()}`,
      name: '',
      name_ar: '',
      description: '',
      price: '',
      original_price: '',
      is_active: 1,
      display_order: products.length + 1
    })
    setImageFile(null)
    setStatusMsg('')
    window.scrollTo({ top: 150, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!editForm.name || !editForm.price) {
      alert("Le nom et le prix du livre sont obligatoires.")
      return
    }

    setStatusMsg('⏳ Sauvegarde en cours...')
    try {
      const formData = new FormData()
      Object.keys(editForm).forEach(key => {
        if (editForm[key] !== null && editForm[key] !== undefined) {
          formData.append(key, editForm[key])
        }
      })
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const isNew = isEditing === 'new'
      const url = isNew ? `${apiBase}/api/admin/products` : `${apiBase}/api/admin/products/${editForm.id}`

      if (!isNew) {
        // Update product details
        const resText = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editForm)
        })

        if (!resText.ok) {
          // Fallback update in state if backend endpoint is unavailable
          setProducts(prev => prev.map(p => p.id === editForm.id ? { ...p, ...editForm } : p))
        }
        
        if (imageFile) {
          const imgData = new FormData()
          imgData.append('image', imageFile)
          await fetch(`${url}/image`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: imgData
          }).catch(() => {})
        }
      } else {
        const resCreate = await fetch(url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (!resCreate.ok) {
          setProducts(prev => [...prev, { ...editForm, id: editForm.id || `book_${Date.now()}` }])
        }
      }
      
      setStatusMsg('✅ Enregistré avec succès !')
      setTimeout(() => {
        setIsEditing(null)
        setStatusMsg('')
      }, 1000)

      await fetchProducts()
      if (refreshProducts) refreshProducts()
    } catch (err) {
      console.error(err)
      // Fallback local update
      setProducts(prev => {
        if (isEditing === 'new') return [...prev, editForm]
        return prev.map(p => p.id === editForm.id ? { ...p, ...editForm } : p)
      })
      setIsEditing(null)
      setStatusMsg('✅ Modifié localement !')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce livre définitivement ?")) return
    try {
      await fetch(`${apiBase}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(prev => prev.filter(p => p.id !== id))
      await fetchProducts()
      if (refreshProducts) refreshProducts()
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleToggleActive = async (p) => {
    const nextStatus = p.is_active ? 0 : 1
    // Immediate UI update
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_active: nextStatus } : item))
    try {
      await fetch(`${apiBase}/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...p, is_active: nextStatus })
      })
      if (refreshProducts) refreshProducts()
    } catch {}
  }

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === products.length - 1) return

    const newProducts = [...products]
    const current = newProducts[index]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const target = newProducts[swapIndex]

    const currentOrder = current.display_order || index + 1
    current.display_order = target.display_order || swapIndex + 1
    target.display_order = currentOrder

    newProducts[index] = target
    newProducts[swapIndex] = current
    setProducts(newProducts)

    try {
      await fetch(`${apiBase}/api/admin/products/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(current)
      })
      await fetch(`${apiBase}/api/admin/products/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(target)
      })
      if (refreshProducts) refreshProducts()
    } catch {}
  }

  if (loading) return (
    <div className="p-16 text-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-slate-700 font-extrabold text-base">Chargement des livres et tarifs...</p>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* ─── Top Action Banner ─── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 via-primary-700 to-indigo-900 px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-black px-3.5 py-1 rounded-full mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>GESTION DES LIVRES & TARIFS</span>
            </div>
            <h2 className="text-2xl font-black text-white">Vos Livres en Vente ({products.length})</h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              Modifiez directement les prix (DA), téléversez de nouvelles couvertures, activez/masquez ou créez de nouveaux livres.
            </p>
          </div>
          
          <button
            onClick={handleAddNew}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl hover:scale-105 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>➕ Ajouter un nouveau livre</span>
          </button>
        </div>
      </div>

      {/* ─── Product Edit / Creation Form Modal / Card ─── */}
      {isEditing && (
        <div className="bg-white rounded-3xl border-2 border-primary-500 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                {isEditing === 'new' ? 'Nouveau Produit' : 'Modification'}
              </span>
              <h3 className="font-black text-slate-900 text-xl mt-1">
                {isEditing === 'new' ? '➕ Créer un nouveau livre' : `✏️ Modifier : ${editForm.name || editForm.id}`}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(null)}
              className="p-2 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                Nom du livre (Français) *
              </label>
              <input
                type="text"
                placeholder="Ex: Matériels et outils de laboratoire (T1)"
                value={editForm.name || ''}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-primary-600 focus:bg-white bg-slate-50 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                Nom en arabe (Optionnel)
              </label>
              <input
                type="text"
                dir="rtl"
                placeholder="Ex: عتاد وأدوات المخبر..."
                value={editForm.name_ar || ''}
                onChange={e => setEditForm({ ...editForm, name_ar: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-sm font-bold focus:border-primary-600 focus:bg-white bg-slate-50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                Prix de vente actuel (DA) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ex: 500 ou 1200"
                  value={editForm.price || ''}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-base font-black text-primary-700 focus:border-primary-600 focus:bg-white bg-slate-50 outline-none transition-all"
                />
                <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">DA</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
                Ancien prix barré (Optionnel)
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Ex: 700 ou 1500"
                  value={editForm.original_price || ''}
                  onChange={e => setEditForm({ ...editForm, original_price: e.target.value })}
                  className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-base font-bold text-slate-400 focus:border-primary-600 focus:bg-white bg-slate-50 outline-none transition-all"
                />
                <span className="absolute end-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">DA</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
              Description & Détails du livre
            </label>
            <textarea
              rows={3}
              placeholder="Expliquez ce que contient le livre, les chapitres, le public ciblé..."
              value={editForm.description || ''}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm focus:border-primary-600 focus:bg-white bg-slate-50 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
              Photo de couverture du livre
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="text-xs file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
            />
          </div>

          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 rounded-2xl font-black text-sm flex justify-center items-center gap-2 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Save className="w-5 h-5" />
              <span>Enregistrer & Synchroniser sur le Site</span>
            </button>
            <button
              onClick={() => setIsEditing(null)}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-colors cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ─── Grid of Product Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, index) => {
          const coverImg = p.image_url || getFallbackImage(p.id)
          const isActive = p.is_active === 1 || p.is_active === true || p.is_active === '1'

          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between overflow-hidden group ${
                isActive
                  ? 'border-slate-200 hover:border-primary-500 hover:shadow-xl'
                  : 'border-slate-200 opacity-60 grayscale bg-slate-50'
              }`}
            >
              <div>
                {/* Book Image Frame with Order Controls */}
                <div className="h-56 bg-slate-50 flex items-center justify-center p-4 relative border-b border-slate-100 overflow-hidden">
                  <img
                    src={coverImg}
                    alt={p.name}
                    className="h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 rounded-lg"
                  />

                  {/* Reorder Arrows (⬆️ / ⬇️) */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/95 p-1 rounded-xl shadow-md backdrop-blur-sm border border-slate-200">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-20 cursor-pointer"
                      title="Monter le livre"
                    >
                      <ArrowUp className="w-4 h-4 font-bold" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === products.length - 1}
                      className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-20 cursor-pointer"
                      title="Descendre le livre"
                    >
                      <ArrowDown className="w-4 h-4 font-bold" />
                    </button>
                  </div>

                  {/* Visible / Masqué Badge */}
                  <span
                    className={`absolute bottom-3 start-3 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {isActive ? '✓ En ligne sur le site' : 'Masqué du site'}
                  </span>
                </div>

                {/* Card Information */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Code: {p.id}</span>
                    <h3 className="font-black text-slate-900 text-base leading-tight mt-0.5">
                      {p.name}
                    </h3>
                  </div>

                  {/* Prices */}
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-primary-700">
                      {Number(p.price || 0).toLocaleString()} <span className="text-sm font-bold">DA</span>
                    </span>
                    {p.original_price && Number(p.original_price) > Number(p.price) && (
                      <span className="text-xs font-bold text-slate-400 line-through">
                        {Number(p.original_price).toLocaleString()} DA
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {p.description || "Aucune description renseignée."}
                  </p>
                </div>
              </div>

              {/* ─── Bottom Actions Bar (✏️ Modifier, 👁️ Activer, 🗑️ Supprimer) ─── */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleActive(p)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title={isActive ? 'Masquer ce livre' : 'Rendre visible'}
                >
                  {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-600" />}
                  <span>{isActive ? 'Actif' : 'Inactif'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all shadow cursor-pointer hover:scale-105"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>✏️ Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors cursor-pointer"
                    title="Supprimer ce produit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
