import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../component/admin/AdminSidebar';
import MenuTable from '../../component/admin/MenuTable';
import MenuFormModal from '../../component/admin/MenuFormModal';

const MenuManagement = () => {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menu_list');
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
      const response = await fetch('/api/kategori_list');
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
    if (!window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;
    try {
      // Assuming backend has a delete endpoint, else simulate
      const response = await fetch(`/api/menu_delete/${menuId}`, { method: 'DELETE' });
      if (response.ok) {
        fetchMenus();
      } else {
        alert('Gagal menghapus menu');
      }
    } catch (err) {
      alert('Gagal menghapus menu');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingMenu(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = editingMenu ? 'PUT' : 'POST';
      const url = editingMenu ? `/api/menu_update/${editingMenu.menu_id}` : '/api/menu_add';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchMenus();
        handleModalClose();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Gagal menyimpan menu');
      }
    } catch (err) {
      alert('Gagal menyimpan menu');
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
