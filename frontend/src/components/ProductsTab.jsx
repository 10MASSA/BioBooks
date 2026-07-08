import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, EyeOff, Eye, ArrowUp, ArrowDown } from 'lucide-react'
import { API_URL } from '../utils/constants'
import { useProducts } from '../context/ProductsContext'

export default function ProductsTab({ token }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(null) // id of product being edited or 'new'
  const [editForm, setEditForm] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const { refreshProducts } = useProducts()
  
  const apiBase = API_URL ? API_URL.replace(/\/+$/, '') : ''

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiBase}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if(res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [token])

  const handleEditClick = (p) => {
    setIsEditing(p.id)
    setEditForm({ ...p })
    setImageFile(null)
  }

  const handleAddNew = () => {
    setIsEditing('new')
    setEditForm({
      id: `prod_${Date.now()}`,
      name: '',
      description: '',
      price: '',
      original_price: '',
      is_active: true,
      display_order: products.length + 1
    })
    setImageFile(null)
  }

  const handleSave = async () => {
    try {
      const formData = new FormData()
      Object.keys(editForm).forEach(key => {
        if(editForm[key] !== null && editForm[key] !== undefined) {
          formData.append(key, editForm[key])
        }
      })
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const isNew = isEditing === 'new'
      const url = isNew ? `${apiBase}/api/admin/products` : `${apiBase}/api/admin/products/${editForm.id}`

      // Validate required fields
      if (!editForm.name || !editForm.price) {
        alert("Le nom et le prix sont obligatoires.")
        return
      }

      if (!isNew) {
         // Modification: update text fields, then image if changed
         const resText = await fetch(url, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
           },
           body: JSON.stringify(editForm)
         })
         if (!resText.ok) {
           const errData = await resText.json().catch(() => ({}))
           throw new Error(errData.error || "Erreur de modification du produit")
         }
         
         if (imageFile) {
            const imgData = new FormData()
            imgData.append('image', imageFile)
            const resImg = await fetch(`${url}/image`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${token}` },
              body: imgData
            })
            if (!resImg.ok) {
              const errData = await resImg.json().catch(() => ({}))
              throw new Error(errData.error || "Erreur de modification de l'image")
            }
         }
      } else {
        // Creation with optional image
        const resCreate = await fetch(url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (!resCreate.ok) {
          const errData = await resCreate.json().catch(() => ({}))
          throw new Error(errData.error || "Erreur de création du produit")
        }
      }
      
      setIsEditing(null)
      await fetchProducts()
      if (refreshProducts) refreshProducts()
    } catch (err) {
      console.error(err)
      alert(err.message || "Erreur lors de la sauvegarde")
    }
  }

  const handleDelete = async (id) => {
    if(!confirm("Supprimer ce produit définitivement ?")) return
    try {
      await fetch(`${apiBase}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchProducts()
      if (refreshProducts) refreshProducts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleActive = async (p) => {
    try {
      await fetch(`${apiBase}/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...p, is_active: !p.is_active })
      })
      await fetchProducts()
      if (refreshProducts) refreshProducts()
    } catch (err) {}
  }

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === products.length - 1) return

    const newProducts = [...products]
    const current = newProducts[index]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const target = newProducts[swapIndex]

    // Swap display_order
    const currentOrder = current.display_order
    current.display_order = target.display_order
    target.display_order = currentOrder

    // update both in DB
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
      await fetchProducts()
      if (refreshProducts) refreshProducts()
    } catch (err) {}
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Gestion des Produits</h2>
        <button 
          onClick={handleAddNew}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" /> Ajouter un produit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, index) => (
          <div key={p.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${!p.is_active ? 'opacity-60 grayscale' : ''}`}>
            {isEditing === p.id ? (
              <div className="p-4 space-y-4">
                <input type="text" placeholder="ID (ex: book3)" value={editForm.id} readOnly className="w-full p-2 border rounded bg-gray-50 text-xs" />
                <input type="text" placeholder="Nom du produit" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded font-bold" />
                <textarea placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-2 border rounded text-sm h-24" />
                <div className="flex gap-2">
                  <input type="number" placeholder="Prix (DA)" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full p-2 border rounded" />
                  <input type="number" placeholder="Ancien Prix" value={editForm.original_price || ''} onChange={e => setEditForm({...editForm, original_price: e.target.value})} className="w-full p-2 border rounded text-gray-500" />
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex justify-center items-center gap-2"><Save className="w-4 h-4"/> Sauvegarder</button>
                  <button onClick={() => setIsEditing(null)} className="px-4 bg-gray-200 py-2 rounded-lg"><X className="w-4 h-4"/></button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative group">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1 bg-white shadow rounded-md hover:bg-gray-100 disabled:opacity-50"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => handleMove(index, 'down')} disabled={index === products.length - 1} className="p-1 bg-white shadow rounded-md hover:bg-gray-100 disabled:opacity-50"><ArrowDown className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => handleToggleActive(p)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
                        {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
                      </button>
                      <button onClick={() => handleEditClick(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-primary-600 text-xl">{p.price} DA</span>
                    {p.original_price && <span className="text-gray-400 line-through text-sm">{p.original_price} DA</span>}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{p.description || "Aucune description"}</p>
                </div>
              </>
            )}
          </div>
        ))}

        {isEditing === 'new' && (
          <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4 border-primary-500 ring-2 ring-primary-100">
             <input type="text" placeholder="ID (ex: book3)" value={editForm.id} onChange={e => setEditForm({...editForm, id: e.target.value})} className="w-full p-2 border rounded font-mono text-xs" />
             <input type="text" placeholder="Nom du produit" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded font-bold" />
             <textarea placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-2 border rounded text-sm h-24" />
             <div className="flex gap-2">
               <input type="number" placeholder="Prix (DA)" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full p-2 border rounded" />
               <input type="number" placeholder="Ancien Prix" value={editForm.original_price || ''} onChange={e => setEditForm({...editForm, original_price: e.target.value})} className="w-full p-2 border rounded" />
             </div>
             <div className="flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-gray-400" />
               <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm" />
             </div>
             <div className="flex gap-2 pt-2">
               <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold flex justify-center items-center gap-2"><Save className="w-4 h-4"/> Créer</button>
               <button onClick={() => setIsEditing(null)} className="px-4 bg-gray-200 py-2 rounded-lg"><X className="w-4 h-4"/></button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
