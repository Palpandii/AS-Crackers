const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://as-crackers-backend-production.up.railway.app'

function normalizeProduct(p) {
    return {
        id: p.id,
        category: p.category,
        name_en: p.nameEn ?? p.name_en ?? '',
        name_ta: p.nameTa ?? p.name_ta ?? '',
        qty_unit: p.qtyUnit ?? p.qty_unit ?? '',
        mrp: p.mrp,
        price: p.price,
        image: p.image || '',
        youtube_id: p.youtubeId ?? p.youtube_id ?? '',
    }
}

function normalizeCategory(c) {
    return {
        id: c.id,
        name_en: c.nameEn ?? c.name_en ?? '',
        name_ta: c.nameTa ?? c.name_ta ?? '',
        image: c.image || '',
    }
}

let productsCache = null
let productsInFlight = null

export async function fetchProducts() {
    if (productsCache) return productsCache
    if (!productsInFlight) {
        productsInFlight = fetch(`${API_BASE}/api/products`)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load products (${res.status})`)
                return res.json()
            })
            .then((data) => {
                productsCache = data.map(normalizeProduct)
                return productsCache
            })
            .finally(() => {
                productsInFlight = null
            })
    }
    return productsInFlight
}

let categoriesCache = null
let categoriesInFlight = null

export async function fetchCategories() {
    if (categoriesCache) return categoriesCache
    if (!categoriesInFlight) {
        categoriesInFlight = fetch(`${API_BASE}/api/categories`)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load categories (${res.status})`)
                return res.json()
            })
            .then((data) => {
                categoriesCache = data.map(normalizeCategory)
                return categoriesCache
            })
            .finally(() => {
                categoriesInFlight = null
            })
    }
    return categoriesInFlight
}

export function clearCatalogCache() {
    productsCache = null
    categoriesCache = null
}

export async function placeOrder(payload, timeoutMs = 8000) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
        const res = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
        })
        if (!res.ok) {
            let message = `Order could not be saved (${res.status})`
            try { message = (await res.json()).error || message } catch { /* not JSON */ }
            throw new Error(message)
        }
        return await res.json()
    } finally {
        clearTimeout(timer)
    }
}

export { API_BASE }