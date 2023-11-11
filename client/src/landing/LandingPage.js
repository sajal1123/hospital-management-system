// src/LandingPage.js
import React, { useState } from 'react';
import Login from './Login';
import CreateAccount from './CreateAccount';
import '../App.css';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleCreateAccountClick = () => {
    setShowLogin(false);
    setShowCreateAccount(true);
  };

  return (
    <div className='landing'>
      <h1>Welcome to UI Health</h1>
      {showLogin && <Login onLogin={onLogin} />}
      {!showCreateAccount && (
        <button onClick={handleCreateAccountClick}>Create Account</button>
      )}
      {showCreateAccount && <CreateAccount />}
    </div>
  );
};

export default LandingPage;
