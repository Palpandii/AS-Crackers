import { useMemo } from 'react'
import { useProducts } from './useProducts.js'

export function useCategory(categoryId, searchTerm = '') {
  const { products, loading, error } = useProducts()

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory = !categoryId || categoryId === 'all' || p.category === categoryId
      const matchesSearch =
        !term ||
        p.name_en.toLowerCase().includes(term) ||
        (p.name_ta || '').toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }, [products, categoryId, searchTerm])

  return { results, loading, error }
}