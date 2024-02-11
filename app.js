const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

require('dotenv').config();
const db = require('./db');
const app = express();

db.connect();
// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config to authenticate user using EmployeeId or email
passport.use(new LocalStrategy(
  {
    usernameField: 'employeeIDorEmail',
    passwordField: 'password',
  },
  async function (employeeIDorEmail, password, done) {
    const user = await User.findOne({$or: [{ employeeId: employeeIDorEmail }, { email: employeeIDorEmail }]});
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    return done(null, user.verifyPassword(password) ? user : false, { message: 'Incorrect password.' });
  }
));






passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });



// Logging middleware
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.use(function (req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employee');
const adminRoutes = require('./routes/admin');

app.use('/', userRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);

// Error handling middleware
app.use(function (err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});