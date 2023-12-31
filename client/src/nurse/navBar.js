// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const NavbarNurse = () => {
  return (
    <nav className="navbar">
      <Link to="/employee" className="nav-item">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link to="/employee/profile" className="nav-item">
        <FontAwesomeIcon icon={faUser} />
      </Link>
      <Link to="/" className="nav-item">
        <FontAwesomeIcon icon={faSignOutAlt} />
      </Link>
    </nav>
  );
};

export default NavbarNurse;
