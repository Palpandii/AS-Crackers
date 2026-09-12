import { useLanguage } from '../context/LanguageContext.jsx'

export default function LanguageToggle({ compact = false }) {
  const { lang, toggleLang } = useLanguage()

  if (compact) {
    return (
      <button
        onClick={toggleLang}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          fontWeight: 700,
          cursor: 'pointer',
        }}
        aria-label="Toggle language"
      >
        {lang === 'en' ? 'தமிழ்' : 'English'}
      </button>
    )
  }

  return (
    <div className="lang-switch">
      <button
        className={lang === 'en' ? 'is-active' : ''}
        onClick={() => lang !== 'en' && toggleLang()}
      >
        EN
      </button>
      <button
        className={lang === 'ta' ? 'is-active' : ''}
        onClick={() => lang !== 'ta' && toggleLang()}
      >
        தமிழ்
      </button>
    </div>
  )
}
