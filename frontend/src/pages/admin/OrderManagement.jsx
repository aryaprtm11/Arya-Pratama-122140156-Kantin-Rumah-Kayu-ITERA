import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import OrderTable from '../../component/admin/OrderTable';
import OrderDetailModal from '../../component/admin/OrderDetailModal';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Cek apakah user adalah admin
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      if (user.role_id !== 2) {
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Gagal memuat data pesanan');
      }
      const data = await response.json();
      const sortedOrders = (data.orders || []).sort((a, b) => 
        new Date(b.create_at) - new Date(a.create_at)
      );
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat data pesanan'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.nama_lengkap || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status pesanan');
      }

      // Update local state
      const updatedOrders = orders.map(order =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Status pesanan berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memperbarui status pesanan'
      });
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar activeMenu="pesanan" />

        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manajemen Pesanan</h1>
            <p className="text-gray-600">Kelola semua pesanan pelanggan</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pesanan</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Icon icon="clarity:list-line" className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Icon icon="material-symbols:pending" className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Diproses</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.processing}</p>
                </div>
                <Icon icon="material-symbols:sync" className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Icon icon="material-symbols:check-circle" className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <Icon icon="material-symbols:cancel" className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Pesanan
                </label>
                <div className="relative">
                  <Icon 
                    icon="material-symbols:search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                  />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan ID, nama, atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="processing">Diproses</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <OrderTable
            orders={filteredOrders}
            loading={loading}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={handleViewDetails}
          />

          {/* Order Detail Modal */}
          {selectedOrder && (
            <OrderDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              order={selectedOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
