import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import StatusCard from '../../component/admin/StatusCard';
import RecentOrdersTable from '../../component/admin/RecentOrdersTable';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalPenghasilan: 0,
    totalPesanan: 0,
    totalMenu: 0,
    totalPengguna: 0,
    recentOrders: []
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch total penghasilan dan pesanan
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      const orders = ordersData.orders || [];
      const totalPenghasilan = orders.reduce((sum, order) => sum + (order.total_harga || 0), 0);
      
      // Fetch total menu
      const menuResponse = await fetch('/api/menu');
      const menuData = await menuResponse.json();
      
      // Fetch total pengguna
      const usersResponse = await fetch('/api/users');
      const usersData = await usersResponse.json();
      
      setDashboardData({
        totalPenghasilan: totalPenghasilan,
        totalPesanan: orders.length,
        totalMenu: (menuData.menus || []).length,
        totalPengguna: (usersData.users || []).length,
        recentOrders: orders.slice(0, 5) // Ambil 5 pesanan terbaru
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Status cards data
  const statusCards = [
    {
      title: 'Total Penghasilan',
      value: formatCurrency(dashboardData.totalPenghasilan),
      icon: 'ph:money-bold',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Pesanan',
      value: dashboardData.totalPesanan.toString(),
      icon: 'clarity:list-line',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Menu',
      value: dashboardData.totalMenu.toString(),
      icon: 'mdi:silverware-fork-knife',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Pengguna',
      value: dashboardData.totalPengguna.toString(),
      icon: 'ph:user-bold',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar Component */}
        <AdminSidebar activeMenu="dashboard" />

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statusCards.map((card, index) => (
              <StatusCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                iconColor={card.iconColor}
                valueColor={card.valueColor}
                bgColor={card.bgColor}
              />
            ))}
          </div>

          {/* Recent Orders Table Component */}
          <RecentOrdersTable orders={dashboardData.recentOrders} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
