import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import { FaTrash, FaUser, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Gagal memuat data pengguna');
      }
      const data = await response.json();
      console.log('Data from API:', data);

      // Fungsi untuk mendapatkan nama dari email
      const getNameFromEmail = (email) => {
        if (!email) return '';
        const namePart = email.split('@')[0];
        // Mengubah format nama: menghapus angka, titik, dan underscore, mengkapitalisasi setiap kata
        return namePart
          .replace(/[0-9._]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();
      };

      // Pastikan data users adalah array dan memiliki properti yang dibutuhkan
      const validUsers = (data.users || []).map(user => {
        const displayName = getNameFromEmail(user.email);
        console.log('Processing user:', user); // Log setiap user untuk debugging
        return {
          user_id: user.id || user.user_id || '', // Mencoba kedua kemungkinan field
          username: user.username || '',
          displayName: displayName,
          email: user.email || '',
          role: typeof user.role === 'object' ? user.role.name || 'user' : (user.role || 'user')
        };
      });
      console.log('Processed users:', validUsers);
      setUsers(validUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!userId || !username) {
      console.log('Missing userId or username:', { userId, username });
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: `Pengguna "${username}" akan dihapus secara permanen!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        console.log('User data to delete:', {
          userId,
          username,
          type: typeof userId
        });
        
        const token = localStorage.getItem('token');
        // Menggunakan URL lengkap dan memastikan userId adalah angka
        const deleteUrl = `http://localhost:6543/api/users/${userId}`;
        console.log('Delete URL:', deleteUrl);

        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Delete response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`Gagal menghapus pengguna (Status: ${response.status}): ${errorText}`);
        }

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Pengguna telah dihapus',
          timer: 1500,
          showConfirmButton: false
        });

        // Refresh daftar pengguna setelah berhasil menghapus
        await fetchUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Gagal menghapus pengguna: ${err.message}`
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.displayName && user.displayName.toLowerCase().includes(searchTermLower)) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower))
    );
  });

  const getRoleColor = (role) => {
    const roleStr = String(role || '').toLowerCase();
    switch (roleStr) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <AdminSidebar activeMenu="pengguna" />
          <div className="flex-1 p-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar activeMenu="pengguna" />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Manajemen Pengguna</h1>
            <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
              <FaSearch className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                className="w-full px-4 py-2 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Lengkap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {String(user.role || 'User').charAt(0).toUpperCase() + String(user.role || 'User').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.user_id, user.displayName)}
                          className="inline-flex items-center px-3 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? 'Admin tidak dapat dihapus' : 'Hapus pengguna'}
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
        </div>
      </div>
    </div>
  );
};

export default UserManagement;