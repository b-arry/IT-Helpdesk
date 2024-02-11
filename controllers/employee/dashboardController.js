const User = require('../../models/user');
const Employee = require('../../models/employee');
const Ticket = require('../../models/ticket');
const {sendEmailForTicketStatusUpdateToAdmin, sendEmailForTicketStatusUpdateToUser} = require('../../utils/sendEmail');


exports.getEmployeeDashboard = async function(req, res) {
    if (req.user.role !== 'employee') {
      return res.redirect('/user-dashboard');
    }
  
    // Retrieve the user's ID from the req.user object
    var userId = req.user.id;
    const employee = await Employee.findOne({ user: userId })

    // Query the ticket tracking system to retrieve all the tickets assigned to the user
    Ticket.find({ assignedTo: employee._id , status: { $ne: 'closed' }})
      .then(function(tickets) {
        
        // Render the employee dashboard view and pass the user and tickets data to the view
        res.render('employee/dashboard/employee-dashboard', { user: req.user, tickets: tickets });
      })
      .catch(function(err) {
        // Handle the error appropriately
        res.status(500).send({ message: 'An error occurred while retrieving the tickets.' });
      });
  };



// create a get method for render ticket page it will accept ticket id as a parameter
exports.getTicket = function(req, res) {
    // Retrieve the ticket id from the request params
    var ticketId = req.params.ticketId;
  
    // Query the ticket tracking system to retrieve the ticket
    Ticket.findById(ticketId)
      .then(function(ticket) {
        // Render the ticket view and pass the ticket data to the view
        res.render('employee/dashboard/employee-ticket-form', { ticket: ticket, user: req.user });
      })
      .catch(function(err) {
        // Handle the error appropriately
        res.status(500).send({ message: 'An error occurred while retrieving the ticket.' });
      });
  }

// create a post method for update ticket status it will accept ticket id as a parameter
exports.postUpdateTicketStatus = function(req, res) {
    // Retrieve the ticket id from the request params
    var ticketId = req.params.ticketId;
    // check user if he is employee or not
    if (req.user.role !== 'employee') {
        req.flash('error', 'You are not authorized to perform this action.');
        return res.redirect('/sign-in');
    }

    // Retrieve the new status from the request body
    var newStatus = req.body.status;
  
    // Query the ticket tracking system to retrieve the ticket
    Ticket.findById(ticketId)
      .then(function(ticket) {
        // Update the ticket status
        ticket.status = newStatus;
        if(ticket.status === 'closed') {
          ticket.closedAt = Date.now();
        }
        else if(ticket.status === 'in progress') {
          ticket.workedSince = Date.now();
          ticket.updatedAt = Date.now();
        }
        
        // Save the updated ticket to the database
        ticket.save()
          .then(function(updatedTicket) {
            // Redirect the user to the ticket view
            try {
              sendEmailForTicketStatusUpdateToUser(updatedTicket); // to customer who raise the ticket
              sendEmailForTicketStatusUpdateToAdmin(updatedTicket, req.user);
            } catch (error) {
              console.log('Error sending email for ticket status update:', error);
            }
            
            res.status(200).send({ message: 'Ticket status updated successfully' });
          })
          .catch(function(err) {
            // Handle the error appropriately
            res.status(500).send({ message: 'An error occurred while updating the ticket.' });
          });
      })
      .catch(function(err) {
        // Handle the error appropriately
        res.status(500).send({ message: 'An error occurred while retrieving the ticket.' });
      });
  }