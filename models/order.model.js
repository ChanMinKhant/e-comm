const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);

// {
//     _id: ObjectId("64a1f8c9e1b2c8a1b2c3d4e"),
//     user: ObjectId("64a1f8c9e1b2c8a1b2c3d4f"),
//     products: [{ product: ObjectId("64a1f8c9e1b2c8a1b2c3d4g"), quantity: 2, priceAtPurchase: 10.99 }, { product: ObjectId("64a1f8c9e1b2c8a1b2c3d4h"), quantity: 1, priceAtPurchase: 5.99 }],
// }
