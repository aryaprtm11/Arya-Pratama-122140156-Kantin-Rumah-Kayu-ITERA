import { useState, useEffect } from "react"
import { FaBars, FaTimes, FaShoppingCart, FaHome, FaUtensils, FaQuestionCircle, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Divider } from '@mui/material'

const BurgerMenu = ({ toggleCart, userData }) => {
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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        setOpen(false);
    }

    const defaultMenuItems = [
        { text: 'Beranda', icon: <FaHome size={20} />, path: '/' },
        { text: 'Menu', icon: <FaUtensils size={20} />, path: '/order' },
        { text: 'Bantuan', icon: <FaQuestionCircle size={20} />, path: '/bantuan' },
    ]

    const menuItems = userData 
        ? [
            ...defaultMenuItems,
            { text: 'Keluar', icon: <FaSignOutAlt size={20} />, onClick: handleLogout },
        ]
        : [
            ...defaultMenuItems,
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
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: '300px',
                        bgcolor: '#E4EFE7',
                        px: 2
                    }
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E4F4F' }}>
                        Menu
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <FaTimes />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {userData && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {userData.nama_lengkap}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userData.email}
                        </Typography>
                    </Box>
                )}

                <List sx={{ pt: 0, mt: 0 }}>
                    {menuItems.map((item, index) => (
                        <ListItem 
                            button 
                            key={index}
                            onClick={() => item.onClick ? item.onClick() : handleNavigation(item.path)}
                            sx={{ 
                                py: 2.5,
                                borderRadius: 0,
                                mx: 0,
                                mb: 2,
                                '&:hover': { 
                                    backgroundColor: item.text === 'Masuk' ? '#4F46E5' : 
                                                   item.text === 'Keluar' ? '#EF4444' : '#99BC85',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white'
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: item.text === 'Masuk' ? '#4F46E5' : 
                                       item.text === 'Keluar' ? '#EF4444' : '#2E4F4F',
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
                                    color: item.text === 'Masuk' ? '#4F46E5' :
                                          item.text === 'Keluar' ? '#EF4444' : 'inherit'
                                }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    )
}

export default BurgerMenu 