

const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
// create a method to send emails using nodemailer to user for new ticket and if employee change the status of ticket
sendEmailForTicketStatusUpdateToUser = async (ticket) => {
    html = ``
    if(ticket.status == "open"){
        html = `<p>We are pleased to inform you that we have received your ticket.</p>
        <p>Here is the ticket information:</p>
        <ul>
        <li>Name: ${ticket.name}</li>
        <li>Category: ${ticket.category}</li>
        <li>Priority: ${ticket.priority}</li>
        <li>Message: ${ticket.message}</li>
        <li><b>Updated Status: ${ticket.status}</b></li>
        </ul>
        <p>You will be notified when your ticket is resolved.</p>
        <p>Please do not reply to this email.</p>`
    } else if(ticket.status == "in progress"){
        html = `
        <p>We are pleased to inform you that your ticket is in progress</p>
        <p>Here is the ticket information:</p>
        <ul>
        <li>Name: ${ticket.name}</li>
        <li>Category: ${ticket.category}</li>
        <li>Priority: ${ticket.priority}</li>
        <li>Message: ${ticket.message}</li>
        <li><b>Updated Status: ${ticket.status}</b></li>
        </ul>
        <p>You will be notified when your ticket is resolved.</p>
        <p>Please do not reply to this email.</p>
    `
    } else if(ticket.status == "closed"){
        html = `
        <p>We are pleased to inform you that your ticket issue ${ticket.message} is resolved</p>
        <p>Here is the ticket information:</p>
        <ul>
        <li>Name: ${ticket.name}</li>
        <li>Category: ${ticket.category}</li>
        <li>Priority: ${ticket.priority}</li>
        <li><b>Updated Status: ${ticket.status}</b></li>
        </ul>
        <p>Thank you for your patience.</p>
        <p>Please do not reply to this email.</p>
    `
    }

    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to:ticket.email,
        subject: 'Ticket Status Update',
        // create html template for email body in which information of ticket is shown and employee info is shown
        html: html
    };
    await transporter.sendMail(mailOptions);
}

// create a method to send emails using nodemailer to admin for new ticket and if employee change the status of ticket
sendEmailForTicketStatusUpdateToAdmin = async (ticket, employee) => {

    
    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: process.env.EMAIL_TO,
        subject: 'Ticket Status Update',
        // create html template for email body in which information of ticket is shown and employee info is shown
        html: `
        <p>We are pleased to inform you that we have received a new form submission from ${employee.name}.</p>
        <p>Here is the ticket information:</p>
        <ul>
        <li>Name: ${ticket.name}</li>
        <li>Category: ${ticket.category}</li>
        <li>Priority: ${ticket.priority}</li>
        <li>Message: ${ticket.message}</li>
        <li><b>Updated Status: ${ticket.status}</b></li>
        </ul>
        <p>Here is the employee information:</p>
        <ul>
        <li>Employee Name: ${employee.name}</li>
        <li>Employee Email: ${employee.email}</li>
        </ul>
        <p>Please check more details at admin panel.</p>
        <p>Please do not reply to this email.</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

// create a method to send emails using nodemailer to admin for new ticket and if employee change the status of ticket
sendPasswordResetMail = async (token ,toEmail) => {
    const resetPasswordLink = `http://127.0.0.1:3000/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(toEmail)}`;
    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: toEmail,
        subject: "Password Reset",
            text: `
              You have requested a password reset.
              To reset your password, click on the following link:
              Email : ${toEmail}
              Password reset link :${resetPasswordLink}
            `,
    };

    await transporter.sendMail(mailOptions);
}

sendEmployeeIDAndPassword = async (name,employeeId,toEmail,password) => {
    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: toEmail,
        subject: "Employee registration successful",
            text: `Hi ${name} Welcome to Ticket Tracking System.\nYou have been registered as an employee.\n\nYour Employee ID is : ${employeeId}\nYour Password is : ${password}\n\nPlease login to the system using this credentials.\n\ndo not share this credentials with anyone.\nNote : Please do not reply to this email.
            `,
    };

    await transporter.sendMail(mailOptions);
}

sendEmailToUserForTicketSubmission = async (ticket) => {
    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: ticket.email,
        subject: 'Your Ticket has been submitted successfully',
        html: `
          <p>We are pleased to inform you that we have received your ticket.</p>
            <p>You will be notified when your ticket is resolved.</p>
            <p>Thank you for your patience.</p>\n
          <p>Please do not reply to this email.</p>
        `
      };

    await transporter.sendMail(mailOptions);
}

sendEmailToEmployeeForAssignedTicket = async (ticket,employeeName,employeeEmail) => {
    const mailOptions = {
        from: `${process.env.EMAIL_USER}`,
        to: employeeEmail,
        subject: `Hi ${employeeName}, You have been assigned a ticket`,
        html: `
            <p>We are pleased to inform you that you have been assigned a ticket.</p>
            <p>Here is the ticket information:</p>
            <ul>
            <li>Name: ${ticket.name}</li>
            <li>Category: ${ticket.category}</li>
            <li>Priority: ${ticket.priority}</li>
            <li>Message: ${ticket.message}</li>
            <li><b>Updated Status: ${ticket.status}</b></li>
            <li><b>Raise Time: ${ticket.createdAt}</b></li>
            </ul>
            <p>Please do not reply to this email.</p>
        `
        };
    
    await transporter.sendMail(mailOptions);
}


module.exports = {
                    sendEmailForTicketStatusUpdateToAdmin, 
                    sendPasswordResetMail, 
                    sendEmployeeIDAndPassword,
                    sendEmailForTicketStatusUpdateToUser,
                    sendEmailToUserForTicketSubmission,
                    sendEmailToEmployeeForAssignedTicket
                };