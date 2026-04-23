import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, mode } = useAppStore()
  const [email, setEmail] = useState('admin@rali.com')
  const [password, setPassword] = useState('admin123')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    const result = await login({ email, password })
    setBusy(false)
    if (!result.ok) {
      setMessage(result.message)
      return
    }
    navigate('/admin')
  }

  return (
    <section className="admin-login-screen">
      <form className="login-card" onSubmit={onSubmit}>
        <img src="/logo-rali.png" alt="RALI" className="login-logo" />
        <h1>Acceso administrador</h1>
        <p>{mode === 'demo' ? 'Modo demo: admin@rali.com / admin123' : 'Acceso conectado a Supabase Auth'}</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
        {message ? <div className="alert error">{message}</div> : null}
        <button className="primary-btn full" type="submit" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </section>
  )
}
