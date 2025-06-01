import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../cart'

// Test component that uses the cart context
const TestComponent = () => {
  const { cartItems, addToCart, isCartOpen, toggleCart, closeCart } = useCart()

  return (
    <div>
      <div data-testid="cart-items-count">{cartItems.length}</div>
      <div data-testid="cart-open-status">{isCartOpen ? 'open' : 'closed'}</div>
      <button 
        data-testid="add-item-btn" 
        onClick={() => addToCart({ id: 1, name: 'Test Item', price: 100 })}
      >
        Add Item
      </button>
      <button data-testid="toggle-cart-btn" onClick={toggleCart}>
        Toggle Cart
      </button>
      <button data-testid="close-cart-btn" onClick={closeCart}>
        Close Cart
      </button>
      <div data-testid="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} data-testid={`cart-item-${index}`}>
            {item.name} - ${item.price}
          </div>
        ))}
      </div>
    </div>
  )
}

const renderWithCartProvider = (component) => {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  )
}

describe('Cart Context', () => {
  it('should provide initial cart state', () => {
    renderWithCartProvider(<TestComponent />)
    
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('closed')
  })

  it('should add items to cart', async () => {
    const user = userEvent.setup()
    renderWithCartProvider(<TestComponent />)
    
    const addButton = screen.getByTestId('add-item-btn')
    
    // Add first item
    await user.click(addButton)
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-item-0')).toHaveTextContent('Test Item - $100')
    
    // Add second item
    await user.click(addButton)
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Test Item - $100')
  })

  it('should toggle cart open/close state', async () => {
    const user = userEvent.setup()
    renderWithCartProvider(<TestComponent />)
    
    const toggleButton = screen.getByTestId('toggle-cart-btn')
    
    // Initially closed
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('closed')
    
    // Toggle to open
    await user.click(toggleButton)
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('open')
    
    // Toggle to closed
    await user.click(toggleButton)
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('closed')
  })

  it('should close cart when closeCart is called', async () => {
    const user = userEvent.setup()
    renderWithCartProvider(<TestComponent />)
    
    const toggleButton = screen.getByTestId('toggle-cart-btn')
    const closeButton = screen.getByTestId('close-cart-btn')
    
    // Open cart first
    await user.click(toggleButton)
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('open')
    
    // Close cart
    await user.click(closeButton)
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('closed')
  })

  it('should maintain cart items when toggling cart state', async () => {
    const user = userEvent.setup()
    renderWithCartProvider(<TestComponent />)
    
    const addButton = screen.getByTestId('add-item-btn')
    const toggleButton = screen.getByTestId('toggle-cart-btn')
    
    // Add item
    await user.click(addButton)
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    
    // Toggle cart state - items should remain
    await user.click(toggleButton)
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('open')
    
    await user.click(toggleButton)
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-open-status')).toHaveTextContent('closed')
  })

  it('should handle multiple different items', async () => {
    const user = userEvent.setup()
    
    const MultiItemTestComponent = () => {
      const { cartItems, addToCart } = useCart()
      
      return (
        <div>
          <div data-testid="cart-items-count">{cartItems.length}</div>
          <button 
            data-testid="add-item1-btn" 
            onClick={() => addToCart({ id: 1, name: 'Item 1', price: 100 })}
          >
            Add Item 1
          </button>
          <button 
            data-testid="add-item2-btn" 
            onClick={() => addToCart({ id: 2, name: 'Item 2', price: 200 })}
          >
            Add Item 2
          </button>
          <div data-testid="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} data-testid={`cart-item-${index}`}>
                {item.name} - ${item.price}
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    renderWithCartProvider(<MultiItemTestComponent />)
    
    const addItem1Button = screen.getByTestId('add-item1-btn')
    const addItem2Button = screen.getByTestId('add-item2-btn')
    
    // Add different items
    await user.click(addItem1Button)
    await user.click(addItem2Button)
    
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-item-0')).toHaveTextContent('Item 1 - $100')
    expect(screen.getByTestId('cart-item-1')).toHaveTextContent('Item 2 - $200')
  })
}) 