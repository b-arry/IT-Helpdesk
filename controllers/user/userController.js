const User = require("../../models/user");
const Employee = require("../../models/employee");
const passport = require("passport");
const {
  generateUsernameAndPassword,
} = require("../../utils/generateUsernameAndPassword");
const { sendEmployeeIDAndPassword } = require("../../utils/sendEmail");
const validateEmail = require("../../utils/validateEmail");
const Ticket = require("../../models/ticket");

exports.getLogout = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/sign-in");
  });
};

exports.getUserDashboard = async function (req, res) {
  // Retrieve the user's ID from the req.user object
  const userId = req.user._id;


  Ticket.find({email: req.user.email})
    .then(function (tickets) {

      console.log("Tickets:", tickets);

      // Render the admin dashboard view and pass the user and tickets data to the view
      res.render("user/dashboard/user-dashboard", { tickets: tickets, user: req.user });
    })
    .catch(function (err) {
      // Handle the error appropriately
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the tickets." });
    });
  //

};

exports.postLogin = async function (req, res, next) {
  let { employeeIDorEmail, password, role } = req.body;
  console.log("Employee ID or Email:", employeeIDorEmail);
  console.log("Password:", password);
  console.log("Role:", role);

  // check if employeeIDorEmail is an employeeID or email
  if (role === "employee") {
    if (!/^EMP\d+$/.test(employeeIDorEmail)) {
      return res
        .status(422)
        .json({ message: "Invalid employee ID", status: 422 });
    }
  } else if (role === "user") {
    if (!employeeIDorEmail.includes("@")) {
      return res.status(422).json({ message: "Invalid email", status: 422 });
    }
  } else {
    return res.status(422).json({ message: "Invalid role", status: 422 });
  }

  const foundUser = await User.findOne({
    $or: [{ email: employeeIDorEmail }, { employeeId: employeeIDorEmail }],
  });
  console.log("User:", foundUser);
  if (!foundUser) {
    return res
      .status(422)
      .json({ message: "Invalid username or password", status: 422 });
  }
  const employee = await Employee.findOne({ user: foundUser._id });

  if (employee && !employee.isVerified) {
    return res
      .status(422)
      .json({ message: "Your Employee ID is not verified", status: 422 });
  }

  passport.authenticate("local", function (err, user, info) {
    console.log("Info:", info);
    if (err) {
      return next(err);
    }
    if (!foundUser) {
      return res
        .status(422)
        .json({ message: "Invalid username or password", status: 422 });
    }
    if (!foundUser.verifyPassword(password)) {
      return res.status(422).json({ message: "Invalid Password", status: 422 });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (foundUser.role === "employee" && role === "employee") {
        return res.status(200).json({
          message: "Employee logged in successfully",
          success: true,
          role: "employee",
          status: 200,
        });
      } else if (foundUser.role === "user" && role === "user") {
        return res.status(200).json({
          message: "logged in successfully",
          success: true,
          role: "user",
          status: 200,
        });
      } else {
        return res.status(422).json({ message: "Invalid role", status: 422 });
      }
    });
  })(req, res, next);
};

exports.postRegister = async function (req, res, next) {
  const { name, email, password, role, department } = req.body;
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Role:", role);
  console.log("Department:", department);

  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      // User with this email already exists
      return res
        .status(422)
        .json({ error: "User with this email already exists", status: 422 });
    }

    if (role === "employee") {
      // Generate new employeeId and password
      const { employeeId, password } = generateUsernameAndPassword();
      const newUser = new User({
        name: name,
        email: email,
        role: role,
        password: password,
        employeeId : employeeId
      });

      if (department) {
        const newEmployee = new Employee({
          user: newUser._id,
          employeeId: employeeId,
          department: department,
        });
        await newEmployee.save();
        await newUser.save();
        sendEmployeeIDAndPassword(name, employeeId, email, password);

        return res
          .status(201)
          .json({
            message: "Employee created successfully",
            status: 201,
            role: "employee",
          });
      } else {
        return res
          .status(422)
          .json({ message: "Invalid department", status: 422 });
      }
    } else if (role === "user") {
      // Proceed with regular user registration
      const newUser = new User({
        name: name,
        email: email,
        role: role,
        password: password,
      });
      await newUser.save();

      // Log in the user
      req.logIn(newUser, function (err) {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          success: true,
          role: "user",
          status: 201,
          message: "User created successfully",
        });
      });
    } else {
      return res.status(422).json({ message: "Invalid role", status: 422 });
    }
  } catch (err) {
    return next(err);
  }
};

exports.requireAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/sign-in");
};
