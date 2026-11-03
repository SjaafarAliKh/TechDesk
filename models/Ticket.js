const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
    category: {
    type: String,
    enum: ["Network", "Hardware", "Software", "Account"],
    required: true
  },
  


}, {timestamps: true});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
