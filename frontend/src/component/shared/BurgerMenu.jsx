import { useState, useEffect } from "react"
import { FaBars, FaTimes, FaShoppingCart, FaHome, FaUtensils, FaQuestionCircle, FaSignInAlt } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Divider } from '@mui/material'

const BurgerMenu = ({ toggleCart }) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    // Close the drawer when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleNavigation = (path) => {
        navigate(path)
        setOpen(false)
    }

    const menuItems = [
        { text: 'Beranda', icon: <FaHome size={20} />, path: '/' },
        { text: 'Menu', icon: <FaUtensils size={20} />, path: '/order' },
        { text: 'Bantuan', icon: <FaQuestionCircle size={20} />, path: '/bantuan' },
        { text: 'Masuk', icon: <FaSignInAlt size={20} />, path: '/login' },
    ]

    return (
        <div className="md:hidden">
            <IconButton
                onClick={() => setOpen(!open)}
                aria-label="menu"
                sx={{ 
                    color: '#2E4F4F',
                    '&:hover': { bgcolor: 'rgba(46, 79, 79, 0.1)' }
                }}
            >
                <FaBars size={24} />
            </IconButton>

            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': { 
                        width: { xs: '80%', sm: '300px' },
                        backgroundColor: '#FDFAF6',
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        pt: 3
                    },
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    position: 'relative'
                }}>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'flex-end',
                        px: 2,
                        mb: 2
                    }}>
                        <IconButton 
                            onClick={() => setOpen(false)}
                            sx={{ color: '#2E4F4F' }}
                        >
                            <FaTimes size={24} />
                        </IconButton>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <List sx={{ pt: 0, mt: 0 }}>
                        {menuItems.map((item, index) => (
                            <ListItem 
                                button 
                                key={index}
                                onClick={() => handleNavigation(item.path)}
                                sx={{ 
                                    py: 2.5,
                                    borderRadius: 0,
                                    mx: 0,
                                    mb: 2,
                                    '&:hover': { 
                                        backgroundColor: item.text === 'Masuk' ? '#4F46E5' : '#99BC85',
                                        color: 'white',
                                        '& .MuiListItemIcon-root': {
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    color: item.text === 'Masuk' ? '#4F46E5' : '#2E4F4F',
                                    minWidth: '40px',
                                    ml: 2
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ 
                                        fontWeight: 'medium',
                                        fontSize: '1.1rem',
                                        color: item.text === 'Masuk' ? '#4F46E5' : 'inherit'
                                    }} 
                                />
                            </ListItem>
                        ))}
                    </List>
                    
                    <Box sx={{ mt: 'auto', p: 3 }}>
                        <button
                            onClick={() => {
                                toggleCart();
                                setOpen(false);
                            }}
                            className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-lg hover:bg-green-600 w-full text-base font-medium transition-all"
                        >
                            <FaShoppingCart size={20} />
                            Keranjang
                        </button>
                    </Box>
                </Box>
            </Drawer>
        </div>
    )
}

export default BurgerMenu 