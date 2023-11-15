// src/components/NavbarPatient.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../nurse/Navbar.css';

const NavbarPatient = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-item">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link to="/profile" className="nav-item">
        <FontAwesomeIcon icon={faUser} />
      </Link>
      <Link to="/logout" className="nav-item">
        <FontAwesomeIcon icon={faSignOutAlt} />
      </Link>
    </nav>
  );
};

export default NavbarPatient;
