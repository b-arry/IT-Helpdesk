const Employee = require('../models/employee');
const { sendEmailToEmployeeForAssignedTicket, sendEmailToUserForTicketSubmission } = require('./sendEmail');
// Assume you have a function to fetch employees from the database based on department


// Logging utility function
function log(message) {
  console.log(`[LOG]: ${message}`);
}

// Error handling utility function
function logError(error) {
  console.error('[ERROR]:', error);
}

async function fetchEmployeesByDepartmentFromDatabase(department) {
  try {
    // Database query logic here to fetch employees with the given department
    const employees = await Employee.find({ department: department }).populate('user');
    return employees;
  } catch (error) {
    logError('Error fetching employees from the database:', error);
    throw error;
  }
}

let departmentAssignments = {};

async function assignEmployeeToTicket(ticket) {
    const ticketCategory = ticket.category;
  
    if (!departmentAssignments.hasOwnProperty(ticketCategory)) {
      departmentAssignments[ticketCategory] = 0;
    }
  
    const employees = await fetchEmployeesByDepartmentFromDatabase(ticketCategory);
    if (employees.length === 0) {
      log(`No employee available for the given ticket category`);
      return { status: false, message: 'No employee available for the given ticket category.' };
    }
  
    try {
      let assignedEmployee;
  
      if (employees.length === 1) {
        // If there is only one employee with the matching category, assign the ticket directly to that employee
        assignedEmployee = employees[0];
      } else {
        // If there are multiple employees with the matching category, use round-robin assignment
        const employeeIndex = departmentAssignments[ticketCategory];
        assignedEmployee = employees[employeeIndex];
        departmentAssignments[ticketCategory] = (employeeIndex + 1) % employees.length;
      }
  
      log(`Assigning ticket ${ticket.id} to employee ${assignedEmployee.user.name}`);
  
      ticket.assignedTo = assignedEmployee;
  
      await Promise.all([
        ticket.save(),
        sendEmailToEmployeeForAssignedTicket(ticket, assignedEmployee.user.name, assignedEmployee.user.email),
        sendEmailToUserForTicketSubmission(ticket)
      ]);
  
      log(`Ticket ${ticket.id} assigned successfully.`);
      return { status: true, message: 'Ticket assigned successfully.' };
    } catch (error) {
      logError(`Failed to assign ticket ${ticket.id}: ${error}`);
      return { status: false, message: 'Failed to assign the ticket. Please try again later.' };
    }
  }

module.exports = { assignEmployeeToTicket };
