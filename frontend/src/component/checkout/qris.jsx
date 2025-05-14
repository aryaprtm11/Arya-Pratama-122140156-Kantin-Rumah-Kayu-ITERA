import React from "react";
import QrisImage from "../../assets/qris.jpg";
import { Box, Typography, Divider, Paper } from '@mui/material';
import { QrCode2 } from '@mui/icons-material';

const Qris = () => {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <QrCode2 fontSize="small" />
                Scan QRIS di bawah untuk pembayaran
            </Typography>
            
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 2, 
                    bgcolor: '#fff', 
                    borderRadius: 2,
                    maxWidth: 280,
                    mx: 'auto',
                    border: '1px solid #e5e7eb'
                }}
            >
                <img
                    src={QrisImage}
                    alt="QRIS"
                    className="w-full h-auto rounded-lg object-cover mx-auto"
                    style={{ maxWidth: '220px' }}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Dapat digunakan untuk pembayaran dari semua aplikasi dompet digital yang mendukung QRIS
                </Typography>
            </Paper>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                <Typography variant="caption" color="primary.main" fontWeight="medium">
                    Dana
                </Typography>
                <Typography variant="caption" color="text.secondary">•</Typography>
                <Typography variant="caption" color="primary.main" fontWeight="medium">
                    GoPay
                </Typography>
                <Typography variant="caption" color="text.secondary">•</Typography>
                <Typography variant="caption" color="primary.main" fontWeight="medium">
                    OVO
                </Typography>
                <Typography variant="caption" color="text.secondary">•</Typography>
                <Typography variant="caption" color="primary.main" fontWeight="medium">
                    ShopeePay
                </Typography>
            </Box>
        </Box>
    );
};

export default Qris; 