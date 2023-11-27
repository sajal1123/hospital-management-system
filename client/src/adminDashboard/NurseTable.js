// src/NurseTable.js
import React from 'react';
import './tableStyle.css';

const NurseTable = ({ nurses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nurse Email</th>
          <th>Nurse Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {nurses.map((nurse) => (
          <tr key={nurse.id}>
            <td>{nurse.email}</td>
            <td>{nurse.name}</td>
            <td>
              <button onClick={() => handleViewOrUpdate(nurse.empID)}>View/Update</button>
              <button onClick={() => handleDelete(nurse.empID)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

var adminToken = localStorage.getItem("accessToken");

var myHeaders = new Headers();
myHeaders.append("Authorization", adminToken);
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};


const handleDelete = (nurseId) => {
  // Add logic for deleting nurse
  var requestDeleteOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: 'follow'
  }
  fetch(`http://localhost:9000/api/delete-nurse/${nurseId}`, requestDeleteOptions)
  .then(response => response.json())
  .then(result => {
    console.log(`Successfully Deleted Nurse ${nurseId}`);
    console.log(result);
  })
};


// const handleUpdate = (nurseId) => {
//   // Get updated values from the form
//   const updatedNurseInfo = {};
//   const inputs = document.querySelectorAll('#viewNurseForm input, #viewNurseForm select');
//   inputs.forEach((input) => {
//     updatedNurseInfo[input.id] = input.value;
//   });

//   console.log("UPDATING = ", updatedNurseInfo);

//   // Display loading animation
//   const loadingDiv = document.createElement('div');
//   loadingDiv.textContent = 'Updating...';
//   loadingDiv.className = 'loading';
//   document.body.appendChild(loadingDiv);

//   // Modify this part to use the updatedNurseInfo
//   var raw = JSON.stringify({
//     name: updatedNurseInfo.name,
//     age: updatedNurseInfo.age,
//     gender: updatedNurseInfo.gender,
//     email: updatedNurseInfo.email,
//     phone: updatedNurseInfo.phone,
//     address: updatedNurseInfo.address,
//   });

//   var requestOptionsUpdate = {
//     method: 'PUT', // Assuming you are using PUT for update, modify it if needed
//     headers: myHeaders,
//     body: raw,
//     redirect: 'follow'
//   };

//   // Hit the API to update nurse information
//   // fetch(`http://localhost:9000/api/update-nurse/?empID=${nurseId}`, requestOptionsUpdate)
//   //   .then(response => response.text())
//   //   .then(result => {
//   //     // Remove loading animation
//   //     loadingDiv.remove();

//   //     // Show success or error message div for 3 seconds
//   //     const messageDiv = document.createElement('div');
//   //     messageDiv.className = 'message';
//   //     messageDiv.textContent = 'Nurse Updated Successfully';

//   //     document.body.appendChild(messageDiv);

//   //     setTimeout(() => {
//   //       messageDiv.remove();
//   //     }, 3000);

//   //     console.log("result of update nurse call - > ", result);
//   //   })
//   //   .catch(error => {
//   //     // Remove loading animation
//   //     loadingDiv.remove();

//   //     // Show error message div for 3 seconds
//   //     const messageDiv = document.createElement('div');
//   //     messageDiv.className = 'message';
//   //     messageDiv.textContent = `Error: ${error}`;

//   //     document.body.appendChild(messageDiv);

//   //     setTimeout(() => {
//   //       messageDiv.remove();
//   //     }, 3000);

//   //     console.log('error', error);
//   //   });
// };


const handleViewOrUpdate = (nurseId) => {
  fetch(`http://localhost:9000/api/get-nurse/?empID=${nurseId}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      const nurseInfo = result;

      // Create form elements dynamically
      const formContainer = document.createElement('div');
      formContainer.id = 'viewNurseForm';
      formContainer.className = 'form-container';

      const formTitle = document.createElement('h2');
      formTitle.textContent = 'View Nurse Details';
      formContainer.appendChild(formTitle);
      const formData = {};

      // Create input fields for nurse details
      const nurseFields = ['Name', 'Age', 'Gender', 'Email', 'Phone', 'Address'];
      nurseFields.forEach((field) => {
        const label = document.createElement('label');
        label.textContent = `${field}:`;

        const input = document.createElement(field == 'Gender' ? 'select' : 'input');
        input.id = field.toLowerCase().replace(/\s/g, '');

        if (field === 'Gender') {
          const optionMale = document.createElement('option');
          optionMale.value = 'male';
          optionMale.textContent = 'Male';
    
          const optionFemale = document.createElement('option');
          optionFemale.value = 'female';
          optionFemale.textContent = 'Female';
    
          input.appendChild(optionMale);
          input.appendChild(optionFemale);

          formContainer.appendChild(label);
          formContainer.appendChild(input);
        }
        else{
          // const input = document.createElement('input');
          input.type = 'text';
          input.value = nurseInfo[field.toLowerCase()];
          input.readOnly = false;

          formContainer.appendChild(label);
          formContainer.appendChild(input);
        }

        // Add a line break for better spacing
        formContainer.appendChild(document.createElement('br'));

        formData[input.id] = '';
      });

      // Create ul element for Shifts
      const shiftsLabel = document.createElement('label');
      shiftsLabel.textContent = 'Shifts:';
      formContainer.appendChild(shiftsLabel);

      const shiftsList = document.createElement('ul');
      nurseInfo.shifts.forEach((shift) => {
        const shiftItem = document.createElement('li');
        shiftItem.textContent = shift;
        shiftsList.appendChild(shiftItem);
      });
      formContainer.appendChild(shiftsList);


      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.className = 'update';
      updateButton.onclick = () => handleUpdate(nurseId, formData);
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
        const formContainer = document.getElementById('viewNurseForm');
        if (formContainer) {
          formContainer.remove();
        }
      }

      function handleUpdate(nurseId, updatedNurseInfo){
        // Get updated values from the form
        // const updatedNurseInfo = {};
        const inputs = document.querySelectorAll('#viewNurseForm input, #viewNurseForm select');
        console.log("inputsss = ", inputs);
        inputs.forEach((input) => {
          console.log("adding", input.id, input.value);
          updatedNurseInfo[input.id] = input.value;
        });
      
        console.log("UPDATING = ", updatedNurseInfo);
      
        // Display loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = 'Updating...';
        loadingDiv.className = 'loading';
        document.body.appendChild(loadingDiv);
      
        // Modify this part to use the updatedNurseInfo
        var raw = JSON.stringify({
          name: updatedNurseInfo.name,
          age: updatedNurseInfo.age,
          gender: updatedNurseInfo.gender,
          email: updatedNurseInfo.email,
          phone: updatedNurseInfo.phone,
          address: updatedNurseInfo.address,
        });

        console.log("raw = ", raw);
      
        var requestOptionsUpdate = {
          method: 'PUT', // Assuming you are using PUT for update, modify it if needed
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
      
        // Hit the API to update nurse information
        fetch(`http://localhost:9000/api/update-nurse/${nurseId}`, requestOptionsUpdate)
          .then(response => response.text())
          .then(result => {
            // Remove loading animation
            loadingDiv.remove();
      
            // Show success or error message div for 3 seconds
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.textContent = 'Nurse Updated Successfully';
      
            document.body.appendChild(messageDiv);
      
            setTimeout(() => {
              messageDiv.remove();
            }, 3000);
      
            console.log("result of update nurse call - > ", result);
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
      };
      
    });
};



export default NurseTable;
