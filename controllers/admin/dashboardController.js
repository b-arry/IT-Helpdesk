const User = require("../../models/user");
const Employee = require("../../models/employee");
const Ticket = require("../../models/ticket");
const {
  getOpenTicketsCount,
  getClosedTicketsCount,
  getInProgressTicketsCount,
  getAverageTimeToCloseTickets,
  calculateMonthlyPercentage,
} = require("../../utils/calculateMetrics");

// create a get method for render admin dashboard page
exports.getAdminDashboard = async function (req, res) {
  if (req.user.role !== "admin") {
    // req.flash("error", "You are not authorized to perform this action.");
    return res.redirect("/sign-in");
  }
  // Query the ticket tracking system to retrieve all the tickets
  Ticket.find()
    .then(async function (tickets) {
      // Render the admin dashboard view and pass the user and tickets data to the view
      const [
        openTicketsCount,
        closedTicketsCount,
        inProgressTicketsCount,
        averageTimeToCloseTickets,
        { percentChange },
      ] = await Promise.all([
        getOpenTicketsCount(),
        getClosedTicketsCount(),
        getInProgressTicketsCount(),
        getAverageTimeToCloseTickets(),
        calculateMonthlyPercentage(),
      ]);

      res.render("admin/dashboard", {
        user: req.user,
        tickets: tickets,
        openTicketsCount,
        closedTicketsCount,
        inProgressTicketsCount,
        averageTimeToCloseTickets,
        percentChange,
      });
    })
    .catch(function (err) {
      // Handle the error appropriately
      res.status(500).send({
        message: "An error occurred while retrieving the tickets.",
        error: err,
      });
    });
};

// create a post method for update ticket status and employee assignedTo ticket it will accept ticket id as a parameter and employee id as a parameter
exports.postUpdateTicketStatus = function (req, res) {
  // Retrieve the ticket id from the request params
  var ticketId = req.params.ticketId;
  var employeeId = req.body.employeeId;

  // check user if he is admin or not
  if (req.user.role !== "admin") {
    req.flash("error", "You are not authorized to perform this action.");
    return res.redirect("/sign-in");
  }

  // retrieve employee from employee collection and check if employee exist or not and assign ticket to employee
  Employee.findById(employeeId)
    .then(function (employee) {
      if (!employee) {
        req.flash("error", "Employee does not exist.");
        return res.redirect("/admin-dashboard");
      }
      // Query the ticket tracking system to retrieve the ticket
      Ticket.findById(ticketId)
        .then(function (ticket) {
          // Update the ticket status and assignedTo fields
          if (req.body.status !== null) {
            ticket.status = req.body.status;
          }
          ticket.assignedTo = employeeId;
          // Save the updated ticket to the database
          return ticket.save();
        })
        .then(function (updatedTicket) {
          // Redirect to the ticket page
          req.flash("success", "Ticket updated successfully.");
          res.redirect("/admin-dashboard/ticket/" + ticketId);
        })
        .catch(function (err) {
          // Handle the error appropriately
          res.status(500).send({
            message: "An error occurred while retrieving the ticket.",
          });
        });
    })
    .catch(function (err) {
      // Handle the error appropriately
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the employee." });
    });
};

// create a get method for render all employee page
exports.getAllEmployee = function (req, res) {
  if (req.user.role !== "admin") {
    return res.send("error", "You are not authorized to perform this action.");
    // return res.redirect("/sign-in");
  }
  // Query the ticket tracking system to retrieve all the tickets
  Employee.find({ user: { $ne: req.user._id } })
    .populate("user")
    .then(function (employees) {
      // Render the admin dashboard view and pass the user and tickets data to the view
      res.render("admin/all-employee-detail", {
        user: req.user,
        employees: employees,
      });
    })
    .catch(function (err) {
      // Handle the error appropriately
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the employees." });
    });
};

// create a get method for render employee page it will accept employee id as a parameter
exports.getEmployee = function (req, res) {
  // Retrieve the ticket id from the request params
  var employeeId = req.params.employeeId;

  // Query the ticket tracking system to retrieve the ticket
  Employee.findById(employeeId)
    .populate("user")
    .then(function (employee) {
      // Query the ticket tracking system to retrieve all the tickets assigned to the user
      Ticket.find({ assignedTo: employee._id })
        .then(function (tickets) {
          // Render the employee dashboard view and pass the user and tickets data to the view
          res.render("admin/employee-detail", {
            employee: employee,
            user: req.user,
            tickets: tickets,
          });
        })
        .catch(function (err) {
          // Handle the error appropriately
          res.status(500).send({
            message: "An error occurred while retrieving the tickets.",
          });
        });
      // Render the ticket view and pass the ticket data to the view
    })
    .catch(function (err) {
      // Handle the error appropriately
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the employee." });
    });
};

exports.updateEmployeeIsVerified = async (req, res) => {
  const { employeeId } = req.params;
  const { isVerified } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId: employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.isVerified = isVerified;
    const updatedEmployee = await employee.save();

    return res
      .status(200)
      .json({ message: "Employee updated successfully", status: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
