import { useEffect, useState } from 'react'

export function ProductCarousel({ images, alt }) {
  const safeImages = images?.length ? images : [{ image_url: '/products/porta-menu-1.jpeg' }]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeImages.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [safeImages.length])

  return (
    <div className="carousel">
      <img src={safeImages[index].image_url} alt={alt} className="carousel-image" />
      <button type="button" className="carousel-arrow left" onClick={() => setIndex((index - 1 + safeImages.length) % safeImages.length)}>
        ‹
      </button>
      <button type="button" className="carousel-arrow right" onClick={() => setIndex((index + 1) % safeImages.length)}>
        ›
      </button>
      <div className="carousel-dots">
        {safeImages.map((item, dotIndex) => (
          <button key={item.id || item.image_url} type="button" className={dotIndex === index ? 'dot active' : 'dot'} onClick={() => setIndex(dotIndex)} />
        ))}
      </div>
    </div>
  )
}
