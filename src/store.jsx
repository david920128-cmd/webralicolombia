import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultProducts, defaultSettings } from './data'
import { hasSupabase, supabase } from './supabaseClient'

const AppContext = createContext(null)
const LS_SETTINGS = 'rali_settings_demo'
const LS_PRODUCTS = 'rali_products_demo'
const LS_SESSION = 'rali_demo_session'
const LS_PASSWORD = 'rali_demo_password'

function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function safeFileName(name = 'archivo') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase()
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [products, setProducts] = useState(defaultProducts)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(hasSupabase ? 'supabase' : 'demo')

  const loadData = useCallback(async () => {
    setLoading(true)
    if (!hasSupabase) {
      setSettings(readLocal(LS_SETTINGS, defaultSettings))
      setProducts(readLocal(LS_PRODUCTS, defaultProducts))
      setUser(readLocal(LS_SESSION, null))
      setLoading(false)
      return
    }

    const [{ data: settingsData }, { data: authData }] = await Promise.all([
      supabase.from('settings').select('*').limit(1).maybeSingle(),
      supabase.auth.getUser(),
    ])

    setUser(authData?.user ?? null)
    setSettings(settingsData || defaultSettings)

    const { data: productsData } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('sort_order', { ascending: true })

    const normalized = (productsData || []).map((item) => ({
      ...item,
      images: (item.product_images || item.images || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    }))

    setProducts(normalized.length ? normalized : defaultProducts)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!hasSupabase) {
      saveLocal(LS_SETTINGS, settings)
      saveLocal(LS_PRODUCTS, products)
      saveLocal(LS_SESSION, user)
    }
  }, [settings, products, user])

  const login = async ({ email, password }) => {
    if (!hasSupabase) {
      const storedPassword = localStorage.getItem(LS_PASSWORD) || 'admin123'
      if (email === 'admin@rali.com' && password === storedPassword) {
        const demoUser = { email }
        setUser(demoUser)
        localStorage.setItem(LS_PASSWORD, storedPassword)
        return { ok: true }
      }
      return { ok: false, message: 'Usuario o contraseña inválidos.' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, message: error.message }
    await loadData()
    return { ok: true }
  }

  const logout = async () => {
    if (!hasSupabase) {
      setUser(null)
      localStorage.removeItem(LS_SESSION)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }

  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!hasSupabase) {
      const storedPassword = localStorage.getItem(LS_PASSWORD) || 'admin123'
      if (currentPassword !== storedPassword) {
        return { ok: false, message: 'La contraseña actual no coincide.' }
      }
      localStorage.setItem(LS_PASSWORD, newPassword)
      return { ok: true, message: 'Contraseña actualizada.' }
    }

    const email = user?.email
    if (!email) return { ok: false, message: 'No hay sesión activa.' }
    const relogin = await supabase.auth.signInWithPassword({ email, password: currentPassword })
    if (relogin.error) return { ok: false, message: 'La contraseña actual no coincide.' }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { ok: false, message: error.message }
    return { ok: true, message: 'Contraseña actualizada.' }
  }

  const saveSettings = async (nextSettings) => {
    setSettings(nextSettings)
    if (!hasSupabase) return { ok: true }

    if (settings.id) {
      const { error } = await supabase.from('settings').update(nextSettings).eq('id', settings.id)
      if (error) return { ok: false, message: error.message }
      return { ok: true }
    }

    const { data, error } = await supabase.from('settings').insert(nextSettings).select().single()
    if (error) return { ok: false, message: error.message }
    setSettings(data)
    return { ok: true }
  }

  const saveProduct = async (product) => {
    const normalized = {
      ...product,
      images: (product.images || []).map((img, index) => ({
        ...img,
        sort_order: index + 1,
      })),
    }

    if (!hasSupabase) {
      setProducts((prev) => {
        const exists = prev.some((item) => item.id === normalized.id)
        return exists
          ? prev.map((item) => (item.id === normalized.id ? normalized : item))
          : [...prev, normalized].sort((a, b) => a.sort_order - b.sort_order)
      })
      return { ok: true }
    }

    const payload = {
      name: normalized.name,
      description: normalized.description,
      price: normalized.price,
      category: normalized.category,
      sort_order: normalized.sort_order,
      active: normalized.active,
    }

    let savedProduct = null
    if (normalized.id?.startsWith('local-') || !normalized.id) {
      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if (error) return { ok: false, message: error.message }
      savedProduct = data
    } else {
      const { data, error } = await supabase.from('products').update(payload).eq('id', normalized.id).select().single()
      if (error) return { ok: false, message: error.message }
      savedProduct = data
      const { error: deleteImagesError } = await supabase.from('product_images').delete().eq('product_id', normalized.id)
      if (deleteImagesError) return { ok: false, message: deleteImagesError.message }
    }

    if (normalized.images.length) {
      const rows = normalized.images.map((img, index) => ({
        product_id: savedProduct.id,
        image_url: img.image_url,
        sort_order: index + 1,
      }))
      const { error } = await supabase.from('product_images').insert(rows)
      if (error) return { ok: false, message: error.message }
    }

    await loadData()
    return { ok: true }
  }

  const deleteProduct = async (id) => {
    if (!hasSupabase) {
      setProducts((prev) => prev.filter((item) => item.id !== id))
      return { ok: true }
    }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return { ok: false, message: error.message }
    await loadData()
    return { ok: true }
  }

  const uploadImage = async (file, bucket = 'productos') => {
    if (!hasSupabase) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve({ ok: true, url: reader.result })
        reader.onerror = () => reject({ ok: false, message: 'No fue posible leer la imagen.' })
        reader.readAsDataURL(file)
      })
    }

    const safeName = safeFileName(file.name)
    const filename = `${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from(bucket).upload(filename, file, { upsert: true })
    if (error) return { ok: false, message: error.message }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
    return { ok: true, url: data.publicUrl }
  }

  const value = useMemo(
    () => ({
      settings,
      products,
      user,
      loading,
      mode,
      login,
      logout,
      changePassword,
      saveSettings,
      saveProduct,
      deleteProduct,
      uploadImage,
      reload: loadData,
    }),
    [settings, products, user, loading, mode, loadData],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  return useContext(AppContext)
}
