import { useState, useEffect } from "react"
import Card from "../component/card"
import { FaShoppingCart, FaUtensils } from "react-icons/fa"
import { useCart } from "./cart"
import SearchInput from "../component/SearchInput"
import CategoryFilter from "../component/CategoryFilter"
import Navbar from "../component/Navbar"
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
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("Semua")
    const [loading, setLoading] = useState(true)
    const { toggleCart } = useCart()

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true)
            try {
                const response = await fetch("https://67f024472a80b06b88970dab.mockapi.io/Popular")
                const data = await response.json()
                setMenuItems(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching menu:", error)
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    const filteredItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "Semua" || item.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const categories = ["Semua", ...new Set(menuItems.map((item) => item.category))]

    return (
        <Box className="bg-[#FDFAF6] min-h-screen font-poppins">
            <Navbar toggleCart={toggleCart} activePage="order" />

            <Container maxWidth="xl" sx={{ pt: { xs: '140px', sm: '150px', md: '150px' }, pb: 8, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
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
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    image={item.image}
                                    desc={item.desc}
                                    price={item.price}
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