const Ticket = require('../../models/ticket');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { assignEmployeeToTicket } = require('../../utils/assignTicketToEmployee');

dotenv.config();

exports.getNewTicketForm = (req, res) => {
  res.render('user/tickets/create', { user: req.user });
};

exports.faq = (req, res) => {
  res.render('user/tickets/faqs', { user: req.user });
};

exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is already authenticated, redirect them to the appropriate dashboard
    if (req.user.role === 'user') {
      return res.redirect('/user-dashboard');
    } else if (req.user.role === 'employee') {
      return res.redirect('/employee/employee-dashboard');
    }
  }
  // If the user is not authenticated or their role is not defined, render the sign-in page
  res.render('user/tickets/sign-in', { user: req.user });
};
exports.submitNewTicket = async (req, res) => {
  try {
    // Validate and sanitize input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Validate data
    if (!req.body.category || !req.body.priority || !req.body.message || !req.body.name || !req.body.email) {
      return res.status(422).json({ message: 'Please fill all the fields' });
    }

    // Save ticket in the database
    const ticket = new Ticket({
      name: req.body.name,
      email: req.body.email,
      category: req.body.category,
      priority: req.body.priority,
      message: req.body.message,
      status: 'open'
    });
  
    
    // Send email to the employee
    Promise.all([
      ticket.save(),
      // Assign employee to the ticket
      assignEmployeeToTicket(ticket)
    ]);

    return res.status(200).json({ message: 'Ticket created successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};