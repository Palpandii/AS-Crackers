import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useCategory } from '../hooks/useCategory.js'
import { categories } from '../data/categories.js'
import './Products.css'

export default function Products() {
  const { t, pickField, pickBoth, tBoth } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  const { results, loading, error } = useCategory(activeCategory, search)

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setSearchParams(next)
  }

  const activeLabel = useMemo(() => {
    if (activeCategory === 'all') {
      const { en, ta } = tBoth('products.filterAll')
      return `${en} / ${ta}`
    }
    const cat = categories.find((c) => c.id === activeCategory)
    if (!cat) {
      const { en, ta } = tBoth('products.filterAll')
      return `${en} / ${ta}`
    }
    const { en, ta } = pickBoth(cat, 'name')
    return `${en} / ${ta}`
  }, [activeCategory, tBoth, pickBoth])

  return (
    <div className="page-shell">
      <div className="page-banner">
        <div className="container">
          <span className="crumb">{t('nav.home')} / <b>{t('nav.products')}</b></span>
          <h1>{t('products.title')}</h1>
          <p>{t('products.sub')}</p>
        </div>
      </div>

      <div className="container products-layout">
        <aside className="filter-panel">
          <h4>{t('products.filterAll')}</h4>
          <div className={`cat-list${filtersExpanded ? ' expanded' : ''}`}>
            <button
              className={`cat-btn${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setCategory('all')}
            >
              <span className="bi">
                <span className="bi-en">{tBoth('products.filterAll').en}</span>
                <span className="bi-ta">{tBoth('products.filterAll').ta}</span>
              </span>
            </button>
            {categories.map((c) => {
              const { en, ta } = pickBoth(c, 'name')
              return (
                <button
                  key={c.id}
                  className={`cat-btn${activeCategory === c.id ? ' active' : ''}`}
                  onClick={() => setCategory(c.id)}
                >
                  <span className="bi">
                    <span className="bi-en">{en}</span>
                    <span className="bi-ta">{ta}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setFiltersExpanded((v) => !v)}
          >
            {filtersExpanded ? '▲ Show less' : '▼ Show all categories'}
          </button>
        </aside>

        <div>
          <div className="products-meta">
            <span>{t('products.showing')} <b>{results.length}</b> {t('products.items')} — {activeLabel}</span>
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {results.length === 0 ? (
            <div className="empty-state">{t('products.empty')}</div>
          ) : (
            <div className="product-grid">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}