// Importing necessary packages and modules
const mongoose = require('mongoose'); // MongoDB schema and model handling
const slugify = require('slugify'); // Package for creating slugs
const validator = require('validator'); // Package for validation
const User = require('./userModel'); // User Schema for mapping

// Defining the schema for the 'Tour' collection in MongoDB
const tourSchema = new mongoose.Schema({
    // Field for the name of the tour
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters'],
        minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: String,
    // Field for the duration of the tour
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    // Field for the maximum group size of the tour
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    // Field for the difficulty level of the tour
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, or difficult',
        },
    },
    // Field for the average ratings of the tour with a default value of 4.5
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    // Field for the quantity of ratings received by the tour with a default value of 0
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    // Field for the price of the tour
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    // Field for the discount price of the tour (optional)
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below the regular price',
        },
    },
    // Field for the summary of the tour
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary'],
    },
    // Field for the detailed description of the tour
    description: {
        type: String,
        trim: true,
    },
    // Field for the cover image of the tour
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
    },
    // Field for an array of additional images related to the tour
    images: [String],
    // Field for the creation date of the tour, set to the current date by default
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    // Field for an array of start dates for the tour
    startDates: [Date],
    // Field for the property of secret tour
    secretTour: {
        type: Boolean,
        default: false,
    },
    // Fields for Geospatial Data
    startLocation: {
        type: {
            type: String, // GeoJSON type (Point)
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number], // Longitude and Latitude
        address: String,
        description: String,
    },
    // Array of locations for the tour
    locations: [
        {
            type: {
                type: String, // GeoJSON type (Point)
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number], // Longitude and Latitude
            address: String,
            description: String,
            day: Number,
        },
    ],
    // Array of guides associated with the tour
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    ]
},
    {
        // Configuration for transforming the document into JSON format with virtual properties included
        toJSON: {
            virtuals: true,
        },
        // Configuration for transforming the document into a plain JavaScript object with virtual properties included
        toObject: {
            virtuals: true,
        },
    });

// Defining a virtual property 'durationWeeks' for the 'Tour' schema
tourSchema.virtual('durationWeeks').get(function () {
    // Calculating and returning the duration in weeks
    return this.duration / 7;
});

// Defining a virtual populate 'reviews' for the 'Tour' schema
tourSchema.virtual('reviews', {
    // Reference to the 'Review' model
    ref: 'Review',
    // Connecting 'tour' field in 'Review' model with '_id' field in 'Tour' model
    foreignField: 'tour',
    localField: '_id',
});



/** Middleware function executed before saving a new document to the 'Tour' collection.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
tourSchema.pre('save', function (next) {
    // Creating a slug based on the name field using the 'slugify' function
    this.slug = slugify(this.name, {
        lower: true, // Converting the slug to lowercase
    });
    // Calling the next middleware in the stack
    next();
});

/** Middleware function executed before any find query on the 'Tour' collection.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
tourSchema.pre(/^find/, function (next) {
    // Adding a filter to exclude secret tours from query results
    this.find({
        secretTour: {
            $ne: true,
        },
    });
    // Storing the current timestamp in the 'start' property
    this.start = Date.now();
    // Calling the next middleware in the stack
    next();
});

/** Middleware function executed before any find query on the 'Tour' collection.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
tourSchema.pre(/^find/, function (next) {
    // Populating the 'guides' field with user details, excluding '__v' and 'passwordChangedAt'
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });
    // Calling the next middleware in the stack
    next();
});

/** Middleware function executed before an aggregation operation on the 'Tour' collection.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
tourSchema.pre('aggregate', function (next) {
    // Modifying the aggregation pipeline to include a $match stage
    this.pipeline().unshift({
        // $match stage to filter out secret tours from aggregation results
        $match: {
            secretTour: {
                $ne: true,
            },
        },
    });
    // Calling the next middleware in the stack
    next();
});

// Creating a model named 'Tour' based on the defined schema
const Tour = mongoose.model('Tour', tourSchema);

// Exporting the 'Tour' model for use in other parts of the application
module.exports = Tour;
