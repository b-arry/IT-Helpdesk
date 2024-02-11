const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['payment', 'order', 'services', 'quality issues']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  message: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  issueResolveNote: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'in progress'],
    default: 'open',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  workedSince: {
    type: Date
  },
  closedAt: {
    type: Date
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;