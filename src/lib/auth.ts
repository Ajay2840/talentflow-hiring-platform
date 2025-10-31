import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  login: (user: any) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('auth_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  login: (user) => {
    localStorage.setItem('auth_token', 'dummy_token') // Replace with real token
    localStorage.setItem('user', JSON.stringify(user))
    set({ isAuthenticated: true, user })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    set({ isAuthenticated: false, user: null })
  }
}))