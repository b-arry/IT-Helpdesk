let form = document.getElementById('ticket-submit-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  let name = document.getElementById('first').value;
  let email = document.getElementById('email').value;
  let category = document.getElementById('category').value;
  let priority = document.getElementById('priority').value;
  let message = document.getElementById('message').value;

  let btn = document.getElementById('submit-button');   
  btn.disabled = true;
  btn.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i> Processing request`;

  let data = {
    "name":name,
    "email":email,
    "category":category,
    "priority":priority,
    "message":message,
  };

  console.log(data);
  
  fetch('/tickets/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (response.status === 200) {
      // Display a success message using SweetAlert
      alert('Your ticket has been submitted!');
      window.location.href = "/";
    } else {
      // Display an error message using SweetAlert
      alert('Error!');
    }
  })
  .catch(error => {
    // Display an error message using SweetAlert
    alert('Error!');
  })
  .finally(() => {
    btn.innerHTML = "Submit";
    btn.disabled = false;
  });
});