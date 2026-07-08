import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, Edit2, X, Upload, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../utils/constants'
import { getStoredGalleryItems, saveGalleryItems, getStoredTestimonials, saveTestimonials } from '../utils/cmsStorage'

const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

// =================== FAQ TAB ===================
function FaqAdmin({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ question_fr: '', answer_fr: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`${apiBase}/api/admin/cms/faq`, { headers })
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }, [token])

  useEffect(() => { fetch_() }, [fetch_])

  const save = async () => {
    if (!form.question_fr || !form.answer_fr) return
    setSaving(true)
    setMsg('')
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `${apiBase}/api/admin/cms/faq/${editId}` : `${apiBase}/api/admin/cms/faq`
    await fetch(url, { method, headers, body: JSON.stringify({ ...form, display_order: 0 }) })
    setMsg('✅ Sauvegardé avec traduction automatique')
    setForm({ question_fr: '', answer_fr: '' })
    setEditId(null)
    fetch_()
    setSaving(false)
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer cette question ?')) return
    await fetch(`${apiBase}/api/admin/cms/faq/${id}`, { method: 'DELETE', headers })
    fetch_()
  }

  const edit = (item) => {
    setEditId(item.id)
    setForm({ question_fr: item.question_fr, answer_fr: item.answer_fr })
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">{editId ? '✏️ Modifier la question' : '➕ Ajouter une question'}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Question (en français)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none"
              placeholder="Ex: Comment payer ?"
              value={form.question_fr}
              onChange={e => setForm(f => ({ ...f, question_fr: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Réponse (en français)</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none resize-none"
              placeholder="Réponse complète..."
              value={form.answer_fr}
              onChange={e => setForm(f => ({ ...f, answer_fr: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !form.question_fr || !form.answer_fr}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-sm transition-colors"
            >
              {saving ? '⏳ Traduction...' : <><Save className="w-4 h-4" /> Sauvegarder</>}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ question_fr: '', answer_fr: '' }) }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600 transition-colors">
                <X className="w-4 h-4" /> Annuler
              </button>
            )}
          </div>
          {msg && <p className="text-green-600 text-sm font-medium">{msg}</p>}
        </div>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-400 py-4">Chargement...</p>}
        {items.length === 0 && !loading && <p className="text-center text-gray-400 py-8">Aucune question. Ajoutez-en une ci-dessus.</p>}
        {items.map(item => (
          <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm mb-1">❓ {item.question_fr}</p>
              <p className="text-gray-500 text-xs line-clamp-2">{item.answer_fr}</p>
              {item.question_en && <p className="text-blue-400 text-xs mt-1 italic">EN: {item.question_en}</p>}
              {item.question_ar && <p className="text-purple-400 text-xs mt-0.5 italic">AR: {item.question_ar}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => edit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => del(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// =================== FEATURES TAB ===================
function FeaturesAdmin({ token }) {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ product_id: '', text_fr: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // Load products dynamically
  useEffect(() => {
    fetch(`${apiBase}/api/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        if (data.length > 0 && !form.product_id) {
          setForm(f => ({ ...f, product_id: data[0].id }))
        }
      })
      .catch(() => {})
  }, [token])

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`${apiBase}/api/admin/cms/features`, { headers })
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }, [token])

  useEffect(() => { fetch_() }, [fetch_])

  const save = async () => {
    if (!form.text_fr || !form.product_id) return
    setSaving(true)
    setMsg('')
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `${apiBase}/api/admin/cms/features/${editId}` : `${apiBase}/api/admin/cms/features`
    await fetch(url, { method, headers, body: JSON.stringify({ ...form, display_order: 0 }) })
    setMsg('✅ Sauvegardé avec traduction automatique')
    setForm(f => ({ ...f, text_fr: '' }))
    setEditId(null)
    fetch_()
    setSaving(false)
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer cette ligne ?')) return
    await fetch(`${apiBase}/api/admin/cms/features/${id}`, { method: 'DELETE', headers })
    fetch_()
  }

  const edit = (item) => {
    setEditId(item.id)
    setForm({ product_id: item.product_id, text_fr: item.text_fr })
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Group features by product_id dynamically
  const grouped = {}
  items.forEach(item => {
    if (!grouped[item.product_id]) grouped[item.product_id] = []
    grouped[item.product_id].push(item)
  })

  const getProductName = (pid) => {
    const p = products.find(p => p.id === pid)
    return p ? p.name : pid
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">{editId ? '✏️ Modifier un avantage' : '➕ Ajouter un avantage'}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Produit concerné</label>
            <select
              className="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:ring-2 focus:ring-primary-300 outline-none"
              value={form.product_id}
              onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              {products.length === 0 && <option value="">Chargement...</option>}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Texte de l'avantage (en français)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none"
              placeholder="Ex: Guide complet du matériel de laboratoire"
              value={form.text_fr}
              onChange={e => setForm(f => ({ ...f, text_fr: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !form.text_fr || !form.product_id}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-sm transition-colors">
              {saving ? '⏳ Traduction...' : <><Save className="w-4 h-4" /> Sauvegarder</>}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(f => ({ ...f, text_fr: '' })) }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600 transition-colors">
                <X className="w-4 h-4" /> Annuler
              </button>
            )}
          </div>
          {msg && <p className="text-green-600 text-sm font-medium">{msg}</p>}
        </div>
      </div>

      {Object.entries(grouped).map(([pid, feats]) => (
        <div key={pid}>
          <h4 className="font-bold text-gray-700 mb-2">📦 {getProductName(pid)} ({feats.length})</h4>
          <div className="space-y-2">
            {feats.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm">✅ {item.text_fr}</p>
                  {item.text_en && <p className="text-blue-400 text-xs italic">EN: {item.text_en}</p>}
                  {item.text_ar && <p className="text-purple-400 text-xs italic">AR: {item.text_ar}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => edit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => del(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      {Object.keys(grouped).length === 0 && !loading && (
        <p className="text-center text-gray-400 py-8">Aucun avantage. Ajoutez-en un ci-dessus.</p>
      )}
    </div>
  )
}

// =================== GALLERY TAB ===================
function GalleryAdmin({ token }) {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [albumId, setAlbumId] = useState('')
  const [altFr, setAltFr] = useState('')
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editItem, setEditItem] = useState(null) // item being edited
  const [editAlt, setEditAlt] = useState('')
  const [editFile, setEditFile] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }
  const jsonHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    fetch(`${apiBase}/api/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setAlbumId(prev => prev || 'hero')
      })
      .catch(() => {})
  }, [token])

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/admin/cms/gallery`, { headers })
      if (!res.ok) throw new Error('gallery fetch failed')
      const data = await res.json()
      const galleryItems = Array.isArray(data) && data.length > 0 ? data : getStoredGalleryItems()
      setItems(galleryItems)
      saveGalleryItems(galleryItems)
    } catch (err) {
      const fallbackItems = getStoredGalleryItems()
      setItems(fallbackItems)
      saveGalleryItems(fallbackItems)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetch_() }, [fetch_])

  const upload = async () => {
    if (!file || !albumId) return
    setSaving(true)
    setMsg('')
    const fd = new FormData()
    fd.append('image', file)
    fd.append('album_id', albumId)
    fd.append('alt_fr', altFr)
    fd.append('display_order', 0)
    await fetch(`${apiBase}/api/admin/cms/gallery`, { method: 'POST', headers, body: fd })
    setMsg('✅ Image ajoutée')
    setFile(null)
    setAltFr('')
    fetch_()
    setSaving(false)
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return
    await fetch(`${apiBase}/api/admin/cms/gallery/${id}`, { method: 'DELETE', headers })
    fetch_()
  }

  const saveEdit = async () => {
    if (!editItem) return
    setSaving(true)
    const formData = new FormData()
    formData.append('alt_fr', editAlt)
    if (editFile) formData.append('image', editFile)
    await fetch(`${apiBase}/api/admin/cms/gallery/${editItem.id}`, {
      method: 'PUT', headers, body: formData
    })
    setEditItem(null)
    setEditAlt('')
    setEditFile(null)
    fetch_()
    setSaving(false)
  }

  // Group by album_id dynamically
  const grouped = {}
  items.forEach(img => {
    if (!grouped[img.album_id]) grouped[img.album_id] = []
    grouped[img.album_id].push(img)
  })

  const allAlbums = ['hero', ...products.map(p => p.id)].filter((id, index, arr) => arr.indexOf(id) === index)

  const getAlbumLabel = (pid) => {
    if (pid === 'hero') return 'Première page d’accueil'
    const p = products.find(p => p.id === pid)
    return p ? p.name : pid
  }

  return (
    <div className="space-y-6">
      {/* Edit modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setEditItem(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-gray-800 mb-4">✏️ Modifier la description</h3>
              <img src={editItem.image_url} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />
              <label className="text-sm font-semibold text-gray-600 block mb-1">Description (fr)</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 mb-4 focus:ring-2 focus:ring-primary-300 outline-none"
                value={editAlt}
                onChange={e => setEditAlt(e.target.value)}
              />
              <label className="text-sm font-semibold text-gray-600 block mb-1">Remplacer l'image (optionnel)</label>
              <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors mb-4">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">{editFile ? editFile.name : 'Choisir une nouvelle image...'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setEditFile(e.target.files[0])} />
              </label>
              <div className="flex gap-3">
                <button onClick={saveEdit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold text-sm">
                  <Save className="w-4 h-4" /> Sauvegarder
                </button>
                <button onClick={() => setEditItem(null)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">📸 Ajouter une image à la galerie</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Album</label>
            <select className="border border-gray-200 rounded-xl px-4 py-2.5 w-full focus:ring-2 focus:ring-primary-300 outline-none"
              value={albumId} onChange={e => setAlbumId(e.target.value)}>
              <option value="hero">🏠 Première page d’accueil</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
              {products.length === 0 && <option value="">Chargement...</option>}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Description de l'image (fr)</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none"
              placeholder="Ex: Pipette et matériel de prélèvement"
              value={altFr} onChange={e => setAltFr(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Image</label>
            <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">{file ? file.name : 'Sélectionner une image...'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
          <button onClick={upload} disabled={saving || !file || !albumId}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-sm transition-colors">
            {saving ? '⏳ Upload...' : <><Upload className="w-4 h-4" /> Uploader</>}
          </button>
          {msg && <p className="text-green-600 text-sm font-medium">{msg}</p>}
        </div>
      </div>

      {allAlbums.length > 0 ? allAlbums.map(pid => {
        const imgs = grouped[pid] || []
        return (
          <div key={pid}>
            <h4 className="font-bold text-gray-700 mb-3">📦 {getAlbumLabel(pid)} ({imgs.length} images)</h4>
            {imgs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                Aucune image pour ce livre. Ajoutez-en une depuis le formulaire ci-dessus.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imgs.map(img => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                    <img src={img.image_url} alt={img.alt_fr} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => { setEditItem(img); setEditAlt(img.alt_fr || ''); setEditFile(null) }}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => del(img.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">{img.alt_fr || 'Sans description'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }) : null}
      {Object.keys(grouped).length === 0 && !loading && (
        <p className="text-center text-gray-400 py-8">Aucune image dans la galerie. Ajoutez-en une ci-dessus.</p>
      )}
    </div>
  )
}

// =================== TESTIMONIALS TAB ===================
function FeedbackAdmin({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', text_fr: '', rating: 5 })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/admin/cms/testimonials`, { headers })
      if (!res.ok) throw new Error('testimonials fetch failed')
      const data = await res.json()
      const testimonials = Array.isArray(data) && data.length > 0 ? data : getStoredTestimonials()
      setItems(testimonials)
      saveTestimonials(testimonials)
    } catch (e) {
      const fallbackItems = getStoredTestimonials()
      setItems(fallbackItems)
      saveTestimonials(fallbackItems)
    }
    setLoading(false)
  }, [token])

  useEffect(() => { fetch_() }, [fetch_])

  const save = async () => {
    if (!form.name || !form.text_fr) return
    setSaving(true)
    setMsg('')

    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `${apiBase}/api/admin/cms/testimonials/${editId}` : `${apiBase}/api/admin/cms/testimonials`
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('text_fr', form.text_fr)
    formData.append('rating', String(form.rating || 5))
    formData.append('display_order', '0')
    if (imageFile) formData.append('image', imageFile)

    try {
      const res = await fetch(url, { method, headers, body: formData })
      if (!res.ok) throw new Error('save failed')
      setMsg('✅ Sauvegardé avec traduction automatique')
    } catch (e) {
      setMsg('⚠️ Enregistré localement')
    } finally {
      setForm({ name: '', text_fr: '', rating: 5 })
      setEditId(null)
      setImageFile(null)
      setSaving(false)
      fetch_()
    }
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return
    const nextItems = items.filter(item => item.id !== id)
    setItems(nextItems)
    saveTestimonials(nextItems)

    try {
      const res = await fetch(`${apiBase}/api/admin/cms/testimonials/${id}`, { method: 'DELETE', headers })
      if (!res.ok) throw new Error('delete failed')
    } catch (e) {
      setMsg('⚠️ Suppression enregistrée localement')
    }
  }

  const edit = (item) => {
    setEditId(item.id)
    setForm({ name: item.name, text_fr: item.text_fr, rating: item.rating || 5 })
    setImageFile(null)
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-blue-700 text-sm">
        💡 Les avis ajoutés ici remplacent les avis hardcodés. Écrivez en français, la traduction est automatique.
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">{editId ? '✏️ Modifier l\'avis' : '➕ Ajouter un avis client'}</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Nom du client</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none"
              placeholder="Ex: Étudiante en Biochimie"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Texte de l'avis (en français)</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none resize-none"
              placeholder="Ex: J'ai vraiment adoré ce livre !"
              value={form.text_fr}
              onChange={e => setForm(f => ({ ...f, text_fr: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Image de l'avis (optionnelle)</label>
            <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">{imageFile ? imageFile.name : 'Choisir une image...'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
            </label>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-1">Note ({form.rating}/5)</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}
                  className={`text-2xl ${n <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !form.name || !form.text_fr}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-sm transition-colors"
            >
              {saving ? '⏳ Traduction...' : <><Save className="w-4 h-4" /> Sauvegarder</>}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ name: '', text_fr: '', rating: 5 }); setImageFile(null) }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-semibold text-gray-600">
                <X className="w-4 h-4" /> Annuler
              </button>
            )}
          </div>
          {msg && <p className="text-green-600 text-sm font-medium">{msg}</p>}
        </div>
      </div>

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-400 py-4">Chargement...</p>}
        {items.length === 0 && !loading && (
          <p className="text-center text-gray-400 py-8">Aucun avis. Ajoutez-en un ci-dessus.</p>
        )}
        {items.map(item => (
          <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={item.image_url || (items.indexOf(item) % 2 === 0 ? '/images/feedback-ar.jpg' : '/images/feedback-fr.jpg')}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800 text-sm">👤 {item.name}</p>
                        {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-3 h-3 ${n <= item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-2">{item.text_fr}</p>
                  {item.text_en && <p className="text-blue-400 text-xs mt-1 italic">EN: {item.text_en}</p>}
                  {item.text_ar && <p className="text-purple-400 text-xs mt-0.5 italic">AR: {item.text_ar}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => edit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => del(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// =================== TEXTS TAB ===================
function TextsAdmin({ token }) {
  const textKeys = [
    { key: 'hero.badge', label: 'Badge promotionnel (en-tête)', placeholder: 'Ex: Pack promo : les deux livres ensemble avec économie' },
    { key: 'hero.bonus', label: 'Titre du bonus (en-tête)', placeholder: 'Ex: Pack bonus : les deux livres + support pratique' },
    { key: 'hero.bonusDescription', label: 'Description du bonus (en-tête)', placeholder: "Ex: Bénéficiez d'un guide complet..." },
    { key: 'description.title', label: 'Titre section Description', placeholder: 'Ex: Contenu des livres' },
    { key: 'description.subtitle', label: 'Sous-titre section Description', placeholder: 'Description longue...' },
    { key: 'description.promo', label: 'Texte promo (section Description)', placeholder: 'Ex: Ne vous contentez pas de la théorie...' },
    { key: 'showcase.title', label: 'Titre section Galerie', placeholder: 'Ex: Aperçu des Livres' },
    { key: 'showcase.subtitle', label: 'Sous-titre section Galerie', placeholder: 'Ex: Photos réelles et illustrations...' },
    { key: 'feedback.title', label: 'Titre section Avis', placeholder: 'Ex: Avis de nos Acheteurs' },
    { key: 'feedback.subtitle', label: 'Sous-titre section Avis', placeholder: 'Ex: Ce que pensent nos clients...' },
    { key: 'contact.title', label: 'Titre section Contact', placeholder: 'Ex: Contactez-nous' },
  ]

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState({})
  const [msgs, setMsgs] = useState({})

  useEffect(() => {
    fetch(`${apiBase}/api/admin/cms/texts`, { headers })
      .then(r => r.json())
      .then(data => {
        const map = {}
        data.forEach(t => { map[t.key_name] = t.fr_value })
        setValues(map)
      })
  }, [token])

  const saveKey = async (key) => {
    setSaving(s => ({ ...s, [key]: true }))
    setMsgs(m => ({ ...m, [key]: '' }))
    await fetch(`${apiBase}/api/admin/cms/texts/${encodeURIComponent(key)}`, {
      method: 'PUT', headers, body: JSON.stringify({ fr_value: values[key] || '' })
    })
    setMsgs(m => ({ ...m, [key]: '✅ Sauvegardé et traduit' }))
    setSaving(s => ({ ...s, [key]: false }))
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        💡 Écrivez en français. La traduction en anglais et arabe se fera automatiquement à la sauvegarde.
      </p>
      {textKeys.map(({ key, label, placeholder }) => (
        <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <label className="text-sm font-bold text-gray-700 block mb-2">{label}</label>
          <div className="flex gap-3 items-start">
            <textarea
              rows={2}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-300 outline-none resize-none text-sm"
              placeholder={placeholder}
              value={values[key] || ''}
              onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
            />
            <button onClick={() => saveKey(key)} disabled={saving[key]}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 font-semibold text-sm transition-colors shrink-0">
              {saving[key] ? '⏳' : <Save className="w-4 h-4" />}
            </button>
          </div>
          {msgs[key] && <p className="text-green-600 text-xs font-medium mt-2">{msgs[key]}</p>}
        </div>
      ))}
    </div>
  )
}

// =================== MAIN EXPORT ===================
export default function CmsTab({ token }) {
  const [subTab, setSubTab] = useState('texts')

  const tabs = [
    { id: 'texts', label: '📝 Textes Généraux' },
    { id: 'faq', label: '❓ FAQ' },
    { id: 'features', label: '✅ Avantages' },
    { id: 'gallery', label: '🖼️ Galerie Photos' },
    { id: 'feedback', label: '⭐ Avis Clients' },
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Contenu de la Page d'Accueil</h2>
        <p className="text-gray-500 text-sm">Modifiez, ajoutez ou supprimez tout le contenu visible sur la page d'accueil. La traduction est automatique.</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${subTab === tab.id ? 'bg-primary-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={subTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {subTab === 'texts' && <TextsAdmin token={token} />}
          {subTab === 'faq' && <FaqAdmin token={token} />}
          {subTab === 'features' && <FeaturesAdmin token={token} />}
          {subTab === 'gallery' && <GalleryAdmin token={token} />}
          {subTab === 'feedback' && <FeedbackAdmin token={token} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
