// Importing the mongoose package for MongoDB schema and model handling
const mongoose = require('mongoose');
// Importing the Tour Model
const Tour = require('./tourModel')


// Defining a schema for the 'Tour' collection in MongoDB
const reviewSchema = new mongoose.Schema({
    // Field for the name of the tour
    review: {
        type: String,
        required: [true, 'A review must have a description'],
        trim: true,
        // maxlength: [150, 'A review must have less or equal then 150 characters'],
        // minlength: [20, 'A review must have more or equal then 20 characters'],
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

/** Static method for calculating average ratings on tours.
 * @param {string} tourId - The ID of the tour.
 */
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    // Aggregate pipeline to calculate statistics
    const stats = await this.aggregate([
        {
            // Match stage to filter reviews by tour ID
            $match: {
                tour: tourId
            },
        },
        {
            // Group stage to calculate total number of ratings and average ratings
            $group: {
                _id: '$tour',
                // Count the number of ratings
                numberOfRatings: {
                    $sum: 1
                },
                // Calculate the average of ratings
                averageRatings: {
                    $avg: '$ratings'
                }
            }
        }
    ]);

    // Checking if there are statistics available
    if (stats.length > 0) {
        // Update tour document with calculated statistics
        await Tour.findByIdAndUpdate(tourId, {
            // Update ratings quantity
            ratingsQuantity: stats[0].numberOfRatings,
            // Update average ratings
            ratingsAverage: stats[0].averageRatings
        });
    } else {
        // If no statistics are available, update tour document with default statistics
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0, // Set ratings quantity to 0
            ratingsAverage: 4.5 // Set average ratings to 4.5
        });
    }
};

// Post middleware to calculate average ratings after saving a review
reviewSchema.post('save', function () {
    // Call the static method to recalculate average ratings
    this.constructor.calcAverageRatings(this.tour);
});


// This middleware runs before any findOneAnd query on reviewSchema.
// This is useful for storing the review document that will be found by the query.
reviewSchema.pre(/^findOneAnd/, async function (next) {
    // Stores the found review document
    this.reviewToFind = await this.findOne();
    // Proceed to the next middleware function in the stack
    next();
});

// This middleware runs after any findOneAnd query on reviewSchema.
// Here, the calcAverageRatings method is called to update the tour statistics
// where the recently modified or deleted review resides.
reviewSchema.post(/^findOneAnd/, async function () {
    // Calls the calcAverageRatings method to update the tour statistics
    this.reviewToFind.constructor.calcAverageRatings(this.reviewToFind.tour);
});


// Creating a model named 'Tour' based on the defined schema
const Review = mongoose.model('Review', reviewSchema);
// Exporting the 'Tour' model for use in other parts of the application
module.exports = Review;