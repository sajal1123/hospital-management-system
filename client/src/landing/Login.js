import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');

  const [patientEmail, setPatientEmail] = useState('');
  const [patientPassword, setPatientPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = ({ userType }) => {

    // Display loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading...';
    loadingDiv.className = 'loading';
    document.body.appendChild(loadingDiv);
    
    // Validation logic
    if (
      (employeeId && employeePassword) ||
      (patientEmail && patientPassword)
    ) {
      const credentials = {
        email: userType === 'employee' ? employeeId : patientEmail,
        password: userType === 'employee' ? employeePassword : patientPassword,
        userType: userType
      };

      // Make a fetch call to the backend login endpoint
      fetch('http://localhost:9000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {

          // Remove loading animation
          loadingDiv.remove();

          console.log(`${userType} login successful:`, data);

          /// TODO: Save Email to local storage
          localStorage.setItem("userEmail", data.email)
          localStorage.setItem("accessToken", data.accessToken)
          localStorage.setItem("empID", data.empID)

          if (data.email === 'admin@uic.edu') {
            // If the user is an admin, navigate to the admin dashboard
            navigate('/admin-dashboard');
          } else {
            // Otherwise, proceed with regular login handling
            navigate('/'+userType)
          }
        })
        .catch((error) => {
          // Remove loading animation
          loadingDiv.remove();

          // Show error message div for 3 seconds
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message';
          messageDiv.textContent = `Error: ${error}`;

          document.body.appendChild(messageDiv);

          setTimeout(() => {
            messageDiv.remove();
          }, 3000);
          console.error(`Error during ${userType} login:`, error.message);
        });
    }
    else {
      alert('Please enter the required information.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10%' }}>
      <div style={{ textAlign: 'center', marginRight: '20px' }}>
        <h2>Employee Login</h2>
        <label>
          Employee ID:
          <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={employeePassword} onChange={(e) => setEmployeePassword(e.target.value)} />
        </label>
        <br />
        <button onClick={() => handleLogin({ userType: 'employee' })}>Login</button>
      </div>
      <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
        <h2>Patient Login</h2>
        <label>
          Email ID:
          <input type="text" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} />
        </label>
        <br />
        <button onClick={() => handleLogin({ userType: 'patient' })}>Login</button>
      </div>
    </div>
  );
};

export default Login;
