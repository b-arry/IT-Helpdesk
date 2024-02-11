const express = require('express');
const router = express.Router();

const {getNewTicketForm , submitNewTicket, faq, signIn } = require('../controllers/user/ticketController');
const userController = require('../controllers/user/userController');
const { getForgetPassword,getResetPassword, postForgetPassword , postResetPassword} = require('../controllers/user/passwordController');


  
router.get('', getNewTicketForm);
router.get('/faq', faq);
router.get('/sign-in', signIn);
router.get('/user-dashboard', userController.requireAuth, userController.getUserDashboard);
router.get('/logout', userController.getLogout);
router.get('/forget-password', getForgetPassword);
router.get('/reset-password', getResetPassword);
// router.get('/tickets', userController.getTickets);

router.post('/tickets/create', submitNewTicket);
router.post('/login', userController.postLogin);
router.post('/register', userController.postRegister);
router.post('/user-forget-password', postForgetPassword);
router.post('/confirm-reset-password', postResetPassword);









module.exports = router;