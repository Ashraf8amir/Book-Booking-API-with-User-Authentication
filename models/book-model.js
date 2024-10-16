const mongoose = require('mongoose');

const bookschema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    pages: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    publicationYear: { type: Number, required: true },
    available: { type: Boolean, default: true }
})

module.exports = mongoose.model('Book', bookschema);

