import React, { useState, useEffect } from 'react';

const MenuFormModal = ({ isOpen, onClose, onSubmit, categories, initialData }) => {
  const [formData, setFormData] = useState({
    nama_menu: '',
    kategori_id: '',
    harga: '',
    deskripsi: '',
    image: '',
    status: 'aktif',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_menu: initialData.nama_menu || '',
        kategori_id: initialData.kategori ? initialData.kategori.kategori_id : '',
        harga: initialData.harga || '',
        deskripsi: initialData.deskripsi || '',
        image: initialData.image || '',
        status: initialData.status || 'aktif',
      });
    } else {
      setFormData({
        nama_menu: '',
        kategori_id: categories.length > 0 ? categories[0].kategori_id : '',
        harga: '',
        deskripsi: '',
        image: '',
        status: 'aktif',
      });
    }
  }, [initialData, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama_menu || !formData.kategori_id || !formData.harga) {
      alert('Nama menu, kategori, dan harga wajib diisi');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Menu' : 'Tambah Menu'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Menu</label>
            <input
              type="text"
              name="nama_menu"
              value={formData.nama_menu}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              name="kategori_id"
              value={formData.kategori_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              {categories.map(cat => (
                <option key={cat.kategori_id} value={cat.kategori_id}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga</label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuFormModal;
