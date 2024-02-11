const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
      },
  employeeId: {
    type: String,
    required: false,
    default:'',
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['user', 'employee','admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetToken: String,
  resetTokenExpiration: {
    type: Date,
    default: Date.now() + 60 * 60 * 24
  }
});

// Hash the password before saving the user
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

// Verify the password for authentication
userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create a method on user to send password reset email

const User = mongoose.model('User', userSchema);

module.exports = User;