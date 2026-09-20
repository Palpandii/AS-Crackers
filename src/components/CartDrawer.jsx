import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useCart } from '../hooks/useCart.js'
import { buildWhatsAppOrderUrl } from '../utils/whatsapp.js'
import { placeOrder } from '../data/api.js'
import { MIN_ORDER_AMOUNT, formatINR } from '../config/order.js'
import './CartDrawer.css'

export default function CartDrawer() {
  const { t, pickField, lang } = useLanguage()
  const { items, isOpen, setIsOpen, increment, decrement, removeItem, clearCart, totalPrice } = useCart()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [fulfillment, setFulfillment] = useState('pickup')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const isDelivery = fulfillment === 'delivery'
  const belowMin = totalPrice < MIN_ORDER_AMOUNT
  const phoneDigits = customerPhone.replace(/\D/g, '')
  const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 13
  const nameOk = customerName.trim() !== ''
  const addressOk = !isDelivery || customerAddress.trim() !== ''

  const canCheckout =
    items.length > 0 && !belowMin && nameOk && phoneValid && addressOk && !submitting

  // Tell the customer the first thing that is still missing
  let hint = ''
  if (items.length > 0 && !belowMin) {
    if (!nameOk || customerPhone.trim() === '') hint = t('cart.fillDetails')
    else if (!phoneValid) hint = t('cart.invalidPhone')
    else if (!addressOk) hint = t('cart.fillAddress')
  }

  const whatsappUrl = buildWhatsAppOrderUrl(items, totalPrice, lang, {
    customerName,
    customerPhone,
    customerAddress,
    fulfillment,
  })

  // 1) save the order to our backend (so it shows in the Admin panel)
  // 2) open WhatsApp with the order message
  // The blank tab is opened synchronously inside the click so phone browsers don't block it.
  async function handleCheckout(e) {
    e.preventDefault()
    if (!canCheckout) return
    setSubmitting(true)

    const win = window.open('', '_blank')
    if (win) win.opener = null

    try {
      await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: isDelivery ? customerAddress.trim() : '',
        fulfillmentType: isDelivery ? 'DELIVERY' : 'PICKUP',
        totalAmount: totalPrice,
        items: items.map((i) => ({
          productId: i.id,
          productName: i.name_en,
          quantity: i.qty,
          unitPrice: i.price,
        })),
      })
    } catch (err) {
      // Never block the customer's WhatsApp order because saving failed
      console.error('Could not save order to backend:', err)
    }

    if (win) win.location.href = whatsappUrl
    else window.location.href = whatsappUrl
    setSubmitting(false)
  }

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      <aside className="cart-drawer" role="dialog" aria-label={t('cart.title')}>
        <div className="head">
          <h3>{t('cart.title')}</h3>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="list">
          {items.length === 0 && <p className="empty">{t('cart.empty')}</p>}
          {items.map((item) => (
            <div className="cart-line" key={item.id}>
              <img src={item.image} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
              <div className="info">
                <div className="name">{pickField(item, 'name')}</div>
                <div className="price">₹{item.price} × {item.qty} = ₹{(item.price * item.qty).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button className="cart-line-btn" onClick={() => decrement(item)} aria-label="Decrease" style={qtyBtnStyle}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                  <button className="cart-line-btn" onClick={() => increment(item)} aria-label="Increase" style={qtyBtnStyle}>+</button>
                </div>
                <button className="remove" onClick={() => removeItem(item.id)}>{t('cart.remove')}</button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className={`cart-min-note${belowMin ? '' : ' ok'}`}>
            {belowMin
              ? t('cart.belowMin')
                .replace('{need}', formatINR(Math.ceil(MIN_ORDER_AMOUNT - totalPrice)))
                .replace('{min}', formatINR(MIN_ORDER_AMOUNT))
              : t('cart.minReached')}
          </div>
        )}

        {items.length > 0 && (
          <div className="cart-customer-details" style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={detailsLabelStyle}>{t('cart.nameLabel')}</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('cart.namePlaceholder')}
                disabled={belowMin}
                maxLength={100}
                style={inputStyle(belowMin)}
              />
            </div>
            <div>
              <label style={detailsLabelStyle}>{t('cart.phoneLabel')}</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t('cart.phonePlaceholder')}
                disabled={belowMin}
                maxLength={15}
                style={inputStyle(belowMin)}
              />
            </div>
            <div>
              <label style={detailsLabelStyle}>{t('cart.fulfillment')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  disabled={belowMin}
                  onClick={() => setFulfillment('pickup')}
                  style={fulfillmentBtnStyle(fulfillment === 'pickup', belowMin)}
                >
                  {t('cart.pickup')}
                </button>
                <button
                  type="button"
                  disabled={belowMin}
                  onClick={() => setFulfillment('delivery')}
                  style={fulfillmentBtnStyle(fulfillment === 'delivery', belowMin)}
                >
                  {t('cart.delivery')}
                </button>
              </div>
            </div>
            {isDelivery && (
              <div>
                <label style={detailsLabelStyle}>{t('cart.addressLabel')}</label>
                <textarea
                  rows={3}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={t('cart.addressPlaceholder')}
                  disabled={belowMin}
                  maxLength={250}
                  style={{ ...inputStyle(belowMin), resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            )}
          </div>
        )}

        <div className="foot">
          <div className="total-row">
            <span>{t('cart.total')}</span>
            <b>₹{totalPrice.toFixed(2)}</b>
          </div>
          {hint && (
            <p className="cart-details-hint" style={{ fontSize: 12, color: '#b45309', margin: '0 0 8px' }}>
              {hint}
            </p>
          )}
          <div className="actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-emerald"
              aria-disabled={!canCheckout}
              style={{ width: '100%', opacity: canCheckout ? 1 : 0.5, pointerEvents: canCheckout ? 'auto' : 'none' }}
              onClick={handleCheckout}
            >
              {submitting ? t('cart.placing') : t('cart.checkout')}
            </a>
          </div>
          {items.length > 0 && (
            <button className="clear-link" onClick={clearCart}>{t('cart.clear')}</button>
          )}
        </div>
      </aside>
    </>
  )
}

const detailsLabelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4, color: 'rgba(27,19,48,0.7)',
}

// `locked` = cart is below the minimum order, so the field can't be used yet
function inputStyle(locked) {
  return {
    width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(27,19,48,0.2)', fontSize: 14,
    background: locked ? '#EDE7DA' : '#fff',
    opacity: locked ? 0.6 : 1,
    cursor: locked ? 'not-allowed' : 'text',
  }
}

function fulfillmentBtnStyle(active, locked) {
  return {
    flex: 1, padding: '8px 10px', borderRadius: 8, fontWeight: 700, fontSize: 13,
    cursor: locked ? 'not-allowed' : 'pointer',
    opacity: locked ? 0.55 : 1,
    border: active ? '1px solid #0f9d78' : '1px solid rgba(27,19,48,0.2)',
    background: active ? '#0f9d78' : '#fff',
    color: active ? '#fff' : '#1b1330',
  }
}

const qtyBtnStyle = {
  width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(27,19,48,0.2)',
  background: '#fff', fontWeight: 800, lineHeight: 1, cursor: 'pointer',
}