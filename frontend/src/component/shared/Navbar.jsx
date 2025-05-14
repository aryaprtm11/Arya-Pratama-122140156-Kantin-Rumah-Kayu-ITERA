import React from 'react';
import { Paper } from '@mui/material';
import IteraLogo from "../../assets/itera.png";
import BurgerMenu from "./BurgerMenu";

const Navbar = ({ toggleCart, activePage = '' }) => {
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
          </ul>
          
          <div className="flex items-center">
            <BurgerMenu toggleCart={toggleCart} />
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Navbar; 