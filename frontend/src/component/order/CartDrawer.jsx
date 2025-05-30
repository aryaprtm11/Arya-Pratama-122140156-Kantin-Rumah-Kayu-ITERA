import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Divider
} from '@mui/material';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../../pages/cart';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalAmount,
    handleCheckout 
  } = useCart();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!localStorage.getItem('token')) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk melanjutkan pembayaran',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    handleCheckout();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Keranjang Belanja</Typography>
          <IconButton onClick={onClose}>
            <FaTimes />
          </IconButton>
        </Box>

        {cartItems.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={4}>
            Keranjang masih kosong
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.menu_id} sx={{ py: 2 }}>
                  <Box width="100%">
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle1">{item.nama_menu}</Typography>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => removeFromCart(item.menu_id)}
                      >
                        <FaTrash />
                      </IconButton>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Rp {item.harga.toLocaleString()}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.menu_id, item.quantity - 1)}
                        >
                          <FaMinus />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton 
                          size="small"
                          onClick={() => updateQuantity(item.menu_id, item.quantity + 1)}
                        >
                          <FaPlus />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold">
                Total: Rp {getTotalAmount().toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckoutClick}
            >
              Lanjut ke Pembayaran
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer; 