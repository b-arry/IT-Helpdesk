const User = require("../../models/user");

const bcrypt = require("bcryptjs");
const { sendPasswordResetMail } = require("../../utils/sendEmail");

// create a get method which render forget password page
exports.getForgetPassword = function (req, res) {
  res.render("user/forget-password");
};

// create a get method which render reset password page
exports.getResetPassword = async function (req, res) {
  const token = req.query.token;
  const email = req.query.email;

  // Find the user by email and token
  User.findOne({ email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(function(user) {
      if (!user) {
        // Handle the case where the token is invalid or expired
        // You can render an error page or redirect to a different page
        return res.status(404).json({ message: "Invalid or expired token", status: 404 });
      }

    

      return res.render("user/reset-password", { token: token , email: email});
  
    })
    .catch(function(err) {
      return res.status(500).json({ message: err, status: 500 });
    });
  
};

// create a post method which accept email as a parameter and send reset password link to user email
exports.postForgetPassword = async function (req, res) {
  try {
    const email = req.body.email;

    // Find the user by email address
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    // Generate a random token
    const token = bcrypt.hashSync(Math.random().toString(36).slice(7), 10);

    // Save the token to the user's record
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 60 * 60 * 24; // 24 hours

    Promise.all([
      user.save(),
     // Send an email with the token
      sendPasswordResetMail(token, email)
    ]);


    return res.status(200).json({ message: "Password reset link sent", status: 200 });
  } catch (err) {
    console.error('Error in sending mail:', err);
    return res.status(500).json({ message: "Error in sending mail", status: 500 });
  }
};


exports.postResetPassword = async function(req, res) {
  const token = req.body.token;
  const email = req.body.email;
  const newPassword = req.body.resetPassword;
  const confirmPassword = req.body.resetConfirmPassword;

  // Validate the password
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match", status: 400 });
  }

  try {
    // Find the user by email and token
    const user = await User.findOne({ email, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token", status: 404 });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully", status: 200 });
  } catch (err) {
    return res.status(500).json({ message: err, status: 500 });
  }
};
