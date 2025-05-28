import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import UserTable from '../../component/admin/UserTable';

const UserManagement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Mock user data
  const [users, setUsers] = useState([
    {
      user_id: 1,
      nama_lengkap: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'aktif'
    },
    {
      user_id: 2,
      nama_lengkap: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'aktif'
    },
    {
      user_id: 3,
      nama_lengkap: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'User',
      status: 'nonaktif'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar activeMenu="pengguna" />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">Manajemen Pengguna</h1>
          <UserTable users={users} />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
