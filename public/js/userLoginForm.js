let loginForm = document.getElementById('user-login-form');
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  let username = document.getElementById('loginName').value;
  let password = document.getElementById('loginPassword').value;
  let role = document.getElementsByName('loginRole');

  role.forEach((item) => {
    if (item.checked) {
      role = item.value;
    }
  });
  if(role === 'employee'){
    // check username is an employee ID
    if (!/^EMP\d+$/.test(username)) {
      alert('Invalid employee ID format. Please enter a valid employee ID in the format.');
      return; // Prevent form submission if the format is invalid
    }
  }

  let btn = document.getElementById('login-btn');   
  btn.disabled = true;
  btn.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i> Login`;

  let data = {
    employeeIDorEmail: username,
    password: password,
    role:role
  };
   
  console.log(data);
  
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.status === 200) {
      // Redirect the user to the appropriate dashboard
      if (data['role'] === 'employee') {
        alert('Login successful')
        window.location.href = "/employee/employee-dashboard";
      } else if (data['role'] === 'user') {
        alert('Login successful')
        window.location.href = "/user-dashboard";
      }
    } else {
      // Display an error message using SweetAlert
      console.log(data.message);
      alert(data.message);
    }
  })
  .catch(error => {
    // Display an error message using SweetAlert
    console.log(error);
    alert(error.message);
  })
  .finally(() => {
    btn.innerHTML = "Submit";
    btn.disabled = false;
  });
});