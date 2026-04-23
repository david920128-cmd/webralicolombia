import { useAppStore } from '../store'

export function ContactPage() {
  const { settings } = useAppStore()
  const quoteMessage = encodeURIComponent('Hola, quiero información y cotización de sus productos.')

  return (
    <section className="section contact-section">
      <div className="container two-col">
        <div className="panel contact-panel">
          <span className="section-kicker">Contacto directo</span>
          <h1>Hablemos de tu pedido</h1>
          <p>Estamos listos para ayudarte con cotizaciones, tiempos de entrega y trabajos personalizados.</p>
          <div className="contact-list premium-contact-list">
            <p><strong>WhatsApp:</strong> {settings.phone_1}</p>
            <p><strong>Teléfono 2:</strong> {settings.phone_2}</p>
            <p><strong>Dirección:</strong> {settings.address}</p>
            <p><strong>Barrio:</strong> {settings.neighborhood}</p>
            <p><strong>Ciudad:</strong> {settings.city}</p>
            <p><strong>Web:</strong> {settings.website}</p>
            <p><strong>Correo:</strong> {settings.email}</p>
          </div>
          <a className="primary-btn" href={`https://wa.me/57${settings.whatsapp}?text=${quoteMessage}`} target="_blank" rel="noreferrer">
            Solicitar cotización por WhatsApp
          </a>
        </div>
        <div className="panel form-panel">
          <span className="section-kicker">Formulario</span>
          <h2>Envíanos tu solicitud</h2>
          <form name="contacto" method="POST" data-netlify="true" className="form-grid">
            <input type="hidden" name="form-name" value="contacto" />
            <input name="nombre" placeholder="Tu nombre" required />
            <input type="email" name="correo" placeholder="Tu correo" required />
            <textarea name="mensaje" rows="6" placeholder="Cuéntanos qué producto te interesa" required />
            <button className="primary-btn full" type="submit">Enviar mensaje</button>
          </form>
        </div>
      </div>
    </section>
  )
}
