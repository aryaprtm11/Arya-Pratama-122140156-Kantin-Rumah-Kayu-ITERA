import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  Divider
} from '@mui/material';

const PaymentForm = ({ cartItems, totalAmount, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const orderData = {
        user_id: parseInt(userId),
        items: cartItems.map(item => ({
          menu_id: item.menu_id,
          jumlah: item.quantity
        })),
        pembayaran: paymentMethod,
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      console.log('Order response:', data);

      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          text: 'Pesanan Anda sedang diproses',
          showConfirmButton: false,
          timer: 2000
        });
        
        onSuccess();
        // Redirect ke halaman utama
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.error || error.message || 'Terjadi kesalahan saat membuat pesanan'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom align="center">
        Konfirmasi Pembayaran
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Pilih Metode Pembayaran
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel 
              value="tunai" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">Tunai</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Bayar langsung di kasir
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel 
              value="qris" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">QRIS</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Scan QR code untuk pembayaran
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Ringkasan Pembayaran
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">Total Pesanan</Typography>
            <Typography variant="body1" fontWeight="bold">
              Rp {totalAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            disabled={loading}
            fullWidth
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Memproses...' : 'Bayar Sekarang'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PaymentForm; 