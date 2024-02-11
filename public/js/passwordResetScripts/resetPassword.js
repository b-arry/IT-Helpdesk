


let resetPasswordForm = document.getElementById('user-password-reset-form');
resetPasswordForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  let email = document.getElementById('email').value;
  let token = document.getElementById('token').value;
  let resetPassword = document.getElementById('resetPassword').value;
  let resetConfirmPassword = document.getElementById('resetConfirmPassword').value;


  let btn = document.getElementById('reset-password-btn');   
  btn.disabled = true;
  btn.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i>Resetting password..`;

  let data = {
    "token":token, // this token is coming from "reset-password.ejs
    "email":email,
    "resetPassword":resetPassword,
    "resetConfirmPassword":resetConfirmPassword
  };
   
  console.log(data);
  
  fetch('/confirm-reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    if (data.status === 200) {
      // Redirect the user to the appropriate dashboard
      alert(data.message)
      window.location.href = '/sign-in';

    } else {
      // Display an error message using SweetAlert
      console.log(data.message);
      alert(data.message);
      alert("Please try again");
      window.location.href = '/forget-password';
    }
  })
  .catch((error) => {
    // Display an error message using SweetAlert
    console.log('in catch');
    alert(error);
  })
  .finally(() => {
    btn.innerHTML = "Submit";
    btn.disabled = false;
  });
});