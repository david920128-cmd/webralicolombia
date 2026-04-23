import { ProductCarousel } from './ProductCarousel'

export function ProductCard({ product, whatsapp }) {
  const quoteText = `Hola, estoy interesado en este producto: ${product.name}`

  return (
    <article className="product-card premium-product-card">
      <ProductCarousel images={product.images} alt={product.name} />
      <div className="product-card-body">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <strong>{product.price}</strong>
        <a
          className="primary-btn full"
          href={`https://wa.me/57${whatsapp}?text=${encodeURIComponent(quoteText)}`}
          target="_blank"
          rel="noreferrer"
        >
          Cotizar este producto
        </a>
      </div>
    </article>
  )
}
