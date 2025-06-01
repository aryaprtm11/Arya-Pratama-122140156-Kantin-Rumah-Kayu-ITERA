import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import Register from '../Register'

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

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockClear()
  })

  it('should render register form correctly', () => {
    renderWithRouter(<Register />)
    
    expect(screen.getByText('Buat Akun Baru')).toBeInTheDocument()
    expect(screen.getByText('Gabung sekarang untuk mengakses semua fitur pada website kantin Rumah Kayu ITERA!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nama Lengkap')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Alamat Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Kata Sandi')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Daftar' })).toBeInTheDocument()
    expect(screen.getByText('Sudah punya akun?')).toBeInTheDocument()
    expect(screen.getByText('Masuk di sini')).toBeInTheDocument()
  })

  it('should update input values when typing', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Register />)
    
    const namaInput = screen.getByPlaceholderText('Nama Lengkap')
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    
    await user.type(namaInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(namaInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should submit form with correct data and navigate to login on success', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'Registrasi berhasil'
      })
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Register />)
    
    const namaInput = screen.getByPlaceholderText('Nama Lengkap')
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Daftar' })
    
    await user.type(namaInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:6543/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nama_lengkap: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('should display error message when registration fails with server error', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({
        error: 'Email sudah terdaftar'
      })
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Register />)
    
    const namaInput = screen.getByPlaceholderText('Nama Lengkap')
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Daftar' })
    
    await user.type(namaInput, 'John Doe')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email sudah terdaftar')).toBeInTheDocument()
    })
    
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should display default error message when registration fails without specific error', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({})
    }
    
    fetch.mockResolvedValueOnce(mockResponse)
    
    renderWithRouter(<Register />)
    
    const namaInput = screen.getByPlaceholderText('Nama Lengkap')
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Daftar' })
    
    await user.type(namaInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Registrasi gagal. Silakan coba lagi.')).toBeInTheDocument()
    })
  })

  it('should display error message when fetch fails', async () => {
    const user = userEvent.setup()
    
    fetch.mockRejectedValueOnce(new Error('Network error'))
    
    renderWithRouter(<Register />)
    
    const namaInput = screen.getByPlaceholderText('Nama Lengkap')
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    const submitButton = screen.getByRole('button', { name: 'Daftar' })
    
    await user.type(namaInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat registrasi. Silakan coba lagi.')).toBeInTheDocument()
    })
    
    expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error))
  })

  it('should require all form fields', () => {
    renderWithRouter(<Register />)
    
    const namaInput = screen.getByPlaceholderText('Nama Lengkap')
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    const passwordInput = screen.getByPlaceholderText('Kata Sandi')
    
    expect(namaInput).toBeRequired()
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
    expect(namaInput).toHaveAttribute('type', 'text')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should prevent form submission with empty fields', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Register />)
    
    const submitButton = screen.getByRole('button', { name: 'Daftar' })
    
    // Try to submit without filling any fields
    await user.click(submitButton)
    
    // Fetch should not be called
    expect(fetch).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should handle form validation for email field', () => {
    renderWithRouter(<Register />)
    
    const emailInput = screen.getByPlaceholderText('Alamat Email')
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('name', 'email')
  })
}) 