import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isAuthenticated, getCurrentUser, logout, requireAuth } from '../auth'

describe('Auth Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  describe('isAuthenticated', () => {
    it('should return true when user data exists in sessionStorage', () => {
      sessionStorage.getItem.mockReturnValue('{"user_id": 1, "email": "test@example.com"}')
      
      expect(isAuthenticated()).toBe(true)
      expect(sessionStorage.getItem).toHaveBeenCalledWith('user')
    })

    it('should return false when user data does not exist in sessionStorage', () => {
      sessionStorage.getItem.mockReturnValue(null)
      
      expect(isAuthenticated()).toBe(false)
      expect(sessionStorage.getItem).toHaveBeenCalledWith('user')
    })
  })

  describe('getCurrentUser', () => {
    it('should return parsed user data when valid JSON exists', () => {
      const userData = { user_id: 1, email: 'test@example.com', nama_lengkap: 'Test User' }
      sessionStorage.getItem.mockReturnValue(JSON.stringify(userData))
      
      const result = getCurrentUser()
      
      expect(result).toEqual(userData)
      expect(sessionStorage.getItem).toHaveBeenCalledWith('user')
    })

    it('should return null when no user data exists', () => {
      sessionStorage.getItem.mockReturnValue(null)
      
      const result = getCurrentUser()
      
      expect(result).toBeNull()
      expect(sessionStorage.getItem).toHaveBeenCalledWith('user')
    })

    it('should handle invalid JSON and return null', () => {
      sessionStorage.getItem.mockReturnValue('invalid-json')
      
      const result = getCurrentUser()
      
      expect(result).toBeNull()
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('user')
      expect(console.error).toHaveBeenCalled()
    })

    it('should return null when JSON parsing throws error', () => {
      sessionStorage.getItem.mockReturnValue('{"invalid": json}')
      
      const result = getCurrentUser()
      
      expect(result).toBeNull()
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('logout', () => {
    it('should remove user data from sessionStorage and dispatch logout event', () => {
      logout()
      
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('user')
      expect(window.dispatchEvent).toHaveBeenCalledWith(new Event('userLogout'))
    })
  })

  describe('requireAuth', () => {
    it('should return true when user is authenticated', () => {
      sessionStorage.getItem.mockReturnValue('{"user_id": 1}')
      const mockNavigate = vi.fn()
      
      const result = requireAuth(mockNavigate)
      
      expect(result).toBe(true)
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should navigate to login and return false when user is not authenticated', () => {
      sessionStorage.getItem.mockReturnValue(null)
      const mockNavigate = vi.fn()
      
      const result = requireAuth(mockNavigate)
      
      expect(result).toBe(false)
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
}) 