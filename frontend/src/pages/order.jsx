import { useState, useEffect } from "react"
import Card from "../component/order/card"
import { FaShoppingCart, FaUtensils } from "react-icons/fa"
import { useCart } from "./cart"
import SearchInput from "../component/order/SearchInput"
import CategoryFilter from "../component/order/CategoryFilter"
import Navbar from "../component/shared/Navbar"
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider, 
  CircularProgress,
  Chip
} from '@mui/material'

const OrderMenu = () => {
    const [menuItems, setMenuItems] = useState([])
    const [categories, setCategories] = useState(["Semua"])
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("Semua")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { toggleCart } = useCart()

    const fetchMenu = async () => {
        try {
            const response = await fetch('http://localhost:6543/api/menu');
            const data = await response.json();
            if (response.ok) {
                setMenuItems(data.menus);
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:6543/api/kategori');
            const data = await response.json();
            if (response.ok) {
                const categoryNames = ["Semua", ...data.kategoris.map(cat => cat.nama_kategori)]
                console.log('Category names:', categoryNames)
                setCategories(categoryNames)
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                await fetchMenu()
                await fetchCategories()
            } catch (error) {
                console.error("Error fetching data:", error)
                setError(error.response?.data?.message || error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "Semua" || 
                              (item.kategori && item.kategori.nama_kategori === categoryFilter)
        return matchesSearch && matchesCategory
    })

    return (
        <Box className="bg-[#FDFAF6] min-h-screen font-poppins">
            <Navbar toggleCart={toggleCart} activePage="order" />

            <Container maxWidth="xl" sx={{ pt: { xs: '140px', sm: '150px', md: '150px' }, pb: 8, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}
                
                <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
                    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, backgroundColor: '#fff' }}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
                            <div className="w-full md:w-auto order-2 md:order-1">
                                <button
                                    onClick={toggleCart}
                                    className="flex items-center justify-center gap-1.5 bg-green-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-green-600 w-full md:w-auto text-xs sm:text-sm font-medium transition-all"
                                >
                                    <FaShoppingCart className="text-sm sm:text-lg" />
                                    Keranjang
                                </button>
                            </div>
                            
                            <div className="w-full order-1 md:order-2 md:max-w-xl">
                                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                            </div>
                            
                            <div className="w-full md:w-auto order-3 mt-3 md:mt-0">
                                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                    <CategoryFilter
                                        categories={categories}
                                        selected={categoryFilter}
                                        onSelect={setCategoryFilter}
                                    />
                                </Box>
                            </div>
                        </div>
                    </Paper>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                        <CircularProgress color="success" />
                    </Box>
                ) : (
                    filteredItems.length === 0 ? (
                        <div className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-md">
                            <FaUtensils className="mx-auto text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
                            <p className="text-lg sm:text-xl font-medium text-gray-600 mb-2">Menu tidak ditemukan</p>
                            <p className="text-sm sm:text-base text-gray-500">Coba ubah kata kunci pencarian atau pilih kategori lain</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 xl:gap-10 justify-center mx-auto" style={{ maxWidth: "1800px" }}>
                            {filteredItems.map((item) => (
                                <Card
                                    key={item.menu_id}
                                    id={item.menu_id}
                                    name={item.nama_menu}
                                    image={item.image || '/default-menu-image.jpg'}
                                    desc={item.deskripsi}
                                    price={item.harga}
                                    status={item.status}
                                />
                            ))}
                        </div>
                    )
                )}
            </Container>
        </Box>
    )
}

export default OrderMenu