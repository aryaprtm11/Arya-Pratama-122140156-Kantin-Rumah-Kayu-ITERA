import React from 'react';
import { Icon } from '@iconify/react';

const OrderDetailModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    return texts[status] || status;
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(order.order_id, newStatus);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Detail Pesanan #{order.order_id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="material-symbols:close" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informasi Pesanan</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Pesanan:</span>
                    <span className="font-medium">{order.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">{formatDate(order.create_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metode Pembayaran:</span>
                    <span className="font-medium">{order.pembayaran}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(order.total_harga)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informasi Pelanggan</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon icon="material-symbols:person" className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{order.user.nama_lengkap}</p>
                      <p className="text-sm text-gray-600">{order.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange('processing')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <Icon icon="material-symbols:sync" className="w-4 h-4 mr-2" />
                          Proses Pesanan
                        </button>
                        <button
                          onClick={() => handleStatusChange('cancelled')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Icon icon="material-symbols:cancel" className="w-4 h-4 mr-2" />
                          Batalkan
                        </button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleStatusChange('completed')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Icon icon="material-symbols:check-circle" className="w-4 h-4 mr-2" />
                        Selesaikan Pesanan
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Item Pesanan</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {order.order_details.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.menu.nama_menu}</h4>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.menu.harga)} × {item.jumlah}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Pesanan:</span>
                    <span className="text-green-600">{formatCurrency(order.total_harga)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
