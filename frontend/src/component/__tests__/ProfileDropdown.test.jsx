import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ProfileDropdown from '../ProfileDropdown'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock @iconify/react
vi.mock('@iconify/react', () => ({
  Icon: ({ icon, className }) => (
    <div data-testid="icon" data-icon={icon} className={className}>
      {icon}
    </div>
  )
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ProfileDropdown', () => {
  const defaultProps = {
    username: 'John Doe',
    onLogout: null
  }

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('should render with username', () => {
    renderWithRouter(<ProfileDropdown {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('J')).toBeInTheDocument() // First letter of username
  })

  it('should render with default "U" when no username provided', () => {
    renderWithRouter(<ProfileDropdown username="" />)
    
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('should toggle dropdown when button is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ProfileDropdown {...defaultProps} />)
    
    const button = screen.getByRole('button')
    
    // Initially dropdown should not be visible
    expect(screen.queryByText('Keluar')).not.toBeInTheDocument()
    
    // Click to open dropdown
    await user.click(button)
    expect(screen.getByText('Keluar')).toBeInTheDocument()
    
    // Click again to close dropdown
    await user.click(button)
    expect(screen.queryByText('Keluar')).not.toBeInTheDocument()
  })

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ProfileDropdown {...defaultProps} />)
    
    const button = screen.getByRole('button')
    
    // Open dropdown
    await user.click(button)
    expect(screen.getByText('Keluar')).toBeInTheDocument()
    
    // Click outside
    await user.click(document.body)
    
    await waitFor(() => {
      expect(screen.queryByText('Keluar')).not.toBeInTheDocument()
    })
  })

  it('should call custom onLogout when provided', async () => {
    const mockOnLogout = vi.fn()
    const user = userEvent.setup()
    
    renderWithRouter(
      <ProfileDropdown {...defaultProps} onLogout={mockOnLogout} />
    )
    
    const button = screen.getByRole('button')
    
    // Open dropdown
    await user.click(button)
    
    // Click logout button
    const logoutButton = screen.getByText('Keluar')
    await user.click(logoutButton)
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1)
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(sessionStorage.removeItem).not.toHaveBeenCalled()
  })

  it('should handle default logout when no onLogout provided', async () => {
    const user = userEvent.setup()
    
    renderWithRouter(<ProfileDropdown {...defaultProps} />)
    
    const button = screen.getByRole('button')
    
    // Open dropdown
    await user.click(button)
    
    // Click logout button
    const logoutButton = screen.getByText('Keluar')
    await user.click(logoutButton)
    
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('user')
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should show correct chevron icon based on dropdown state', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ProfileDropdown {...defaultProps} />)
    
    const button = screen.getByRole('button')
    
    // Initially should show chevron-down
    const initialIcons = screen.getAllByTestId('icon')
    const chevronIcon = initialIcons.find(icon => icon.getAttribute('data-icon').includes('chevron'))
    expect(chevronIcon).toHaveAttribute('data-icon', 'mdi:chevron-down')
    
    // After opening dropdown should show chevron-up
    await user.click(button)
    const openIcons = screen.getAllByTestId('icon')
    const openChevronIcon = openIcons.find(icon => icon.getAttribute('data-icon').includes('chevron'))
    expect(openChevronIcon).toHaveAttribute('data-icon', 'mdi:chevron-up')
  })

  it('should close dropdown after logout', async () => {
    const user = userEvent.setup()
    
    renderWithRouter(<ProfileDropdown {...defaultProps} />)
    
    const button = screen.getByRole('button')
    
    // Open dropdown
    await user.click(button)
    expect(screen.getByText('Keluar')).toBeInTheDocument()
    
    // Click logout button
    const logoutButton = screen.getByText('Keluar')
    await user.click(logoutButton)
    
    // Dropdown should be closed
    expect(screen.queryByText('Keluar')).not.toBeInTheDocument()
  })
}) 