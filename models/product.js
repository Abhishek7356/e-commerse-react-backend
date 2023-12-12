const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        default: []
    },
    size: {
        type: Array,
        default: []
    },
    color: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("product", productSchema);