import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types/database'

export interface CartItem {
  product: Product
  quantity: string
  preferred_shade: string
  buyer_notes: string
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  updateItem: (productId: string, updates: Partial<Omit<CartItem, 'product'>>) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  hasItem: (productId: string) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (!get().hasItem(product.id)) {
          set((s) => ({
            items: [...s.items, { product, quantity: '', preferred_shade: '', buyer_notes: '' }],
          }))
        }
      },

      updateItem: (productId, updates) => {
        set((s) => ({
          items: s.items.map((item) =>
            item.product.id === productId ? { ...item, ...updates } : item
          ),
        }))
      },

      removeItem: (productId) => {
        set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) }))
      },

      clearCart: () => set({ items: [] }),

      hasItem: (productId) => get().items.some((i) => i.product.id === productId),
    }),
    { name: 'nemideep-cart' }
  )
)
