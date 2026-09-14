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
          <img
            src="/images/hero-banner.jpg"
            alt="AS Crackers Sivakasi"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  )
}