// src/VaccineTable.js
import React from 'react';
import './tableStyle.css';



var adminToken = localStorage.getItem("accessToken");

var myHeaders = new Headers();
myHeaders.append("Authorization", adminToken);
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};


const VaccineTable = ({ vaccines }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Vaccine Name</th>
          <th>Company</th>
          <th># of Doses Required</th>
          <th>In Stock</th>
          <th>On Hold</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {vaccines.map((vaccine) => (
          <tr key={vaccine.id}>
            <td>{vaccine.name}</td>
            <td>{vaccine.companyName}</td>
            <td>{vaccine.doses}</td>
            <td>{vaccine.inStock}</td>
            <td>{0}</td>
            <td>
              <button onClick={() => handleUpdate(vaccine.VaccineID)}>View/Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const handleUpdate = (vaccineId) => {
  // Add logic for updating vaccine details
    // Fetch vaccine details using the API endpoint
    fetch(`http://localhost:9000/api/get-vaccine/?VaccineID=${vaccineId}`, requestOptions)
      .then(response => response.json())
      .then(result => {

        console.log("result vaccine = ", result);
        const vaccineInfo = result;
 
        const formData = {};
        // Create form elements dynamically
        const formContainer = document.createElement('div');
        formContainer.id = 'addVaccineForm';
        formContainer.className = 'form-container';
  
        const formTitle = document.createElement('h2');
        formTitle.textContent = 'View Vaccine Details';
        formContainer.appendChild(formTitle);
  
        // Create input fields for vaccine details
        const vaccineFields = ['name', 'companyName', 'doses', 'description', 'inStock'];
        vaccineFields.forEach((field) => {
          const label = document.createElement('label');
          label.textContent = `${field}:`;
  
          const input = document.createElement('input');
          input.id = field.toLowerCase().replace(/\s/g, '');
          input.value = vaccineInfo[field];
          input.readOnly = false;
  
          formContainer.appendChild(label);
          formContainer.appendChild(input);
  
          // Add a line break for better spacing
          formContainer.appendChild(document.createElement('br'));

          formData[input.id] = ''; // Initialize with an empty string

        });
  
        // Create ul element for Additional Details
        // const additionalDetailsLabel = document.createElement('label');
        // additionalDetailsLabel.textContent = 'Additional Details:';
        // formContainer.appendChild(additionalDetailsLabel);
  
        // const additionalDetailsList = document.createElement('ul');
        // vaccineInfo.additionalDetails.forEach((detail) => {
        //   const detailItem = document.createElement('li');
        //   detailItem.textContent = detail;
        //   additionalDetailsList.appendChild(detailItem);
        // });
        // formContainer.appendChild(additionalDetailsList);
  

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.className = 'update';
        updateButton.onclick = () => updateVaccine(vaccineId, formData);
        formContainer.appendChild(updateButton);


        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close';
        closeButton.onclick = closeForm;
        formContainer.appendChild(closeButton);
  
        // Append the form to the body
        document.body.appendChild(formContainer);
  
        // Function to close the form popup
        function closeForm() {
          const formContainer = document.getElementById('addVaccineForm');
          if (formContainer) {
            formContainer.remove();
          }
        }

        function updateVaccine(vaccineId, formData){

          const inputs = document.querySelectorAll('#addVaccineForm input');
          inputs.forEach((input) => {
              console.log("adding ", input.id, input.value);
              formData[input.id] = input.value;
          });

          console.log("form data =", formData);

          var raw = JSON.stringify({
              name: formData.name,
              companyName: formData.companyname,
              doses: formData.doses,
              description: formData.description,
              updateQty: parseInt(formData.instock)
          });

          console.log("raw = ", raw);

          var requestOptions = {
              method: 'PUT',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
          };

          fetch(`http://localhost:9000/api/update-vaccine/${vaccineId}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log("Vaxx updated successfully");
            console.log(result);
          })
          .catch(error => console.log('error', error));

        }
      });
  
};

export default VaccineTable;
