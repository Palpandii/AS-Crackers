import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import './ContentPages.css'

export default function ContactUs() {
  const { t, lang } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', msg: '' })

  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const altPhone = import.meta.env.VITE_ALT_PHONE || ''
  const address = import.meta.env.VITE_BUSINESS_ADDRESS || ''
  const email = import.meta.env.VITE_BUSINESS_EMAIL || ''
  const mapsEmbed = import.meta.env.VITE_MAPS_EMBED_URL || ''

  const sendWhatsapp = (e) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `${lang === 'ta' ? 'பெயர்' : 'Name'}: ${form.name}\n${lang === 'ta' ? 'தொலைபேசி' : 'Phone'}: ${form.phone}\n${form.msg}`
    )
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-shell">
      <div className="page-banner">
        <div className="container">
          <span className="crumb">{t('nav.home')} / <b>{t('nav.contact')}</b></span>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.sub')}</p>
        </div>
      </div>

      <div className="container content-layout">
        <div>
          <div className="contact-cards">
            <div className="contact-card">
              <span className="ic">📍</span>
              <div>
                <h4>{t('contact.address')}</h4>
                <p>{address}</p>
              </div>
            </div>
            <div className="contact-card">
              <span className="ic">📞</span>
              <div>
                <h4>{t('contact.phone')}</h4>
                <p>+{phone}{altPhone && `, +${altPhone}`}</p>
                <a className="btn btn-gold" href={`tel:+${phone}`}>{t('contact.callNow')}</a>
              </div>
            </div>
            <div className="contact-card">
              <span className="ic">💬</span>
              <div>
                <h4>WhatsApp</h4>
                <p>+{phone}</p>
                <a
                  className="btn btn-emerald"
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('contact.whatsappNow')}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <span className="ic">✉️</span>
              <div>
                <h4>{t('contact.email')}</h4>
                <p>{email}</p>
              </div>
            </div>
            <div className="contact-card">
              <span className="ic">🕒</span>
              <div>
                <h4>{t('contact.hours')}</h4>
                <p>{t('contact.hoursValue')}</p>
              </div>
            </div>
          </div>

          <div className="map-embed" style={{ marginTop: 18 }}>
            {mapsEmbed ? (
              <iframe src={mapsEmbed} loading="lazy" title="AS Crackers location" />
            ) : (
              <div className="map-fallback">{address}</div>
            )}
          </div>
        </div>

        <form className="contact-form" onSubmit={sendWhatsapp}>
          <h3 style={{ margin: '0 0 4px', color: 'var(--ink)' }}>{t('contact.formTitle')}</h3>
          <input
            type="text"
            placeholder={t('contact.formName')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder={t('contact.formPhone')}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <textarea
            rows="4"
            placeholder={t('contact.formMsg')}
            value={form.msg}
            onChange={(e) => setForm({ ...form, msg: e.target.value })}
          />
          <button type="submit" className="btn btn-emerald">{t('contact.formSend')}</button>
        </form>
      </div>
    </div>
  )
}
