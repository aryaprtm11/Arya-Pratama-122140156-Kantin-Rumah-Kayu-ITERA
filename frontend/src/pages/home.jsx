import { useCart } from "./cart";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Divider 
} from '@mui/material';
import { 
  LocalDining, 
  AccessTime, 
  EmojiPeople
} from '@mui/icons-material';

// Impor komponen yang telah dibuat
import Navbar from "../component/shared/Navbar";
import HeroSection from "../component/home/HeroSection";
import FeatureCard from "../component/home/FeatureCard";

const Home = () => {
    const { toggleCart } = useCart();
    const navigate = useNavigate();

    const features = [
        {
            icon: <LocalDining fontSize="large" />,
            title: "Menu Beragam",
            description: "Menyediakan berbagai pilihan menu makanan dan minuman untuk memenuhi selera semua pengunjung"
        },
        {
            icon: <AccessTime fontSize="large" />,
            title: "Buka Setiap Hari",
            description: "Siap melayani dari pagi hingga sore hari untuk kebutuhan kuliner civitas akademika ITERA"
        },
        {
            icon: <EmojiPeople fontSize="large" />,
            title: "Tempat Nyaman",
            description: "Suasana yang nyaman dengan konsep rumah kayu yang asri dan sejuk"
        }
    ];

    const handleOrderClick = () => navigate("/order");

    return (
        <Box className="bg-[#FDFAF6] min-h-screen font-poppins">
            <Navbar toggleCart={toggleCart} activePage="home" />

            <Container maxWidth="lg" sx={{ pt: { xs: '140px', sm: '150px', md: '150px' }, pb: 8 }}>
                <Box sx={{ mb: 8 }}>
                    <HeroSection onOrderClick={handleOrderClick} />
                </Box>

                <Divider sx={{ my: 6 }} />

                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#2E4F4F',
                            mb: 4
                        }}
                    >
                        Mengapa Memilih Kami?
                    </Typography>
                    
                    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                        <Grid container spacing={4} justifyContent="center">
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <FeatureCard
                                        icon={feature.icon}
                                        title={feature.title}
                                        description={feature.description}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;