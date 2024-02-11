let verificationStatus = document.getElementById('verificationStatus');
verificationStatus.addEventListener('change', function () {
  let employeeId = document.getElementById('employeeId').value;
  let isVerified = this.checked;
  let data = {
    employeeId,
    isVerified,
  };

  fetch(`/admin/admin-dashboard/update-employee/${employeeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.status === 200) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});
