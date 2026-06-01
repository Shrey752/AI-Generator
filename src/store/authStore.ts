import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Buyer } from '../types/database'

interface AuthState {
  user: User | null
  buyer: Buyer | null
  isAdmin: boolean
  loading: boolean
  setUser: (user: User | null) => void
  setBuyer: (buyer: Buyer | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  buyer: null,
  isAdmin: false,
  loading: true,

  setUser: (user) => set({ user, isAdmin: user?.email === ADMIN_EMAIL }),
  setBuyer: (buyer) => set({ buyer }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user ?? null
    set({ user, isAdmin: user?.email === ADMIN_EMAIL })

    if (user && user.email !== ADMIN_EMAIL) {
      const { data } = await supabase
        .from('buyers')
        .select('*')
        .eq('id', user.id)
        .single()
      set({ buyer: data })
    }

    set({ loading: false })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      set({ user: u, isAdmin: u?.email === ADMIN_EMAIL })

      if (u && u.email !== ADMIN_EMAIL) {
        const { data } = await supabase
          .from('buyers')
          .select('*')
          .eq('id', u.id)
          .single()
        set({ buyer: data })
      } else {
        set({ buyer: null })
      }
    })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, buyer: null, isAdmin: false })
  },
}))
