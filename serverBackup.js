const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const app = express();

// Create a new instance of MongoStore
// const store = new MongoStore({
//   mongooseConnection: mongoose.connection,
//   ttl: 14 * 24 * 60 * 60 // session will expire in 14 days
// });

// Connect to MongoDB
// mongoose.connect('mongodb://localhost/ticketing', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error(err));

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// const secretKey = process.env.SECRET_KEY;
// Sessions
// app.use(session({
//   secret: secretKey,
//   resave: false,
//   saveUninitialized: false,
//   store:store
// }));

// Routes
// const adminRoutes = require('./routes/admin');
// const employeeRoutes = require('./routes/employee');
const userRoutes = require('./routes/user');

// app.use('/admin', adminRoutes);
// app.use('/employee', employeeRoutes);
app.use('/', userRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));