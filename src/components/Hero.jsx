import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import './Hero.css'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero">
      <div className="hero-rays" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="container">
        <div>
          <span className="hero-kicker">
            <span className="dot" />
            {t('home.heroKicker')}
          </span>
          <h1>{t('home.heroTitle')}</h1>
          <p className="sub">{t('home.heroSub')}</p>
          <div className="hero-ctas">
            <Link to="/products" className="btn btn-gold">{t('home.heroCta1')}</Link>
            <Link to="/categories" className="btn btn-ghost">{t('home.heroCta2')}</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><b>191</b><span>{t('home.statBoxes')}</span></div>
            <div className="stat"><b>24</b><span>{t('products.items')}</span></div>
            <div className="stat"><b>9+</b><span>{t('home.statYears')}</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <svg className="burst" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16
              const len = i % 2 === 0 ? 78 : 52
              const x2 = 100 + len * Math.cos((angle * Math.PI) / 180)
              const y2 = 100 + len * Math.sin((angle * Math.PI) / 180)
              return (
                <line
                  key={i}
                  x1="100" y1="100" x2={x2} y2={y2}
                  stroke={i % 3 === 0 ? '#E23E33' : '#F5A623'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )
            })}
            <circle cx="100" cy="100" r="14" fill="#FBF3E4" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="#F5A623" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>
      </div>
    </section>
  )
}