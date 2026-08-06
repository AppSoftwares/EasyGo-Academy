import { create } from 'zustand'

export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: () => {
    set({ isLoading: true })
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      set({ users, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  createUser: (userData) => {
    const users = [...get().users]
    const newUser = {
      id: users.length + 1,
      ...userData,
      active: true,
      plan: 'basic',
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    set({ users })
    return newUser
  },

  updateUser: (userId, userData) => {
    const users = get().users.map(u => 
      u.id === userId ? { ...u, ...userData } : u
    )
    localStorage.setItem('users', JSON.stringify(users))
    set({ users })
  },

  deleteUser: (userId) => {
    const users = get().users.filter(u => u.id !== userId)
    localStorage.setItem('users', JSON.stringify(users))
    set({ users })
  },

  getStats: () => {
    const users = get().users
    return {
      total: users.length,
      active: users.filter(u => u.active).length,
      premium: users.filter(u => u.plan === 'premium').length,
      newToday: users.filter(u => {
        const created = new Date(u.createdAt)
        const today = new Date()
        return created.toDateString() === today.toDateString()
      }).length
    }
  }
}))