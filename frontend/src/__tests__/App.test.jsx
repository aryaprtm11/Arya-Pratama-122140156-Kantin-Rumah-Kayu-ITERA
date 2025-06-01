import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Routes: ({ children }) => <div data-testid="routes">{children}</div>,
    Route: ({ children }) => <div data-testid="route">{children}</div>
  }
})

// Mock all page components
vi.mock('../pages/home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}))

vi.mock('../pages/Register', () => ({
  default: () => <div data-testid="register-page">Register Page</div>
}))

vi.mock('../pages/order', () => ({
  default: () => <div data-testid="order-page">Order Page</div>
}))

vi.mock('../pages/checkout', () => ({
  default: () => <div data-testid="checkout-page">Checkout Page</div>
}))

vi.mock('../pages/bantuan', () => ({
  default: () => <div data-testid="bantuan-page">Bantuan Page</div>
}))

vi.mock('../pages/admin/DashboardAdmin', () => ({
  default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>
}))

vi.mock('../pages/admin/MenuManagement', () => ({
  default: () => <div data-testid="admin-menu">Admin Menu</div>
}))

vi.mock('../pages/admin/OrderManagement', () => ({
  default: () => <div data-testid="admin-orders">Admin Orders</div>
}))

vi.mock('../pages/admin/UserManagement', () => ({
  default: () => <div data-testid="admin-users">Admin Users</div>
}))

// Mock CartProvider dan useCart
vi.mock('../pages/cart', () => ({
  CartProvider: ({ children }) => <div data-testid="cart-provider">{children}</div>,
  useCart: () => ({
    cartItems: [],
    addToCart: vi.fn(),
    isCartOpen: false,
    toggleCart: vi.fn(),
    closeCart: vi.fn()
  })
}))

// Mock CartPopup
vi.mock('../component/shared/CartPopup', () => ({
  default: () => <div data-testid="cart-popup">Cart Popup</div>
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('App', () => {
  it('should render without crashing', () => {
    const { getByTestId } = renderWithRouter(<App />)
    
    expect(getByTestId('cart-provider')).toBeInTheDocument()
    expect(getByTestId('routes')).toBeInTheDocument()
    expect(getByTestId('cart-popup')).toBeInTheDocument()
  })

  it('should wrap content with CartProvider', () => {
    const { getByTestId } = renderWithRouter(<App />)
    
    const cartProvider = getByTestId('cart-provider')
    const routes = getByTestId('routes')
    const cartPopup = getByTestId('cart-popup')
    
    expect(cartProvider).toBeInTheDocument()
    expect(routes).toBeInTheDocument()
    expect(cartPopup).toBeInTheDocument()
  })
}) 