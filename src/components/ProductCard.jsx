import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useCart } from '../hooks/useCart.js'
import QuantitySelector from './QuantitySelector.jsx'
import './ProductCard.css'

const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })

export default function ProductCard({ product }) {
  const { t, pickField } = useLanguage()
  const { qtyOf, increment, decrement, setQty } = useCart()
  const qty = qtyOf(product.id)

  const hasDiscount = product.mrp > product.price
  const pct = hasDiscount ? Math.round((1 - product.price / product.mrp) * 100) : 0
  const accent = Number(product.id) % 6
  const name = pickField(product, 'name')

  return (
    <div className={`product-card accent-${accent}`}>
      {/* Fixed-height image stage: every card gets the same stage, so rows line up */}
      <Link
        to={`/product/${product.id}`}
        className="thumb-wrap"
        style={{ '--img': `url("${product.image}")` }}
      >
        <ImageWithFallback src={product.image} alt={name} />

        {pct > 0 && <span className="off-badge">{pct}% OFF</span>}

        {product.youtube_id && (
          <span className="yt-badge" aria-label="Has video">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        )}
      </Link>

      <div className="body">
        <span className="pack-tag">{product.qty_unit}</span>

        <Link to={`/product/${product.id}`} className="name" title={name}>
          {name}
        </Link>

        <div className="price-row">
          <span className="price">₹{fmt(product.price)}</span>
          {hasDiscount && <span className="mrp">₹{fmt(product.mrp)}</span>}
        </div>

        {/* Pinned to the bottom of every card */}
        <div className="footer-row">
          {qty === 0 ? (
            <button className="add-btn" onClick={() => setQty(product, 1)}>
              {t('cta.addToCart')}
            </button>
          ) : (
            <QuantitySelector
              qty={qty}
              onIncrement={() => increment(product)}
              onDecrement={() => decrement(product)}
              onChange={(v) => setQty(product, v)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ImageWithFallback({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.style.display = 'none'
        e.currentTarget.parentElement.insertAdjacentHTML(
          'beforeend',
          '<div class="thumb-fallback">🎆</div>'
        )
      }}
    />
  )
}