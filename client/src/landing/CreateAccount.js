// src/CreateAccount.js
import React from 'react';
import UserForm from './UserForm';
import '../App.css';

const CreateAccount = () => {
  return (
    <div>
      <UserForm onSubmit={(userData) => {
        console.log('Backend call to /newAccountCreate:', userData)}
       } />
      <button onClick={() => window.location.reload()}>Go Back</button>
    </div>
  );
};

export default CreateAccount;
