const User = require('../../models/user');
const Ticket = require('../../models/ticket');
const Employee = require('../../models/employee');


exports.getAllClosedTickets = async function(req, res) {
    // Retrieve the user's ID from the req.user object
 
    // Query the ticket tracking system to retrieve all the tickets assigned to the user
    await Ticket.find({status: "closed" })
    .then(function (tickets) {
      // Render the admin dashboard view and pass the user and tickets data to the view
      res.render("admin/all-closed-tickets", { tickets: tickets, user: req.user });
    })
    .catch(function (err) {
      // Handle the error appropriately
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the tickets." });
    });
  };

exports.getAllTickets = async function(req, res) {
    // Query the ticket tracking system to retrieve all the tickets assigned to the user
    await Ticket.find()
    .then(function (tickets) {
      // Render the admin dashboard view and pass the user and tickets data to the view
      res.status(200).send({ tickets: tickets, status: 200 });
    })
    .catch(function (err) {
      // Handle the error appropriately
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the tickets." });
    });
};

            


// create a get method for sending tickets after sorting on the basis of status , create with different name
exports.getSortedTickets = async function(req, res) {
    // Retrieve the user's ID from the req.user object
    try {
    
      // Retrieve the status from the request params
      const status = req.params.status;
      console.log("status: ", status);
  
      // Query the ticket tracking system to retrieve all the tickets assigned to the employee with the provided status
      const assignedTickets = await Ticket.find({status: status });

  
      // Render the response with the assigned tickets
      res.status(200).send({ tickets: assignedTickets, status: 200 });
    } catch (err) {
      // Handle any errors that might occur during the process
      console.error(err);
      res.status(500).send({ message: 'An error occurred while processing the request.' });
    }
  };


// create a search method for searching tickets on the basis of name , email create with different name
exports.getSearchedTickets = async function(req, res) {

    var searchQuery = req.params.searchQuery;
    console.log("search: ",searchQuery);
    // Query the ticket tracking system to retrieve all the tickets assigned to the user
   
    await Ticket.find({
        $or: [
          {
            name: {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
          {
            username: {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
          {
            email: {
              $regex: new RegExp(searchQuery, "i"),
            },
          },
        ],
      })
        .then(function(tickets) {
            console.log(tickets);
            // Render the employee dashboard view and pass the user and tickets data to the view
            res.status(200).send({ tickets: tickets, status: 200 });
        })
        .catch(function(err) {
            // Handle the error appropriately
            res.status(500).send({ message: 'An error occurred while retrieving the tickets.' });
        });
}


exports.getTicket = async function(req, res) {
    // Retrieve the ticket id from the request params
    var ticketId = req.params.ticketId;
    
    // get employee detail who is working on the ticket 
    

    // Query the ticket tracking system to retrieve the ticket
    Ticket.findById(ticketId)
      .then(function(ticket) {

        const assignedEmployee = ticket.assignedTo;
        console.log("employee: ", assignedEmployee);
        if (assignedEmployee) {
          Employee.findById({ _id: assignedEmployee._id})
            .then(async function(employee) {
                const employeeUser = await User.findById({ _id: employee.user });
                console.log("employee: ", employeeUser);

                const employeeData  = {
                    employeeSecretId: assignedEmployee._id,
                    employeeName: employeeUser.name,
                    employeeEmail: employeeUser.email,
                    employeeId: employeeUser.employeeId,
                    employeeDepartment: employee.department,
                }
              // Render the ticket view and pass the ticket data to the view
              res.render('admin/admin-ticket-form', { ticket: ticket, user: req.user, employeeData: employeeData});
            })
            .catch(function(err) {
              // Handle the error appropriately
              res.status(500).send({ message: 'An error occurred while retrieving the ticket.', error: err });
            });
        }
        else{
          res.render('admin/admin-ticket-form', { ticket: ticket, user: req.user, employeeData: null});
        }
        
        // // Render the ticket view and pass the ticket data to the view
        // res.render('admin/admin-ticket-form', { ticket: ticket, user: req.user });
      })
      .catch(function(err) {
        // Handle the error appropriately
        res.status(500).send({ message: 'An error occurred while retrieving the ticket.' });
      });
  }
