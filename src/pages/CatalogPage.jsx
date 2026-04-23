import { ProductCard } from '../components/ProductCard'
import { useAppStore } from '../store'

export function CatalogPage() {
  const { settings, products } = useAppStore()

  return (
    <section className="section products-section">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-kicker">Catálogo comercial</span>
          <h1>Productos listos para cotizar</h1>
          <p>Explora nuestros productos con mostrador automático y cotización directa por WhatsApp.</p>
        </div>
        <div className="cards-grid premium-cards-grid">
          {products.filter((item) => item.active).map((product) => (
            <ProductCard key={product.id} product={product} whatsapp={settings.whatsapp} />
          ))}
        </div>
      </div>
    </section>
  )
}
