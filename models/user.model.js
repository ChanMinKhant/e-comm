const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    // TODO: add validation for negative balance
    validate: {
      validator: function (v) {
        return v >= 0;
      },
      message: 'Balance cannot be negative',
    },
  },
});

module.exports = mongoose.model('User', userSchema);
