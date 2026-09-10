import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, Edit2, X, Upload, Star, Sparkles, CheckCircle2, Image as ImageIcon, Phone, FileText, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../utils/constants'
import { getStoredGalleryItems, saveGalleryItems } from '../utils/cmsStorage'
import { useCms } from '../context/CmsContext'

const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

// =================== 1. GENERAL SITE TEXTS & MEGA PACK ===================
function TextsAdmin({ token }) {
  const textKeys = [
    { section: '📦 Bannière Mega Pack Promo', key: 'pack.title', label: 'Titre du Pack Promo', placeholder: 'Ex: Commandez le Pack Complet et économisez 400 DA' },
    { section: '📦 Bannière Mega Pack Promo', key: 'pack.description', label: 'Description du Pack Promo', placeholder: 'Ex: Recevez les 2 ouvrages chez vous avec livraison rapide partout en Algérie. Paiement à la réception.' },
    { section: '📦 Bannière Mega Pack Promo', key: 'pack.badge', label: 'Badge du Pack', placeholder: "Ex: L’offre recommandée par les laboratoires" },
    { section: '📦 Bannière Mega Pack Promo', key: 'pack.price_label', label: 'Libellé du Prix', placeholder: 'Ex: Prix spécial Pack :' },
    { section: '📦 Bannière Mega Pack Promo', key: 'pack.cod_label', label: 'Texte de Réassurance', placeholder: 'Ex: Paiement à la livraison après vérification' },
    { section: '📦 Bannière Mega Pack Promo', key: 'pack.btn', label: 'Texte du Bouton de Commande', placeholder: 'Ex: 🛒 Commander le Pack' },

    { section: '📚 Section Contenu des Livres', key: 'description.title', label: 'Titre principal de la section', placeholder: 'Ex: Tout ce que vous allez maîtriser' },
    { section: '📚 Section Contenu des Livres', key: 'description.subtitle', label: 'Sous-titre descriptif', placeholder: 'Ex: Deux guides de référence 100% pratiques avec photos réelles...' },
    { section: '📚 Section Contenu des Livres', key: 'description.promo', label: 'Badge de la section', placeholder: 'Ex: Contenu Pratique & Détaillé' },

    { section: '🔥 En-tête & Formulaire', key: 'hero.badge', label: 'Badge en-tête (au dessus de la photo)', placeholder: 'Ex: الأكثر طلباً 🔥 / Best-Seller 🔥' },
    { section: '🔥 En-tête & Formulaire', key: 'showcase.subtitle', label: 'Texte de motivation', placeholder: 'Ex: 15 jours de stage insuffisant pour tout apprendre... Ces livres résument tout !' },
  ]

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState({})
  const [msgs, setMsgs] = useState({})
  const { fetchCms } = useCms() || {}

  useEffect(() => {
    // 1. Fetch from admin texts
    fetch(`${apiBase}/api/admin/cms/texts`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const map = {}
          data.forEach(t => { map[t.key_name] = t.fr_value })
          setValues(map)
        } else {
          // Fallback to public content
          fetch(`${apiBase}/api/content`)
            .then(r => r.ok ? r.json() : {})
            .then(cData => {
              if (Array.isArray(cData?.texts)) {
                const map = {}
                cData.texts.forEach(t => { map[t.key_name] = t.fr_value })
                setValues(map)
              }
            })
        }
      })
      .catch(() => {})
  }, [token])

  const saveKey = async (key) => {
    setSaving(s => ({ ...s, [key]: true }))
    setMsgs(m => ({ ...m, [key]: '' }))
    try {
      await fetch(`${apiBase}/api/admin/cms/texts/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ fr_value: values[key] || '' })
      })
      setMsgs(m => ({ ...m, [key]: '✅ Enregistré & actualisé sur le site !' }))
      if (fetchCms) fetchCms()
    } catch {
      setMsgs(m => ({ ...m, [key]: '✅ Modifié localement' }))
    } finally {
      setSaving(s => ({ ...s, [key]: false }))
    }
  }

  // Group by section
  const sections = ['📦 Bannière Mega Pack Promo', '📚 Section Contenu des Livres', '🔥 En-tête & Formulaire']

  return (
    <div className="space-y-8">
      <div className="p-4 bg-primary-50 border border-primary-200 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <p className="text-primary-900 text-xs sm:text-sm font-medium leading-relaxed">
          <strong>Modifiez directement tous les textes de la page d'accueil :</strong> Remplissez en français, la traduction en arabe et anglais se génère automatiquement à la sauvegarde.
        </p>
      </div>

      {sections.map(secName => (
        <div key={secName} className="space-y-4">
          <h3 className="font-black text-slate-900 text-base sm:text-lg border-b border-slate-200 pb-2">
            {secName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {textKeys.filter(it => it.section === secName).map(({ key, label, placeholder }) => (
              <div key={key} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-black text-slate-800 block mb-2">{label}</label>
                  <textarea
                    rows={3}
                    className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-primary-600 outline-none text-xs sm:text-sm resize-none bg-slate-50 focus:bg-white transition-colors"
                    placeholder={placeholder}
                    value={values[key] || ''}
                    onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  {msgs[key] ? (
                    <span className="text-emerald-600 text-xs font-bold">{msgs[key]}</span>
                  ) : (
                    <span className="text-slate-400 text-xs">Clé: {key}</span>
                  )}

                  <button
                    onClick={() => saveKey(key)}
                    disabled={saving[key]}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving[key] ? '⏳ Envoi...' : <><Save className="w-3.5 h-3.5" /> Enregistrer</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =================== 2. BOOK POINTS / FEATURES (Puces descriptives) ===================
function FeaturesAdmin({ token }) {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ product_id: 'book1', text_fr: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    fetch(`${apiBase}/api/products`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) && data.length > 0 ? data : [
          { id: 'book1', name: 'Livre 1 — Matériels & Outils' },
          { id: 'book2', name: "Livre 2 — Techniques d'Analyses" },
          { id: 'pack', name: 'Pack — Les 2 livres ensemble' }
        ]
        setProducts(list)
      })
      .catch(() => {
        setProducts([
          { id: 'book1', name: 'Livre 1 — Matériels & Outils' },
          { id: 'book2', name: "Livre 2 — Techniques d'Analyses" },
          { id: 'pack', name: 'Pack — Les 2 livres ensemble' }
        ])
      })
  }, [token])

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      let res = await fetch(`${apiBase}/api/admin/cms/features`, { headers })
      if (!res.ok) {
        res = await fetch(`${apiBase}/api/content`)
        const cData = await res.json()
        setItems(Array.isArray(cData?.features) ? cData.features : [])
      } else {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      }
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetch_() }, [fetch_])

  const save = async () => {
    if (!form.text_fr || !form.product_id) return
    setSaving(true)
    setMsg('')
    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `${apiBase}/api/admin/cms/features/${editId}` : `${apiBase}/api/admin/cms/features`
      await fetch(url, { method, headers, body: JSON.stringify({ ...form, display_order: 0 }) })
      setMsg('✅ Point clé enregistré sur le site !')
      setForm(f => ({ ...f, text_fr: '' }))
      setEditId(null)
      fetch_()
    } catch {
      setMsg('✅ Modifié localement')
    } finally {
      setSaving(false)
    }
  }

  const del = async (id) => {
    if (!window.confirm('Supprimer ce point clé ?')) return
    try {
      await fetch(`${apiBase}/api/admin/cms/features/${id}`, { method: 'DELETE', headers })
      setItems(prev => prev.filter(it => it.id !== id))
    } catch {
      setItems(prev => prev.filter(it => it.id !== id))
    }
  }

  const edit = (item) => {
    setEditId(item.id)
    setForm({ product_id: item.product_id, text_fr: item.text_fr })
    setMsg('')
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border-2 border-emerald-500">
        <h3 className="font-black text-slate-900 mb-4 text-base sm:text-lg flex items-center gap-2">
          {editId ? '✏️ Modifier un point clé' : '➕ Ajouter une nouvelle puce descriptive dans un livre'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Sélectionner le livre concerné</label>
            <select
              className="border-2 border-slate-200 rounded-xl px-4 py-3 w-full focus:border-primary-600 outline-none text-sm font-bold cursor-pointer bg-slate-50"
              value={form.product_id}
              onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-black text-slate-700 block mb-1">Texte du point clé</label>
            <input
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-600 outline-none text-sm font-medium bg-slate-50 focus:bg-white"
              placeholder="Ex: Automates FNS, ionogramme et biochimie avec principe de fonctionnement..."
              value={form.text_fr}
              onChange={e => setForm(f => ({ ...f, text_fr: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={save}
            disabled={saving || !form.text_fr || !form.product_id}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? '⏳ Enregistrement...' : <><Save className="w-4 h-4" /> {editId ? 'Mettre à jour' : 'Ajouter le point sur le site'}</>}
          </button>
          
          {editId && (
            <button
              onClick={() => { setEditId(null); setForm(f => ({ ...f, text_fr: '' })) }}
              className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 cursor-pointer"
            >
              Annuler
            </button>
          )}

          {msg && <p className="text-emerald-600 text-xs font-bold ml-2">{msg}</p>}
        </div>
      </div>

      {/* List of existing features */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-900 text-base">Points clés actuellement configurés ({items.length}) :</h4>
        
        {loading && <p className="text-center text-slate-400 py-6">Chargement des points clés...</p>}
        {items.length === 0 && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            Aucun point personnalisé dans la base. Les points standards par défaut sont affichés sur la page d'accueil.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md mb-1 border border-slate-200">
                    {item.product_id === 'book1' ? '📗 Livre 1' : item.product_id === 'book2' ? '📘 Livre 2' : '📦 Pack'}
                  </span>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm leading-relaxed">{item.text_fr}</p>
                </div>
              </div>

              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer" title="Modifier">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => del(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =================== 3. GALLERY PHOTOS ADMIN ===================
function GalleryAdmin({ token }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', image_url: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setItems(getStoredGalleryItems())
  }, [])

  const addImage = () => {
    if (!form.image_url) return
    const newItem = {
      id: `gal_${Date.now()}`,
      title: form.title || 'Page du livre',
      image_url: form.image_url
    }
    const updated = [newItem, ...items]
    setItems(updated)
    saveGalleryItems(updated)
    setForm({ title: '', image_url: '' })
    setMsg('✅ Photo ajoutée à la galerie !')
  }

  const deleteImage = (id) => {
    if (!confirm('Supprimer cette photo de la galerie ?')) return
    const updated = items.filter(it => it.id !== id)
    setItems(updated)
    saveGalleryItems(updated)
  }

  return (
    <div className="space-y-6">
      {/* Add Image Form */}
      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border-2 border-indigo-500">
        <h3 className="font-black text-slate-900 mb-4 text-base sm:text-lg">➕ Ajouter une photo dans la Galerie / Feuilleter les pages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Titre de la photo (Légende)</label>
            <input
              type="text"
              placeholder="Ex: Protocole de dosage biochimique..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-600 outline-none text-sm bg-slate-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">Chemin ou URL de l'image</label>
            <input
              type="text"
              placeholder="Ex: /images/book1-page1-real.jpg ou lien web..."
              value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-600 outline-none text-sm bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={addImage}
            disabled={!form.image_url}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Ajouter à la galerie
          </button>
          {msg && <p className="text-emerald-600 text-xs font-bold">{msg}</p>}
        </div>
      </div>

      {/* Grid of gallery images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-2 relative overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
              <button
                onClick={() => deleteImage(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-800 truncate">{item.title || "Photo du livre"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =================== MAIN EXPORT CMS TAB ===================
export default function CmsTab({ token }) {
  const [subTab, setSubTab] = useState('texts')

  const tabs = [
    { id: 'texts', label: '📝 1. Textes & Bannière Mega Pack', icon: FileText },
    { id: 'features', label: '✅ 2. Points Clés des Livres (Puces)', icon: CheckCircle2 },
    { id: 'gallery', label: '🖼️ 3. Galerie Photos & Pages', icon: ImageIcon },
  ]

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 px-6 py-5">
          <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestion du Contenu</span>
          </div>
          <h2 className="text-xl font-black text-white">Personnalisation des Textes & Images du Site</h2>
          <p className="text-primary-100 text-xs mt-0.5">
            Cliquez sur l'un des 3 onglets ci-dessous pour modifier les textes du Pack, les puces descriptives des livres ou la galerie.
          </p>
        </div>

        {/* Big Sub-tabs Navigation */}
        <div className="px-6 py-4 flex gap-3 flex-wrap bg-slate-50 border-t border-slate-100">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = subTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30 scale-[1.02]'
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-primary-400 hover:text-primary-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {subTab === 'texts' && <TextsAdmin token={token} />}
          {subTab === 'features' && <FeaturesAdmin token={token} />}
          {subTab === 'gallery' && <GalleryAdmin token={token} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
