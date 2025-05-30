import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import { FaTrash, FaUser, FaSearch, FaEdit, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    role_id: 1 // Default role adalah pembeli (role_id: 1)
  });

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

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:6543/api/users');
      if (!response.ok) {
        throw new Error('Gagal memuat data pengguna');
      }
      const data = await response.json();
      console.log('Data from API:', data);

      // Pastikan kita mengakses array users dari response
      const users = Array.isArray(data) ? data : (data.users || []);
      
      const validUsers = users.map(user => ({
        user_id: user.user_id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role_id: Number(user.role_id)
      }));
      
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:6543/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama_lengkap: formData.nama_lengkap,
          email: formData.email,
          password: formData.password,
          role_id: Number(formData.role_id)
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Gagal membuat pengguna baru');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pengguna baru telah dibuat',
        timer: 1500,
        showConfirmButton: false
      });

      setShowModal(false);
      setFormData({
        nama_lengkap: '',
        email: '',
        password: '',
        role_id: 1
      });
      fetchUsers();
    } catch (err) {
      console.error('Create error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      });
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Pastikan user_id ada dan valid
      if (!editingUser || !editingUser.user_id) {
        throw new Error('ID pengguna tidak valid');
      }

      // Log data yang akan dikirim
      const updateData = {
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        role_id: Number(formData.role_id)
      };

      // Buat URL update sesuai dengan routes.py
      const updateUrl = `http://localhost:6543/api/users/${editingUser.user_id}`;
      console.log('Update URL:', updateUrl);
      console.log('Update data:', updateData);

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Gagal mengupdate pengguna');
      }

      const responseData = await response.json().catch(() => ({}));
      console.log('Update success response:', responseData);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data pengguna telah diperbarui',
        timer: 1500,
        showConfirmButton: false
      });

      setShowModal(false);
      setEditingUser(null);
      setFormData({
        nama_lengkap: '',
        email: '',
        password: '',
        role_id: 1
      });
      fetchUsers();
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Terjadi kesalahan saat mengupdate pengguna'
      });
    }
  };

  const openEditModal = (user) => {
    console.log('Opening edit modal for user:', user);
    setEditingUser(user);
    setFormData({
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      role_id: user.role_id,
      password: '' // Password kosong saat edit
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (user.nama_lengkap && user.nama_lengkap.toLowerCase().includes(searchTermLower)) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower))
    );
  });

  const getRoleColor = (roleId) => {
    switch (Number(roleId)) {
      case 2: // admin
        return 'bg-purple-100 text-purple-800';
      case 1: // pembeli
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (roleId) => {
    switch (Number(roleId)) {
      case 2:
        return 'Admin';
      case 1:
        return 'Pembeli';
      default:
        return 'Tidak Diketahui';
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
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
            <button
              onClick={() => {
                setEditingUser(null);
                setFormData({
                  nama_lengkap: '',
                  email: '',
                  password: '',
                  role_id: 1 // Default role adalah pembeli (role_id: 1)
                });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Tambah Pengguna
            </button>
          </div>

          <div className="flex items-center bg-white rounded-lg shadow-sm p-2 mb-6">
            <FaSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="w-full px-4 py-2 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengguna
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
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nama_lengkap}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role_id)}`}>
                        {getRoleName(user.role_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-md transition-colors duration-200"
                        >
                          <FaEdit className="w-4 h-4 text-indigo-600 mr-1.5" />
                          <span className="text-indigo-700">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id, user.nama_lengkap)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 rounded-md transition-colors duration-200"
                          disabled={user.role_id === 2}
                          title={user.role_id === 2 ? 'Admin tidak dapat dihapus' : 'Hapus pengguna'}
                        >
                          <FaTrash className="w-4 h-4 text-red-600 mr-1.5" />
                          <span className="text-red-700">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <>
          {/* Backdrop dengan blur */}
          <div 
            className="fixed inset-0 backdrop-filter backdrop-blur-[8px] bg-black/30 z-40"
            onClick={() => {
              setShowModal(false);
              setEditingUser(null);
            }}
          ></div>
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative transform overflow-hidden rounded-lg bg-white/90 backdrop-blur-sm shadow-2xl transition-all sm:w-full sm:max-w-md">
                {/* Modal Header */}
                <div className="px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                      {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingUser(null);
                      }}
                      className="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Tutup</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                    <div className="space-y-4 backdrop-blur-none">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formData.nama_lengkap}
                          onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          required
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="block w-full rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      {!editingUser && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="block w-full rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            required={!editingUser}
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <select
                          value={formData.role_id}
                          onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                          className="block w-full rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="1">Pembeli</option>
                          <option value="2">Admin</option>
                        </select>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingUser(null);
                        }}
                        className="rounded-md border border-gray-300 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-600/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        {editingUser ? 'Simpan' : 'Tambah'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;