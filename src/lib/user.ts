import { create } from 'zustand'

interface UserState {
  profileData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    department: string
    company: string
    bio: string
  }
  updateProfile: (data: UserState['profileData']) => void
}

export const useUser = create<UserState>((set) => ({
  profileData: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "HR Manager",
    department: "Human Resources",
    company: "TalentFlow Inc.",
    bio: "Experienced HR professional with a passion for talent acquisition and development."
  },
  updateProfile: (data) => set({ profileData: data })
}))