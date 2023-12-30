// Importing the mongoose package for connecting MongoDb
const mongoose = require('mongoose')

// Defining a schema for the 'Tour' collection in MongoDB
const tourSchema = new mongoose.Schema({
    // Field for the name of the tour
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    // Field for the rating of the tour with a default value of 4.5
    rating: {
        type: Number,
        default: 4.5
    },
    // Field for the price of the tour
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

// Creating a model named 'Tour' based on the defined schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;