const select = document.querySelector("#ticket-sort-status");
let ticketTable = document.getElementById("ticket-table");

function createTicketTableHeader() {
  let tableHead = `  <thead>
  <tr>
    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">
      Ticket Raiser Name
    </th>
    <th class="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">
      Category
    </th>
    <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">
      Status
    </th>
    <th class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">
      Priority
    </th>
    <th
      class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7"
    >
      Created
    </th>
    <th
      class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7"
    >
      Worked Since
    </th>
    <th
      class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7"
    >
      Last Updated At
    </th>
    <th
      class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7"
    >
     Last Closed At
    </th>
    <th
      class="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7"
    >
      Actions
    </th>
    <th class="text-secondary opacity-7"></th>
  </tr>
</thead>`;
  return tableHead;
}

function createTicketRow(ticket) {
  const tr = document.createElement("tr");

  const td1 = document.createElement("td");
  const div1 = document.createElement("div");
  div1.classList.add("d-flex", "px-2", "py-1", "ml-5");
  div1.style.marginLeft = "15px";
  const div2 = document.createElement("div");
  div2.classList.add("d-flex", "flex-column", "justify-content-center");
  const h6 = document.createElement("h6");
  h6.classList.add("mb-0", "text-sm");
  h6.textContent = ticket.name;
  const p = document.createElement("p");
  p.classList.add("text-xs", "text-secondary", "mb-0");
  p.textContent = ticket.email;

  div2.appendChild(h6);
  div2.appendChild(p);
  div1.appendChild(div2);
  td1.appendChild(div1);

  const td2 = document.createElement("td");
  const p2 = document.createElement("p");
  p2.classList.add("text-xs", "font-weight-bold", "mb-0");
  p2.textContent = ticket.category;

  td2.appendChild(p2);

  const td3 = document.createElement("td");
  td3.classList.add("align-middle", "text-center", "text-sm", "text-white");
  const span1 = document.createElement("span");
  if (ticket.status === "open") {
    span1.classList.add("badge", "badge-sm", "bg-gradient-info");
  } else if (ticket.status === "in progress") {
    span1.classList.add("badge", "badge-sm", "bg-gradient-success");
  } else {
    span1.classList.add("badge", "badge-sm", "bg-gradient-secondary");
  }
  span1.textContent = ticket.status;

  td3.appendChild(span1);

  const td4 = document.createElement("td");
  td4.classList.add("align-middle", "text-center", "text-sm", "text-white");
  const span2 = document.createElement("span");
  span2.classList.add("text-white", "text-xs", "font-weight-bold");
  if (ticket.priority === "high") {
    span2.classList.add("badge", "badge-sm", "bg-gradient-danger");
  } else if (ticket.priority === "medium") {
    span2.classList.add("badge", "badge-sm", "bg-gradient-warning");
  } else {
    span2.classList.add("badge", "badge-sm", "bg-gradient-light");
  }
  span2.textContent = ticket.priority;

  td4.appendChild(span2);

  const td5 = document.createElement("td");
  td5.classList.add("align-middle", "text-center");
  const span3 = document.createElement("span");
  span3.classList.add("text-secondary", "text-xs", "font-weight-bold");
  span3.textContent = new Date(ticket.createdAt).toLocaleString();

  td5.appendChild(span3);

  const td6 = document.createElement("td");
  td6.classList.add("align-middle", "text-center");
  const span4 = document.createElement("span");
  span4.classList.add("text-secondary", "text-xs", "font-weight-bold");
  span4.textContent = new Date(ticket.workedSince).toLocaleString();

  td6.appendChild(span4);

  const td7 = document.createElement("td");
  td7.classList.add("align-middle", "text-center");
  const span5 = document.createElement("span");
  span5.classList.add("text-secondary", "text-xs", "font-weight-bold");
  span5.textContent = new Date(ticket.updatedAt).toLocaleString();

  td7.appendChild(span5);

  const td8 = document.createElement("td");
  td8.classList.add("align-middle", "text-center");
  const span6 = document.createElement("span");
  span6.classList.add("text-secondary", "text-xs", "font-weight-bold");
  span6.textContent = new Date(ticket.closedAt).toLocaleString();

  td8.appendChild(span6);

  const td9 = document.createElement("td");
  td9.classList.add("align-middle", "text-center");
  const editBtn = document.createElement("a");
  editBtn.classList.add("text-white", "text-sm", "font-weight-bold","badge", "bg-gradient-dark");
  editBtn.href = `/admin/admin-dashboard/ticket/${ticket._id}`;
  editBtn.textContent = "View";

  td9.appendChild(editBtn);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  tr.appendChild(td6);
  tr.appendChild(td7);
  tr.appendChild(td8);
  tr.appendChild(td9);

  return tr;
}

select.addEventListener("change", () => {
  const selectedOption = select.value;
  console.log(selectedOption);

  fetch(`/admin/admin-dashboard/tickets/${selectedOption}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        console.log(data);
        ticketTable.innerHTML = "";
        ticketTable.innerHTML = createTicketTableHeader();
        if (data.tickets.length > 0) {
          data.tickets.forEach((ticket) => {
            const tr = createTicketRow(ticket);
            ticketTable.appendChild(tr);
          });
        }
        else {
            ticketTable.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            const h3 = document.createElement("h3");
            td.setAttribute("colspan", "7");
            h3.classList.add("text-center");
            h3.textContent = "No tickets found";
            td.appendChild(h3);
            tr.appendChild(td);
            ticketTable.appendChild(tr);
        }
            // window.location.href = "/employee/employee-dashboard";
      } 
    })
    .catch((error) => {
      // Display an error message using SweetAlert
      alert(error);
    });
});






// Search Ticket
let searchQuery = document.getElementById("searchQuery");

searchQuery.addEventListener("keyup", (e) => {
  console.log("searching..");
  console.log(e.target.value);
  let search = e.target.value;

  // sanitize the search query
  search = search.trim();

  if (search.length === 0) {
    fetch("/admin/admin-dashboard/all-tickets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
          ticketTable.innerHTML = "";
          ticketTable.innerHTML = createTicketTableHeader();
          if (data.tickets.length > 0) {
            data.tickets.forEach((ticket) => {
              const tr = createTicketRow(ticket);
              ticketTable.appendChild(tr);
            });
          } else {
            ticketTable.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            const h3 = document.createElement("h3");
            td.setAttribute("colspan", "7");
            h3.classList.add("text-center");
            h3.textContent = "No tickets found";
            td.appendChild(h3);
            tr.appendChild(td);
            ticketTable.appendChild(tr);
          }
        }
      })
      .catch((error) => {
        console.log("error Occured in searching tickets", error);
        alert("Server Error");
      });
  } else {
    fetch(`/admin/admin-dashboard/tickets-search/${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data);
          ticketTable.innerHTML = "";
          ticketTable.innerHTML = createTicketTableHeader();
          if (data.tickets.length > 0) {
            data.tickets.forEach((ticket) => {
              const tr = createTicketRow(ticket);
              ticketTable.appendChild(tr);
            });
          } else {
            ticketTable.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            const h3 = document.createElement("h3");
            td.setAttribute("colspan", "7");
            h3.classList.add("text-center");
            h3.textContent = "No tickets found";
            td.appendChild(h3);
            tr.appendChild(td);
            ticketTable.appendChild(tr);
          }
        }
      })
      .catch((error) => {
        console.log("error Occured in searching tickets", error);
        alert("Server Error");
      });
  }
});

  