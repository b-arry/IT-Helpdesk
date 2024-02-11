const User = require('../../models/user');
const Employee = require('../../models/employee');
const Ticket = require('../../models/ticket');

exports.getEmployeeClosedTickets = async function(req, res) {
  // Retrieve the user's ID from the req.user object
  var userId = req.user.id;
  const employee = await Employee.findOne({ user: userId })
  // Query the ticket tracking system to retrieve all the tickets assigned to the user
  await Ticket.find({ assignedTo: employee._id, status: "closed" })
  .then(function (tickets) {
    // Render the admin dashboard view and pass the user and tickets data to the view
    res.render("employee/dashboard/employee-closed-tickets", { tickets: tickets, user: req.user });
  })
  .catch(function (err) {
    // Handle the error appropriately
    res
      .status(500)
      .send({ message: "An error occurred while retrieving the tickets." });
  });
};
// create a get method to get all tickets assigned to employee
exports.getAllTickets = async function(req, res) {
    // Retrieve the user's ID from the req.user object
    var userId = req.user.id;
    const employee = await Employee.findOne({ user: userId })
    // Query the ticket tracking system to retrieve all the tickets assigned to the user
    await Ticket.find({ assignedTo: employee._id })
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
      // Retrieve the user's ID from the req.user object
      const userId = req.user.id;
  
      // Find the employee based on the provided user ID
      const employee = await Employee.findOne({ user: userId });
  
      if (!employee) {
        return res.status(404).send({ message: 'Employee not found.' });
      }
  
      // Retrieve the status from the request params
      const status = req.params.status;
      console.log("status: ", status);
  
      // Query the ticket tracking system to retrieve all the tickets assigned to the employee with the provided status
      const assignedTickets = await Ticket.find({ assignedTo: employee._id, status: status });

  
      // Render the response with the assigned tickets
      res.status(200).send({ tickets: assignedTickets, status: 200 });
    } catch (err) {
      // Handle any errors that might occur during the process
      console.error(err);
      res.status(500).send({ message: 'An error occurred while processing the request.' });
    }
  };


// create a search method for searching tickets on the basis of name , email create with different name
exports.getSearchedTickets =async function(req, res) {
    // Retrieve the user's ID from the req.user object
    var userId = req.user.id;
    const employee = await Employee.findOne({ user: userId })
    // Retrieve the search query from the request params
    var searchQuery = req.params.searchQuery;
    console.log("search: ",searchQuery);
    // Query the ticket tracking system to retrieve all the tickets assigned to the user
   
    await Ticket.find({
        assignedTo: employee._id,
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