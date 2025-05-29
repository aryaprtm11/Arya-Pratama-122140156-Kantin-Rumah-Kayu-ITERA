import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MenuTable = ({ menus = [], loading = false, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    if (status === 'aktif' || status === 'tersedia') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusDisplay = (status) => {
    if (status === 'aktif') return 'Tersedia';
    if (status === 'nonaktif') return 'Habis';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Memuat data menu...</p>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Belum ada menu yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Menu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Menu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menus.map((menu) => (
              <tr key={menu.menu_id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {menu.menu_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {menu.nama_menu}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {menu.kategori?.nama_kategori || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(menu.harga)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(menu.status)}`}>
                    {getStatusDisplay(menu.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => onEdit(menu)}
                    className="inline-flex items-center px-3 py-2 border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-md transition-colors duration-150 group"
                  >
                    <FaEdit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(menu.menu_id)}
                    className="inline-flex items-center px-3 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-150 group"
                  >
                    <FaTrash className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Hapus</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
