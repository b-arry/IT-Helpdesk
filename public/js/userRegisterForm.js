function validateEmployeeEmail(email, role) {
  // Check if the role is 'employee' and the email matches the required format
  if (role.toLowerCase() === 'employee') {
    const emailRegex = /^[a-zA-Z0-9._%+-]+\.helpdesk@gmail\.com$/;
    return emailRegex.test(email);
  }
  else{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}

function validateName(name) {
  // Check if the name contains only alphabets and spaces
  const nameRegex = /^[a-zA-Z ]+$/;
  return nameRegex.test(name);
}



let form = document.getElementById("user-register-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("registerName").value;
  let email = document.getElementById("registerEmail").value;
  let password = document.getElementById("registerPassword").value;
  let rePassword = document.getElementById("registerRepeatPassword").value;
  let department = document.getElementById("registerDepartment").value;

  

  if (password && rePassword && password !== rePassword) {
    // Display an error message using SweetAlert
    alert("Password not match!");
    return;
  }

  const radioGroup = document.getElementsByName("role");
  let selectedRole;

  for (let i = 0; i < radioGroup.length; i++) {
    if (radioGroup[i].checked) {
      selectedRole = radioGroup[i].value;
      break;
    }
  }

  // if(!validateEmployeeEmail(email, selectedRole)){
  //   // Display an error message using SweetAlert
  //   alert('Invalid email address!');
  //   return;
  // }

  if(!validateName(name)){
    // Display an error message using SweetAlert
    alert('Invalid name!');
    return;
  }

  let btn = document.getElementById("register-btn");
  btn.disabled = true;
  btn.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i> Signing up`;

  let data = {
    name: name,
    email: email,
    password: password,
    role: selectedRole,
    department: department,
  };

  console.log(data);

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 201) {
        // Redirect the user to the appropriate dashboard
        if (data['role'] === "employee") {
          alert('You have successfully registered! Please check your email to login credentials.')
          window.location.href = "/sign-in";
          
        } else if (data['role'] === "user") {
          alert('You have successfully registered!.')
          window.location.href = "/user-dashboard";
        }
      } else {
        // Display an error message using SweetAlert
        console.log(data.message);
        alert(data.message);
      }
    })
    .catch((error) => {
      // Display an error message using SweetAlert
      console.log('Server Error');
      alert(error);
    })
    .finally(() => {
      btn.innerHTML = "Submit";
      btn.disabled = false;
    });
});
