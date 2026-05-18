// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Development', 'HR', 'Marketing', 'Finance', 'Design', 'Sales', 'Operations'],
    },
    skills: {
      type: [String],
      default: [],
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Score cannot be less than 0'],
      max: [100, 'Score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);