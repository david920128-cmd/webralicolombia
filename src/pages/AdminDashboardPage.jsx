import { useMemo, useState } from 'react'
import { useAppStore } from '../store'

function SettingsForm({ settings, onSave, onUpload, message }) {
  const [form, setForm] = useState(settings)
  const [busy, setBusy] = useState(false)

  async function handleLogo(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const result = await onUpload(file)
    if (result.ok) setForm((prev) => ({ ...prev, logo_url: result.url }))
  }

  async function handleHero(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const result = await onUpload(file)
    if (result.ok) setForm((prev) => ({ ...prev, hero_image_url: result.url }))
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    await onSave(form)
    setBusy(false)
  }

  return (
    <form className="admin-card form-grid" onSubmit={submit}>
      <div className="admin-card-header">
        <h2>Datos del negocio</h2>
        {message ? <span className="status-ok">{message}</span> : null}
      </div>
      <input value={form.business_name || ''} onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="Nombre empresa" />
      <input value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtítulo" />
      <input value={form.welcome_title || ''} onChange={(e) => setForm({ ...form, welcome_title: e.target.value })} placeholder="Título de bienvenida" />
      <input value={form.whatsapp || ''} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp" />
      <input value={form.phone_1 || ''} onChange={(e) => setForm({ ...form, phone_1: e.target.value })} placeholder="Teléfono 1" />
      <input value={form.phone_2 || ''} onChange={(e) => setForm({ ...form, phone_2: e.target.value })} placeholder="Teléfono 2" />
      <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Dirección" />
      <input value={form.neighborhood || ''} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} placeholder="Barrio" />
      <input value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ciudad" />
      <input value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Sitio web" />
      <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo" />
      <textarea value={form.welcome_description || ''} onChange={(e) => setForm({ ...form, welcome_description: e.target.value })} rows="4" placeholder="Descripción de bienvenida" />
      <textarea value={form.about_text || ''} onChange={(e) => setForm({ ...form, about_text: e.target.value })} rows="4" placeholder="Quiénes somos" />
      <textarea value={form.mission || ''} onChange={(e) => setForm({ ...form, mission: e.target.value })} rows="3" placeholder="Misión" />
      <textarea value={form.vision || ''} onChange={(e) => setForm({ ...form, vision: e.target.value })} rows="3" placeholder="Visión" />
      <textarea value={form.values_text || ''} onChange={(e) => setForm({ ...form, values_text: e.target.value })} rows="3" placeholder="Valores" />
      <div className="upload-field">
        <label>Logo</label>
        <input type="file" accept="image/*" onChange={handleLogo} />
      </div>
      <div className="upload-field">
        <label>Imagen principal</label>
        <input type="file" accept="image/*" onChange={handleHero} />
      </div>
      <button className="primary-btn" type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Guardar datos'}</button>
    </form>
  )
}

function PasswordForm({ onChangePassword, message }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localMessage, setLocalMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (newPassword !== confirm) {
      setLocalMessage('La confirmación no coincide.')
      return
    }
    const result = await onChangePassword({ currentPassword, newPassword })
    setLocalMessage(result.message)
    if (result.ok) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    }
  }

  return (
    <form className="admin-card form-grid" onSubmit={submit}>
      <div className="admin-card-header"><h2>Cambiar contraseña</h2>{message ? <span className="status-ok">{message}</span> : null}</div>
      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Contraseña actual" required />
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contraseña" required />
      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmar nueva contraseña" required />
      {localMessage ? <div className="alert">{localMessage}</div> : null}
      <button className="primary-btn" type="submit">Actualizar contraseña</button>
    </form>
  )
}

