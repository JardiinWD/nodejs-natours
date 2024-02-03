// Importing the mongoose package for MongoDB schema and model handling
const mongoose = require('mongoose');

// Defining a schema for the 'Tour' collection in MongoDB
const reviewSchema = new mongoose.Schema({
    // Field for the name of the tour
    review: {
        type: String,
        required: [true, 'A review must have a description'],
        trim: true,
        maxlength: [150, 'A review must have less or equal then 150 characters'],
        minlength: [20, 'A review must have more or equal then 20 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    // Field for the average ratings of the tour with a default value of 4.5
    ratings: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    // Field for the creation date of the tour, set to the current date by default
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must be written by an User']
    }
}, {
    // Configuration for transforming the document into JSON format with virtual properties included
    toJSON: {
        virtuals: true,
    },
    // Configuration for transforming the document into a plain JavaScript object with virtual properties included
    toObject: {
        virtuals: true,
    },
})

/** Middleware function executed before an aggregation operation on the 'Review' collection.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
reviewSchema.pre(/^find/, function (next) {
    // Populating the 'tour' field with user name, excluding everything else
    /* this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name photo'
    }) */

    this.populate({
        path: 'user',
        select: 'name photo'
    })

    // Calling the next middleware in the stack
    next();
})


// Creating a model named 'Tour' based on the defined schema
const Review = mongoose.model('Review', reviewSchema);
// Exporting the 'Tour' model for use in other parts of the application
module.exports = Review;