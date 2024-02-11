const express = require("express");
const passport = require("passport");

const router = express.Router();
const { requireAuth } = require("../controllers/user/userController");
const {listEmployeesSortedByClosedTickets} = require("../controllers/admin/performanceController");
const {
  getAdminDashboard,
  getAllEmployee,
  postUpdateTicketStatus,
  getEmployee,
  updateEmployeeIsVerified,
} = require("../controllers/admin/dashboardController");

const {
  getAllTickets,
  getSearchedTickets,
  getSortedTickets,
  getTicket,
  getAllClosedTickets,
} = require("../controllers/admin/ticketController");

const {
  getAdminLogin,
  postAdminLogin,
  adminOnly,
} = require("../controllers/admin/adminLoginController");

router.get("/admin-login", getAdminLogin);
router.post("/admin-login", postAdminLogin);

router.get("/admin-dashboard", adminOnly, getAdminDashboard);

router.get("/admin-dashboard/ticket/:ticketId", adminOnly, getTicket);
router.get("/admin-dashboard/all-tickets", adminOnly, getAllTickets);
router.get(
  "/admin-dashboard/all-closed-tickets",
  adminOnly,
  getAllClosedTickets
);

router.get("/admin-dashboard/tickets/:status", adminOnly, getSortedTickets);
router.get(
  "/admin-dashboard/tickets-search/:searchQuery",
  adminOnly,
  getSearchedTickets
);

router.get("/admin-dashboard/ticket/:ticketId", requireAuth, getTicket);
router.get(
  "/admin-dashboard/employee-detail/:employeeId",
  requireAuth,
  getEmployee
);
router.get("/admin-dashboard/all-employee", requireAuth, getAllEmployee);

router.post(
  "/admin-dashboard/ticket/:ticketId",
  requireAuth,
  postUpdateTicketStatus
);
router.put('/admin-dashboard/update-employee/:employeeId', updateEmployeeIsVerified);

router.get('/admin-dashboard/performance-report', listEmployeesSortedByClosedTickets);

module.exports = router;
