import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import MenuTable from '../../component/admin/MenuTable';
import MenuFormModal from '../../component/admin/MenuFormModal';
import Swal from 'sweetalert2';

const MenuManagement = () => {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [error, setError] = useState(null);

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
  }, [navigate]);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenus(data.menus || []);
    } catch (err) {
      setError('Gagal memuat data menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/kategori');
      const data = await response.json();
      setCategories(data.kategoris || []);
    } catch (err) {
      setError('Gagal memuat data kategori');
    }
  };

  const handleAddClick = () => {
    setEditingMenu(null);
    setModalOpen(true);
  };

  const handleEditClick = (menu) => {
    setEditingMenu(menu);
    setModalOpen(true);
  };

  const handleDeleteClick = async (menuId) => {
    // Konfirmasi penghapusan dengan Sweet Alert
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Menu yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/menu/${menuId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus menu');
        }

        // Tampilkan notifikasi sukses
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Menu telah dihapus',
          timer: 1500,
          showConfirmButton: false
        });

        fetchMenus(); // Refresh daftar menu
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal menghapus menu',
        });
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingMenu(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const url = editingMenu
        ? `/api/menu/${editingMenu.menu_id}`
        : '/api/menu';
      
      const method = editingMenu ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan menu');
      }

      // Tampilkan notifikasi sukses
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: editingMenu ? 'Menu berhasil diperbarui' : 'Menu baru berhasil ditambahkan',
        timer: 1500,
        showConfirmButton: false
      });

      setModalOpen(false);
      setEditingMenu(null);
      fetchMenus(); // Refresh daftar menu
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal menyimpan menu',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar activeMenu="menu" />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Manajemen Menu</h1>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Tambah Menu
            </button>
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <MenuTable
            menus={menus}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
          {modalOpen && (
            <MenuFormModal
              isOpen={modalOpen}
              onClose={handleModalClose}
              onSubmit={handleFormSubmit}
              categories={categories}
              initialData={editingMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
