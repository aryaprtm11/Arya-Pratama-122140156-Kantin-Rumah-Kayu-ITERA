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
      console.log('Fetching categories...');
      const response = await fetch('/api/kategori');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories data:', data);
      
      if (!data.kategoris) {
        throw new Error('Data kategori tidak ditemukan dalam response');
      }
      
      setCategories(data.kategoris);
      console.log('Categories set successfully:', data.kategoris);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Gagal memuat data kategori: ' + err.message);
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
      const response = await fetch(`/api/menu/${menuId}`, { method: 'DELETE' });
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
      const url = editingMenu ? `/api/menu/${editingMenu.menu_id}` : '/api/menu';
      
      console.log('Sending request:', {
        method,
        url,
        formData
      });
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      console.log('Response:', responseData);
      
      if (response.ok) {
        fetchMenus();
        handleModalClose();
      } else {
        const message = responseData.error || 'Gagal menyimpan menu';
        console.error('Error saving menu:', message);
        alert(message);
      }
    } catch (err) {
      console.error('Error saving menu:', err);
      alert('Gagal menyimpan menu: ' + err.message);
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
