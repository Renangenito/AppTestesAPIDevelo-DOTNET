import React, { useState, FC } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

import { Link, useNavigate } from 'react-router-dom';
import { SidebarData } from './SidebarData';

import './Navbar.scss';
import logo from '../../imagens/logo-acertpix.png'

import { IconContext } from 'react-icons';
import api from '../../servicos/api';

function  Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if(!sessionStorage.getItem('auth'))
    return <></>
  
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar mb-5'>
          
          <div to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
            <img src={logo} alt=''></img>
          </div>
          
          

          <div className='apiUrl'>
          
            <strong>{sessionStorage.getItem('apiUrl')}</strong>
          </div>

          <div className="dropdown logout">
            <button className="btn btn-info btn-sm dropdown-toggle btn-dropdown" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {sessionStorage.getItem('nomeUsuario')}
            </button>
            <div className="dropdown-menu p-0" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item  btn btn-info btn-sm text-center" onClick={logout}>Logout!</button>
            </div>
          </div>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
         
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <div to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </div>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
                       
          </ul>
          
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
