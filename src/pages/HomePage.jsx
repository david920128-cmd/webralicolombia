import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useAppStore } from '../store'

const benefits = [
  'Fabricación personalizada',
  'Entregas responsables',
  'Atención por WhatsApp',
]

const trustPoints = [
  {
    title: 'Diseños personalizados',
    text: 'Creamos porta menús, carpetas y trabajos especiales adaptados a la imagen de cada cliente.',
  },
  {
    title: 'Materiales de gran presentación',
    text: 'Acabados elegantes, resistentes y pensados para proyectar calidad en negocios e instituciones.',
  },
  {
    title: 'Atención para empresas e instituciones',
    text: 'Acompañamos pedidos para restaurantes, colegios, universidades, eventos y marcas.',
  },
  {
    title: 'Cotización rápida por WhatsApp',
    text: 'Respondemos de forma ágil para ayudarte a elegir el producto ideal y avanzar con tu pedido.',
  },
]

export function HomePage() {
  const { settings, products } = useAppStore()
  const activeProducts = products.filter((item) => item.active)
  const featured = activeProducts.slice(0, 3)
  const galleryImages = activeProducts.flatMap((product) => (product.images || []).slice(0, 2)).slice(0, 6)
  const genericMessage = encodeURIComponent('Hola, quiero información y cotización de sus productos.')

  return (
    <>
      <section className="hero hero-premium">
        <div className="container hero-grid">
          <div>
            <h1>Fabricamos Porta Menús, Carpetas de Grado y Productos Personalizados</h1>
            <p>
              Calidad, presentación y cumplimiento para negocios, instituciones y eventos especiales.
              Diseñamos productos llamativos que ayudan a proyectar una mejor imagen ante tus clientes.
            </p>
            <div className="hero-actions">
              <Link className="primary-btn" to="/catalogo">Ver catálogo</Link>
              <a
                className="secondary-btn"
                href={`https://wa.me/57${settings.whatsapp}?text=${genericMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                Solicitar cotización
              </a>
            </div>
            <div className="hero-pills">
              {benefits.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="hero-trust-strip">
              <div>
                <strong>Imagen profesional</strong>
                <span>Productos que resaltan tu marca o institución.</span>
              </div>
              <div>
                <strong>Atención directa</strong>
                <span>Respuesta rápida y acompañamiento por WhatsApp.</span>
              </div>
            </div>
          </div>
          <div className="hero-card premium-frame">
            <img src={settings.hero_image_url} alt="Producto RALI" />
          </div>
        </div>
      </section>

      <section className="section compact-top">
        <div className="container">
          <div className="section-heading centered">
            <h2>¿Por qué elegir a RALI?</h2>
            <p>Más que productos, entregamos presentación, imagen y calidad para tu marca o institución.</p>
          </div>
          <div className="trust-grid">
            {trustPoints.map((item) => (
              <article key={item.title} className="trust-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section products-section">
        <div className="container">
          <div className="section-heading section-heading-split">
            <div>
              <span className="section-kicker">Catálogo destacado</span>
              <h2>Nuestros productos</h2>
              <p>Porta menús, carpetas de grado y soluciones personalizadas listas para cotizar de inmediato.</p>
            </div>
            <a
              className="secondary-btn"
              href={`https://wa.me/57${settings.whatsapp}?text=${genericMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              Cotizar por WhatsApp
            </a>
          </div>
          <div className="cards-grid premium-cards-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} whatsapp={settings.whatsapp} />
            ))}
          </div>
        </div>
      </section>

      <section className="section showcase-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-kicker">Trabajos realizados</span>
            <h2>Una muestra de nuestra producción</h2>
            <p>Conoce algunos de nuestros productos elaborados para clientes reales.</p>
          </div>
          <div className="showcase-grid">
            {galleryImages.map((image, index) => (
              <div className="showcase-card" key={`${image.image_url}-${index}`}>
                <img src={image.image_url} alt={`Trabajo RALI ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section closing-cta-section">
        <div className="container">
          <div className="closing-cta">
            <div>
              <span className="section-kicker">Solicita tu cotización</span>
              <h2>Estamos listos para ayudarte con tu próximo pedido</h2>
              <p>
                Escríbenos y te asesoramos para encontrar la mejor opción en porta menús, carpetas de grado
                y productos personalizados para tu negocio o institución.
              </p>
            </div>
            <div className="button-row">
              <a
                className="primary-btn"
                href={`https://wa.me/57${settings.whatsapp}?text=${genericMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                Hablar por WhatsApp
              </a>
              <Link className="secondary-btn" to="/contacto">Ir a contacto</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
