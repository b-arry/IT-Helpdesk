const express = require('express');
const router = express.Router();
const {requireAuth} = require('../controllers/user/userController');
const {getEmployeeDashboard, getTicket, postUpdateTicketStatus} = require('../controllers/employee/dashboardController');
const { getSortedTickets, getSearchedTickets,getAllTickets,getEmployeeClosedTickets } = require('../controllers/employee/ticketController');


router.get('/employee-dashboard', requireAuth, getEmployeeDashboard);
router.get('/employee-closed-tickets', requireAuth, getEmployeeClosedTickets);

router.get('/employee-dashboard/ticket/:ticketId', requireAuth, getTicket);
router.get('/employee-dashboard/all-tickets', requireAuth, getAllTickets);
router.get('/employee-dashboard/tickets/:status', requireAuth, getSortedTickets);
router.get('/employee-dashboard/tickets-search/:searchQuery', requireAuth, getSearchedTickets);


router.post('/employee-dashboard/ticket/:ticketId', requireAuth, postUpdateTicketStatus);


module.exports = router;