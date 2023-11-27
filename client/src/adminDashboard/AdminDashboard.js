// src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import NurseTable from './NurseTable';
import PatientTable from './PatientTable';
import VaccineTable from './VaccineTable';
// import './tableStyle.css';
import './addNurseForm.css';
import Navbar from './navBar';

const AdminDashboard = () => {
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [showNurseTable, setShowNurseTable] = useState(true);
  const [showPatientTable, setShowPatientTable] = useState(true);
  const [showVaccineTable, setShowVaccineTable] = useState(true);

  var adminToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // Fetch data for nurses, patients, and vaccines when the component mounts
    // You should replace the fetch calls with your backend API endpoints

    var myHeaders = new Headers();
    myHeaders.append("Authorization", adminToken);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch('http://localhost:9000/api/get-nurses', requestOptions)
      .then((response) => response.json())
      .then((data) => setNurses(data));

    fetch('http://localhost:9000/api/getPatients', requestOptions)
      .then((response) => response.json())
      .then((data) => setPatients(data));

    fetch('http://localhost:9000/api/get-vaccines', requestOptions)
      .then((response) => response.json())
      .then((data) => setVaccines(data));
  }, []);

  const toggleNurseTable = () => setShowNurseTable(!showNurseTable);
  const togglePatientTable = () => setShowPatientTable(!showPatientTable);
  const toggleVaccineTable = () => setShowVaccineTable(!showVaccineTable);

  function addNurse() {
    // Create form elements dynamically
    console.log("entered addNurse");
    const formContainer = document.createElement('div');
    formContainer.id = 'addNurseForm';
    formContainer.className = 'form-container';
  
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Add Nurse';
    formContainer.appendChild(formTitle);
  
    // Create input fields for other nurse details
    const otherFields = ['First Name', 'Middle Name', 'Last Name', 'Age', 'Gender', 'Nurse Email', 'Nurse Password', 'Phone', 'Address'];
    const formData = {};
  
    otherFields.forEach((field) => {
      const label = document.createElement('label');
      label.textContent = `${field}:`;
  
      const input = document.createElement(field === 'Gender' ? 'select' : 'input');
      if (field === 'Gender') {
        const optionMale = document.createElement('option');
        optionMale.value = 'male';
        optionMale.textContent = 'Male';
  
        const optionFemale = document.createElement('option');
        optionFemale.value = 'female';
        optionFemale.textContent = 'Female';
  
        input.appendChild(optionMale);
        input.appendChild(optionFemale);
      }
      input.id = field.toLowerCase().replace(/\s/g, '');
      input.required = true;
  
      formContainer.appendChild(label);
      formContainer.appendChild(input);
  
      // Add a line break for better spacing
      formContainer.appendChild(document.createElement('br'));
  
      // Add input value to formData
      formData[input.id] = ''; // Initialize with an empty string
    });
  
    console.log("fields updated to -> ", formData);
  
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.className = 'add';
    addButton.onclick = () => submitForm(formData); // Pass both nameData and formData
    formContainer.appendChild(addButton);
  
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel'
    cancelButton.onclick = closeForm;
    formContainer.appendChild(cancelButton);
  
    // Append the form to the body
    document.body.appendChild(formContainer);
  
    // Function to close the form popup
    function closeForm() {
      const formContainer = document.getElementById('addNurseForm');
      if (formContainer) {
        formContainer.remove();
      }
    }
  
    // Function to handle form submission
    function submitForm(formData) {

      // Display loading animation
      const loadingDiv = document.createElement('div');
      loadingDiv.textContent = 'Loading...';
      loadingDiv.className = 'loading';
      document.body.appendChild(loadingDiv);

      // Get input values dynamically when the form is submitted
      const inputs = document.querySelectorAll('#addNurseForm input, #addNurseForm select');
      inputs.forEach((input) => {
          formData[input.id] = input.value;
      });

      console.log("form data -> ", formData);

    
      // Modify this part to use the nameData and formData dynamically
      var myHeaders = new Headers();
      myHeaders.append("Authorization", adminToken);
      myHeaders.append("Content-Type", "application/json");
  
      var raw = JSON.stringify({
        "firstName": formData.firstname,
        "middleName": formData.middlename,
        "lastName": formData.lastname,
        "age": formData.age,
        "gender": formData.gender,
        "email": formData.nurseemail,
        "password": formData.nursepassword,
        "phone": formData.phone,
        "address": formData.address
      });
  
      console.log("raw = ", raw);
  
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
  
      fetch("http://localhost:9000/api/register-nurse", requestOptions)
        .then(response => response.text())
        .then(result => {
          // Remove loading animation
          loadingDiv.remove();

          // Show success or error message div for 3 seconds
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message';
          messageDiv.textContent = 'Nurse Registered Successfully';

          document.body.appendChild(messageDiv);

          setTimeout(() => {
            messageDiv.remove();
          }, 3000);

          console.log("result of add nurse call - > ", result);
        })
        .catch(error => {
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

          console.log('error', error);
        });
      
          // Close the form after submitting
      closeForm();

      // window.location.reload();
    }
    
  }
      
  function addVaccine() {
    // Create form elements dynamically
    console.log("entered addVaccine");
    const formContainer = document.createElement('div');
    formContainer.id = 'addVaccineForm';
    formContainer.className = 'form-container';

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Add Vaccine';
    formContainer.appendChild(formTitle);

    // Create input fields for vaccine details
    const vaccineFields = ['Vaccine Name', 'Company', 'Number of Doses Required', 'Description', 'In Stock'];
    const formData = {};

    vaccineFields.forEach((field) => {
        const label = document.createElement('label');
        label.textContent = `${field}:`;

        const input = document.createElement('input');
        input.type = field === 'Number of Doses Required' || field === 'In Stock' ? 'number' : 'text';
        input.id = field.toLowerCase().replace(/\s/g, '');
        input.required = true;

        formContainer.appendChild(label);
        formContainer.appendChild(input);

        // Add a line break for better spacing
        formContainer.appendChild(document.createElement('br'));

        // Add input value to formData
        formData[input.id] = ''; // Initialize with an empty string
    });

    console.log("fields updated to -> ", formData);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.className = 'add';
    addButton.onclick = () => submitForm(formData); // Pass both nameData and formData
    formContainer.appendChild(addButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'cancel'
    cancelButton.onclick = closeForm;
    formContainer.appendChild(cancelButton);

    // Append the form to the body
    document.body.appendChild(formContainer);

    // Function to close the form popup
    function closeForm() {
        const formContainer = document.getElementById('addVaccineForm');
        if (formContainer) {
            formContainer.remove();
        }
    }

    // Function to handle form submission
    function submitForm(formData) {

        // Display loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = 'Loading...';
        loadingDiv.className = 'loading';
        document.body.appendChild(loadingDiv);

        // Get input values dynamically when the form is submitted
        const inputs = document.querySelectorAll('#addVaccineForm input');
        inputs.forEach((input) => {
            formData[input.id] = input.value;
        });

        console.log("form data -> ", formData);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", adminToken); // Replace with your actual authorization token
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "name": formData.vaccinename,
            "companyName": formData.company,
            "doses": formData.numberofdosesrequired,
            "description": formData.description,
            "inStock": formData.instock
        });

        console.log("raw = ", raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:9000/api/add-vaccine", requestOptions)
            .then(response => response.text())
            .then(result => {
                // Remove loading animation
                loadingDiv.remove();

                // Show success or error message div for 3 seconds
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.textContent = 'Vaccine Added Successfully';

                document.body.appendChild(messageDiv);

                setTimeout(() => {
                    messageDiv.remove();
                }, 3000);

                console.log("result of add vaccine call - > ", result);
            })
            .catch(error => {
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

                console.log('error', error);
            });

        // Close the form after submitting
        closeForm();
    }
}


  return (
    <div>
      <Navbar/>
      <h2>Welcome to the Admin Dashboard</h2>

      <div className={`table-container ${showNurseTable ? 'visible' : 'hidden'}`}>
        <h3>
          Nurse Information
          <button onClick={toggleNurseTable}>
            {showNurseTable ? 'Hide' : 'Show'}
          </button>
          <br/>
          <button onClick={addNurse}>
            {"Add Nurse"}  
          </button>
        </h3>
        {showNurseTable && <NurseTable nurses={nurses} />}
      </div>

      <div className={`table-container ${showVaccineTable ? 'visible' : 'hidden'}`}>
        <h3>
          Vaccine Information
          <button onClick={toggleVaccineTable}>
            {showVaccineTable ? 'Hide' : 'Show'}
          </button>
          <button onClick={addVaccine}>
            {"Add Vaccine"}  
          </button>
        </h3>
        {showVaccineTable && <VaccineTable vaccines={vaccines} />}
      </div>

      <div className={`table-container ${showPatientTable ? 'visible' : 'hidden'}`}>
        <h3>
          Patient Information
          <button onClick={togglePatientTable}>
            {showPatientTable ? 'Hide' : 'Show'}
          </button>
        </h3>
        {showPatientTable && <PatientTable patients={patients} />}
      </div>

    </div>
  );
};

export default AdminDashboard;