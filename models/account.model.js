const mongoose = require('mongoose');
const validator = require('validator');

const Account = new mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, 'Email is required'],
      unique: [true, 'Email is already exist'],
      validate: [validator.isEmail, 'Invalid email'],
    },
    password: {
      type: String,
      require: [true, 'Password is required'],
      minlength: 6,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user', 'manager'],
        message: 'Invalid role',
      },
      default: 'user',
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiration: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiration: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Account', Account);