function ProductEditor({ product, onChange, onUploadImage, onSave, onDelete }) {
  async function handleFiles(event) {
    const files = Array.from(event.target.files || [])
    for (const file of files) {
      const result = await onUploadImage(file)
      if (result.ok) {
        onChange({
          ...product,
          images: [...(product.images || []), { id: `${Date.now()}-${file.name}`, image_url: result.url, sort_order: (product.images?.length || 0) + 1 }],
        })
      }
    }
  }

  return (
    <div className="admin-card form-grid product-editor">
      <div className="admin-card-header"><h2>{product.id ? 'Editar producto' : 'Nuevo producto'}</h2></div>
      <input value={product.name || ''} onChange={(e) => onChange({ ...product, name: e.target.value })} placeholder="Nombre del producto" />
      <input value={product.category || ''} onChange={(e) => onChange({ ...product, category: e.target.value })} placeholder="Categoría" />
      <input value={product.price || ''} onChange={(e) => onChange({ ...product, price: e.target.value })} placeholder="Precio o mensaje" />
      <input type="number" value={product.sort_order || 0} onChange={(e) => onChange({ ...product, sort_order: Number(e.target.value) })} placeholder="Orden" />
      <textarea value={product.description || ''} onChange={(e) => onChange({ ...product, description: e.target.value })} rows="4" placeholder="Descripción" />
      <label className="check-row"><input type="checkbox" checked={product.active ?? true} onChange={(e) => onChange({ ...product, active: e.target.checked })} /> Producto activo</label>
      <div className="upload-field">
        <label>Subir imágenes</label>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
      </div>
      <div className="thumb-grid">
        {(product.images || []).map((image, index) => (
          <div key={image.id || image.image_url} className="thumb-card">
            <img src={image.image_url} alt="Producto" />
            <button type="button" className="small-btn" onClick={() => onChange({ ...product, images: product.images.filter((_, i) => i !== index) })}>Quitar</button>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button type="button" className="primary-btn" onClick={onSave}>Guardar producto</button>
        {product.id ? <button type="button" className="danger-btn" onClick={() => onDelete(product.id)}>Eliminar</button> : null}
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const { settings, products, mode, user, logout, saveSettings, saveProduct, deleteProduct, uploadImage, changePassword } = useAppStore()
  const [message, setMessage] = useState('')
  const [editingProduct, setEditingProduct] = useState(products[0] || { active: true, images: [], sort_order: products.length + 1 })

  const sortedProducts = useMemo(() => [...products].sort((a, b) => a.sort_order - b.sort_order), [products])

  async function handleSettingsSave(form) {
    const result = await saveSettings(form)
    setMessage(result.ok ? 'Datos guardados.' : result.message)
  }

  async function handleSaveProduct() {
    const result = await saveProduct(editingProduct)
    setMessage(result.ok ? 'Producto guardado.' : result.message)
    if (result.ok) {
      setEditingProduct({ active: true, images: [], sort_order: products.length + 1 })
    }
  }

  async function handleDeleteProduct(id) {
    const result = await deleteProduct(id)
    setMessage(result.ok ? 'Producto eliminado.' : result.message)
    if (result.ok) {
      setEditingProduct({ active: true, images: [], sort_order: products.length + 1 })
    }
  }

  return (
    <section className="admin-shell">
      <div className="container admin-header">
        <div>
          <h1>Panel de administración</h1>
          <p>{mode === 'demo' ? 'Modo demo con localStorage. Para producción usa Supabase.' : `Conectado como ${user?.email}`}</p>
        </div>
        <button className="secondary-btn" onClick={logout}>Cerrar sesión</button>
      </div>

      <div className="container admin-grid">
        <div className="admin-stack">
          <SettingsForm settings={settings} onSave={handleSettingsSave} onUpload={uploadImage} message={message} />
          <PasswordForm onChangePassword={changePassword} message={message} />
        </div>

        <div className="admin-stack">
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Productos</h2>
              <button className="primary-btn" onClick={() => setEditingProduct({ active: true, images: [], sort_order: sortedProducts.length + 1 })}>Nuevo</button>
            </div>
            <div className="list-grid">
              {sortedProducts.map((product) => (
                <button key={product.id} type="button" className="list-item" onClick={() => setEditingProduct(product)}>
                  <img src={product.images?.[0]?.image_url || '/products/porta-menu-1.jpeg'} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <ProductEditor
            product={editingProduct}
            onChange={setEditingProduct}
            onUploadImage={uploadImage}
            onSave={handleSaveProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      </div>
    </section>
  )
}
