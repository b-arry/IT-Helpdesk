const User = require("../../models/user");
const passport = require("passport");
// create a get method for render admin login page
exports.getAdminLogin = function (req, res) {
    if(req.isAuthenticated() && req.user.role === 'admin') return res.redirect("/admin/admin-dashboard")
    res.render("admin/login");
    };

// create a login controller for admin role which accept email or username and password as a parameter

exports.postAdminLogin = async function(req, res, next) {
  let { employeeIDorEmail, password } = req.body;
  console.log('Employee ID :', employeeIDorEmail);
  console.log('Password:', password);
  const foundUser = await User.findOne({ employeeId: employeeIDorEmail , role: 'admin'});
  console.log('User:', foundUser);
  const role = 'admin';
  // check if employeeIDorEmail is an employeeID or email
  if (role === 'admin') {
    if (!/^EMP\d+$/.test(employeeIDorEmail)) {
      return res.send({ message: 'Invalid Admin Credentials', status: 422 });
    }
  }  else {
    return res.send({ message: 'Invalid role', status: 422 });
  }
  
  
  passport.authenticate('local', function (err, user, info) {
    console.log('Info:', info);
    if (err) { return next(err); }
    if (!foundUser) {
      return res.send({ message: 'Invalid employee ID or password', status: 422 });
    }
    if (!foundUser.verifyPassword(password)) {
      return res.send({ message: 'Invalid Password', status: 422 });
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      if (foundUser.role === 'admin') {
        return res.redirect("/admin/admin-dashboard")
      } 
      else {
        return res.send({ message: 'Invalid role', status: 422 });
      }
    });
  })(req, res, next);
};

exports.adminOnly = function(req, res, next) {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
  
    // User is authenticated and has admin role, grant access
    next();
  }