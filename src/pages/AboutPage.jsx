import { useAppStore } from '../store'

export function AboutPage() {
  const { settings } = useAppStore()

  return (
    <section className="section about-section">
      <div className="container narrow">
        <div className="panel about-panel">
          <span className="section-kicker">Quiénes somos</span>
          <h1>Experiencia, presentación y calidad para cada pedido</h1>
          <p>{settings.about_text}</p>
          <div className="three-col">
            <div className="mini-card"><h3>Misión</h3><p>{settings.mission}</p></div>
            <div className="mini-card"><h3>Visión</h3><p>{settings.vision}</p></div>
            <div className="mini-card"><h3>Valores</h3><p>{settings.values_text}</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
