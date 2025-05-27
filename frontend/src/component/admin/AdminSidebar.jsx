import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeMenu = 'dashboard' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'material-symbols:dashboard',
      href: '#'
    },
    {
      id: 'pesanan',
      label: 'Pesanan',
      icon: 'clarity:list-line',
      href: '#'
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: 'mdi:silverware-fork-knife',
      href: '#'
    },
    {
      id: 'pengguna',
      label: 'Pengguna',
      icon: 'ph:user-bold',
      href: '#'
    },
    {
      id: 'bantuan',
      label: 'Bantuan',
      icon: 'ri:question-fill',
      href: '#'
    }
  ];

  return (
    <div className="w-80 min-h-screen bg-[#2D336B] text-white flex flex-col">
      <div className="p-6 flex items-center gap-4">
        <img src="\src\assets\itera.png" alt="Logo" className="h-10" />
        <h2 className="text-xl font-semibold leading-tight">Dashboard Kantin<br/>Rumah Kayu ITERA</h2>
      </div>
      <nav className="mt-8 flex-1">
        <ul className="space-y-3 px-6">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={item.href} 
                className={`flex items-center px-6 py-4 rounded-lg transition-colors duration-200 text-lg ${
                  activeMenu === item.id 
                    ? 'bg-white text-[#2D336B]' 
                    : 'hover:bg-white hover:text-[#2D336B]'
                }`}
              >
                <Icon icon={item.icon} className="w-6 h-6" />
                <span className="ml-4">{item.label}</span>
              </a>
            </li>
          ))}
          <li className="mt-auto pt-8">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-6 py-4 rounded-lg hover:bg-white hover:text-[#2D336B] transition-colors duration-200 text-lg"
            >
              <Icon icon="material-symbols:logout" className="w-6 h-6" />
              <span className="ml-4">Keluar</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
