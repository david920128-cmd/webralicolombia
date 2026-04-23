import { Link, NavLink, Outlet } from 'react-router-dom'
import { WhatsAppButton } from './WhatsAppButton'

export function Layout({ settings }) {
  const quoteMessage = encodeURIComponent('Hola, quiero información y cotización de sus productos.')

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand">
            <img src={settings.logo_url} alt="RALI" className="brand-logo" />
            <div>
              <strong>{settings.business_name}</strong>
              <span>{settings.subtitle}</span>
            </div>
          </Link>
          <nav className="nav">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/quienes-somos">Quiénes somos</NavLink>
            <NavLink to="/catalogo">Catálogo</NavLink>
            <NavLink to="/contacto">Contacto</NavLink>
            <NavLink to="/admin/login">Acceso</NavLink>
          </nav>
          <a
            className="header-whatsapp"
            href={`https://wa.me/57${settings.whatsapp}?text=${quoteMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Cotiza por WhatsApp
          </a>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src={settings.logo_url} alt="RALI" className="footer-logo" />
            <p>{settings.welcome_description}</p>
            <a className="cta-link" href={`https://wa.me/57${settings.whatsapp}?text=${quoteMessage}`} target="_blank" rel="noreferrer">
              Solicitar cotización
            </a>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>{settings.phone_1}</p>
            <p>{settings.phone_2}</p>
            <p>{settings.address}</p>
            <p>{settings.neighborhood}</p>
            <p>{settings.city}</p>
          </div>
          <div>
            <h4>Canales</h4>
            <p>{settings.website}</p>
            <p>{settings.email}</p>
            <p>Atención rápida por WhatsApp para cotizaciones y pedidos.</p>
          </div>
        </div>
      </footer>
      <WhatsAppButton whatsapp={settings.whatsapp} />
    </div>
  )
}
