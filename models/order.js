const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            type: Object
        }
    ],
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);