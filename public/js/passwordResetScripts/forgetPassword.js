

let forgetPasswordForm = document.getElementById('user-forget-password-form');
forgetPasswordForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  let forgetEmail = document.getElementById('forgetEmail').value;


  let btn = document.getElementById('forget-password-btn');   
  btn.disabled = true;
  btn.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i> Sending link..`;

  let data = {
    "email":forgetEmail
  };
   
  console.log(data);
  
  fetch('/user-forget-password', {
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
      
     alert(data.message);
    } else {
      // Display an error message using SweetAlert
      console.log(data.message);
      alert(data.message);
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