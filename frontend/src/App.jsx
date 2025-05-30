import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/home';
import OrderMenu from './pages/order';
import Checkout from './pages/checkout';
import Bantuan from './pages/bantuan';
import { CartProvider } from './pages/cart';
import CartPopup from './component/shared/CartPopup';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import OrderManagement from './pages/admin/OrderManagement';
import MenuManagement from './pages/admin/MenuManagement';
import UserManagement from './pages/admin/UserManagement';

const App = () => {
  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<OrderMenu />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/bantuan" element={<Bantuan />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/pesanan" element={<OrderManagement />} />
        <Route path="/admin/menu" element={<MenuManagement />} />
        <Route path="/admin/pengguna" element={<UserManagement />} />
      </Routes>
      <CartPopup />
    </CartProvider>
  );
};

export default App;