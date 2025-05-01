import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { getProfile } from '~/apis/auth.api'
import { AxiosError } from 'axios'

interface UserContextType {
  avatar: string
  updateAvatar: (newAvatar: string) => void
  refreshAvatar: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [avatar, setAvatar] = useState<string>('')

  const refreshAvatar = useCallback(async () => {
    try {
      // Only try to fetch avatar if we have a token
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const response = await getProfile()
      if (response.data.avatar) {
        setAvatar(response.data.avatar)
      }
    } catch (error) {
      // If we get a 401, clear the avatar
      if (error instanceof AxiosError && error.response?.status === 401) {
        setAvatar('')
      } else {
        console.error('Error fetching avatar:', error)
      }
    }
  }, [])

  useEffect(() => {
    refreshAvatar()
  }, [refreshAvatar])

  const updateAvatar = useCallback((newAvatar: string) => {
    setAvatar(newAvatar)
  }, [])

  return <UserContext.Provider value={{ avatar, updateAvatar, refreshAvatar }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
