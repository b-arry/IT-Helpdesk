const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: false
  },
  position: {
    type: String,
    required: false
  },
  isVerified: { type: Boolean, default: false }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;