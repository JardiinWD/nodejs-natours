// Importing the mongoose package for MongoDB schema and model handling
const mongoose = require('mongoose');

// Defining a schema for the 'Tour' collection in MongoDB
const tourSchema = new mongoose.Schema({
    // Field for the name of the tour
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    // Field for the duration of the tour
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    // Field for the maximum group size of the tour
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    // Field for the difficulty level of the tour
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    // Field for the average ratings of the tour with a default value of 4.5
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    // Field for the quantity of ratings received by the tour with a default value of 0
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    // Field for the price of the tour
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    // Field for the discount price of the tour (optional)
    priceDiscount: Number,
    // Field for the summary of the tour
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    // Field for the detailed description of the tour
    description: {
        type: String,
        trim: true
    },
    // Field for the cover image of the tour
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    // Field for an array of additional images related to the tour
    images: [String],
    // Field for the creation date of the tour, set to the current date by default
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // Field for an array of start dates for the tour
    startDates: [Date]
});

// Creating a model named 'Tour' based on the defined schema
const Tour = mongoose.model('Tour', tourSchema);

// Exporting the 'Tour' model for use in other parts of the application
module.exports = Tour;
