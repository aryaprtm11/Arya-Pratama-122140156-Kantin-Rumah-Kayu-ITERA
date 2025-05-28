import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import OrderTable from '../../component/admin/OrderTable';
import OrderDetailModal from '../../component/admin/OrderDetailModal';
import { Icon } from '@iconify/react';

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
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockOrders = [
      {
        order_id: 'ORD001',
        user: {
          nama_lengkap: 'John Doe',
          email: 'john@example.com'
        },
        status: 'pending',
        total_harga: 45000,
        pembayaran: 'QRIS',
        create_at: '2024-01-15T10:30:00',
        order_details: [
          {
            menu: { nama_menu: 'Nasi Gudeg', harga: 15000 },
            jumlah: 2,
            subtotal: 30000
          },
          {
            menu: { nama_menu: 'Es Teh Manis', harga: 5000 },
            jumlah: 3,
            subtotal: 15000
          }
        ]
      },
      {
        order_id: 'ORD002',
        user: {
          nama_lengkap: 'Jane Smith',
          email: 'jane@example.com'
        },
        status: 'processing',
        total_harga: 25000,
        pembayaran: 'Cash',
        create_at: '2024-01-15T11:15:00',
        order_details: [
          {
            menu: { nama_menu: 'Soto Ayam', harga: 20000 },
            jumlah: 1,
            subtotal: 20000
          },
          {
            menu: { nama_menu: 'Kerupuk', harga: 5000 },
            jumlah: 1,
            subtotal: 5000
          }
        ]
      },
      {
        order_id: 'ORD003',
        user: {
          nama_lengkap: 'Bob Wilson',
          email: 'bob@example.com'
        },
        status: 'completed',
        total_harga: 35000,
        pembayaran: 'E-Wallet',
        create_at: '2024-01-14T14:20:00',
        order_details: [
          {
            menu: { nama_menu: 'Gado-gado', harga: 18000 },
            jumlah: 1,
            subtotal: 18000
          },
          {
            menu: { nama_menu: 'Jus Jeruk', harga: 8000 },
            jumlah: 2,
            subtotal: 16000
          }
        ]
      },
      {
        order_id: 'ORD004',
        user: {
          nama_lengkap: 'Alice Brown',
          email: 'alice@example.com'
        },
        status: 'cancelled',
        total_harga: 30000,
        pembayaran: 'QRIS',
        create_at: '2024-01-14T09:45:00',
        order_details: [
          {
            menu: { nama_menu: 'Ayam Bakar', harga: 25000 },
            jumlah: 1,
            subtotal: 25000
          },
          {
            menu: { nama_menu: 'Nasi Putih', harga: 5000 },
            jumlah: 1,
            subtotal: 5000
          }
        ]
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusUpdate = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.order_id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Icon icon="material-symbols:pending" className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.processing}</p>
                </div>
                <Icon icon="material-symbols:sync" className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Icon icon="material-symbols:check-circle" className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
          <OrderDetailModal
            order={selectedOrder}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
