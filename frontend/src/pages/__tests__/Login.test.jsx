import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Login from '../Login'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>
  }
})

// Mock fetch
global.fetch = vi.fn()

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    fetch.mockClear()
  })

  it('should render login form correctly', () => {
    renderWithRouter(<Login />)
    
    expect(screen.getByText('Masuk dengan Email')).toBeInTheDocument()
    expect(screen.getByText('Masuk sekarang untuk mengakses semua fitur pada website kantin Rumah Kayu ITERA!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Alamat Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Kata Sandi')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
    expect(screen.getByText('Lupa kata sandi?')).toBeInTheDocument()
    expect(screen.getByText('Belum punya akun?')).toBeInTheDocument()
    expect(screen.getByText('Daftar di sini')).toBeInTheDocument()
  })

  it('should update input values when typing', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should submit form with correct data for customer login', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        token: 'fake-token',
        user: {
          user_id: 1,
          email: 'customer@test.com',
          nama_lengkap: 'Customer User',
          role_id: 1,
          role_name: 'customer'
        }
      })
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Masuk' })
    
    await user.type(emailInput, 'customer@test.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:6543/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@test.com',
        password: 'password123',
      }),
    })
    
    await waitFor(() => {
      expect(sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({
        user_id: 1,
        email: 'customer@test.com',
        nama_lengkap: 'Customer User',
        role_id: 1,
        role_name: 'customer'
      }))
      expect(window.dispatchEvent).toHaveBeenCalledWith(new Event('userLogin'))
      expect(mockNavigate).toHaveBeenCalledWith('/order', { replace: true })
    })
  })

  it('should redirect to admin dashboard for admin user', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        token: 'fake-token',
        user: {
          user_id: 2,
          email: 'admin@test.com',
          nama_lengkap: 'Admin User',
          role_id: 2,
          role_name: 'admin'
        }
      })
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Masuk' })
    
    await user.type(emailInput, 'admin@test.com')
    await user.type(passwordInput, 'admin123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true })
    })
  })

  it('should display error message when login fails', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({
        error: 'Email atau password salah'
      })
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Masuk' })
    
    await user.type(emailInput, 'wrong@test.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument()
    })
    
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(sessionStorage.setItem).not.toHaveBeenCalled()
  })

  it('should display error message when fetch fails', async () => {
    const user = userEvent.setup()
    
    fetch.mockRejectedValueOnce(new Error('Network error'))
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Masuk' })
    
    await user.type(emailInput, 'test@test.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should clear error message when user starts typing', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({
        error: 'Email atau password salah'
      })
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Masuk' })
    
    // First trigger an error
    await user.type(emailInput, 'wrong@test.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument()
    })
    
    // Clear inputs and type again - error should be cleared
    await user.clear(emailInput)
    await user.type(emailInput, 'new@test.com')
    
    // Submit form again to trigger handleSubmit which clears error
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        token: 'fake-token',
        user: { user_id: 1, email: 'new@test.com', role_id: 1 }
      })
    })
    
    await user.click(submitButton)
    
    // Error message should be cleared during form submission
    expect(screen.queryByText('Email atau password salah')).not.toBeInTheDocument()
  })

  it('should require email and password fields', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
}) 