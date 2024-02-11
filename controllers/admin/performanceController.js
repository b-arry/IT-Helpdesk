
const User = require('../../models/user');
const Ticket = require('../../models/ticket');
const Employee = require('../../models/employee');

// Controller function to list employees sorted by the number of closed tickets
const listEmployeesSortedByClosedTickets = async (req, res) => {
    try {
      // MongoDB aggregation pipeline to calculate the number of closed tickets for each employee
      const pipeline = [
        {
          $match: {
            status: 'closed', // Assuming your ticket model has a 'status' field to indicate ticket status
          },
        },
        {
          $group: {
            _id: '$assignedTo', // Assuming the field name storing the employee ID in the ticket model is 'employeeId'
            closedTickets: { $sum: 1 }, // Calculate the total number of closed tickets for each employee
          },
        },
        {
          $lookup: {
            from: 'employees', // Name of the 'Employee' collection
            localField: '_id',
            foreignField: '_id',
            as: 'employeeData',
          },
        },
        {
          $unwind: '$employeeData',
        },
        {
          $lookup: {
            from: 'users', // Name of the 'User' collection
            localField: 'employeeData.user', // Assuming 'user' field in Employee schema references 'User' model
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $sort: { closedTickets: -1 }, // Sort employees based on the number of closed tickets in descending order
        },
        {
          $project: {
            _id: 1,
            name: '$employeeData.name', // Assuming your 'Employee' model has a 'name' field
            department: '$employeeData.department', // Assuming your 'Employee' model has a 'name' field
            closedTickets: 1,
            user: 1, // Include the 'user' field in the response
          },
        },
      ];
  
      // Execute the aggregation pipeline
      const [employees] = await Promise.all([Ticket.aggregate(pipeline)]);
      
      console.log(employees);
      // Return the sorted list of employees along with the number of closed tickets in the API response
      return res.render('admin/employee-performance-report', { employees: employees, user: req.user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    listEmployeesSortedByClosedTickets,
  };
  