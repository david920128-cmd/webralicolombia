export function WhatsAppButton({ whatsapp }) {
  return (
    <a
      className="whatsapp-floating"
      href={`https://wa.me/57${whatsapp}?text=${encodeURIComponent('Hola, quiero información sobre sus productos.')}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      WhatsApp
    </a>
  )
}
