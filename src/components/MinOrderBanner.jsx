import { useLanguage } from '../context/LanguageContext.jsx'
import { useCart } from '../hooks/useCart.js'
import './MinOrderBanner.css'

export const MIN_ORDER = Number(import.meta.env.VITE_MIN_ORDER) || 2000

const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

/**
 * Yellow "minimum order" notice.
 *  - variant="strip": slim bar for the products page
 *  - variant="cart" : bigger box with progress bar for the cart drawer
 * Turns green once the cart total reaches the minimum.
 */
export default function MinOrderBanner({ variant = 'strip' }) {
    const { t } = useLanguage()
    const { totalPrice } = useCart()

    const reached = totalPrice >= MIN_ORDER
    const remaining = Math.max(0, Math.ceil(MIN_ORDER - totalPrice))
    const pct = Math.min(100, Math.round((totalPrice / MIN_ORDER) * 100))

    return (
        <div className={`min-order ${variant}${reached ? ' reached' : ''}`} role="status">
            <div className="mo-row">
                <span className="mo-icon" aria-hidden="true">{reached ? '✓' : '!'}</span>
                <div className="mo-text">
                    <b>{t('minorder.label')}: ₹{fmt(MIN_ORDER)}</b>
                    {variant === 'cart' && (
                        <span>
                            {reached
                                ? t('minorder.reached')
                                : t('minorder.addMore').replace('{amount}', fmt(remaining))}
                        </span>
                    )}
                </div>
            </div>

            {variant === 'cart' && (
                <div className="mo-track" aria-hidden="true">
                    <div className="mo-fill" style={{ width: `${pct}%` }} />
                </div>
            )}
        </div>
    )
}