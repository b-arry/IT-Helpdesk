// write an post request to update ticket status with paramters ticket id and status

let employeeTicketForm = document.getElementById("employee-ticket-update-form");


employeeTicketForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let ticketStatus = document.getElementById("ticket-status");
  let ticketId = document.getElementById("ticketId").value;
  let status = ticketStatus.value;
  let data = {
      ticketId: ticketId,
      status: status,
    };
    console.log(data);
    
  let ticketStatusBtn = document.getElementById("update-ticket-status-btn");
  ticketStatusBtn.disabled = true;
  ticketStatusBtn.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i> Updating`;

  fetch(`/employee/employee-dashboard/ticket/${ticketId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 200) {
        // Redirect the user to the appropriate dashboard
        alert(data.message);
        window.location.href = "/employee/employee-dashboard";
    } else {
        // Display an error message using SweetAlert
        alert(data.message);
        window.location.href = "/employee/employee-dashboard";
      }
    })
    .catch((error) => {
      // Display an error message using SweetAlert
      alert(error);
    })
    .finally(() => {
        ticketStatusBtn.innerHTML = "Update Status";
        ticketStatusBtn.disabled = false;
    });
});
