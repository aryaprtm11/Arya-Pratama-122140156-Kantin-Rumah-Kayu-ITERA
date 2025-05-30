import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout as authLogout } from '../../utils/auth';
import IteraLogo from "../../assets/itera.png";
import BurgerMenu from "./BurgerMenu";
import ProfileDropdown from "../ProfileDropdown";

const Navbar = ({ toggleCart, activePage = '' }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const checkUserData = () => {
    const user = getCurrentUser();
    setUserData(user);
  };

  useEffect(() => {
    checkUserData();
    
    // Listen for login/logout events
    const handleUserLogin = () => checkUserData();
    const handleUserLogout = () => setUserData(null);
    
    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);
    
    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  const handleLogout = () => {
    authLogout();
    setUserData(null);
    navigate('/login');
  };

  return (
    <Paper elevation={3} className="fixed top-0 left-0 w-full z-50 bg-[#E4EFE7] p-6 py-6 shadow-lg rounded-b-xl">
      <div className="flex justify-between items-center w-full px-6">
        <div className="flex items-center gap-4">
          <img src={IteraLogo} alt="Logo Itera" className="h-10 w-auto" />
          <h1
            className="navbar-title font-semibold text-xl sm:text-2xl md:text-3xl ml-2"
            style={{ fontFamily: "Times New Roman, Times, serif" }}
          >
            Kantin Rumah Kayu ITERA
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ul className="hidden md:flex items-center gap-6 text-sm sm:text-base md:text-lg">
            <li>
              <a
                href="/"
                className={`font-medium ${
                  activePage === 'home' 
                    ? 'bg-green-500 text-white' 
                    : 'hover:bg-green-500 hover:text-white'
                } rounded-xl px-5 py-2`}
              >
                Beranda
              </a>
            </li>
            <li>
              <a
                href="/order"
                className={`font-medium ${
                  activePage === 'order' 
                    ? 'bg-green-500 text-white' 
                    : 'hover:bg-green-500 hover:text-white'
                } rounded-xl px-5 py-2`}
              >
                Menu
              </a>
            </li>
            <li>
              <a
                href="/bantuan"
                className={`font-medium ${
                  activePage === 'bantuan' 
                    ? 'bg-green-500 text-white' 
                    : 'hover:bg-green-500 hover:text-white'
                } rounded-xl px-5 py-2`}
              >
                Bantuan
              </a>
            </li>
            {!userData ? (
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-5 py-2 transition-colors duration-200"
                >
                  Masuk
                </button>
              </li>
            ) : (
              <li>
                <ProfileDropdown 
                  username={userData.nama_lengkap} 
                  onLogout={handleLogout}
                />
              </li>
            )}
          </ul>
          
          <div className="flex items-center">
            <BurgerMenu toggleCart={toggleCart} userData={userData} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Navbar; 