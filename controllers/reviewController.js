
// Importing promisify from util
const { promisify } = require('util')
// Importing Review Model
const Review = require('./../models/reviewModel')
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('./../utils/appErrors')
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' });
// Importing and destructuring endpoints utilities
const { apiVersionEndpoint, reviewsEndpoint, URLEnvironment } = require('../utils/endpoints');
// Importing Status codes
const { StatusCodes } = require('http-status-codes')



/** Handling GET requests to the '/api/v1/reviews' endpoint. Retrieves all tours from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllReviews = catchAsync(async (req, res) => {
    // Creating an instance of the APIFeatures class with the MongoDB query and request query string.
    const reviews = await Review.find({}).select('-__v')

    // Responding with a JSON object containing a list of tours
    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: reviews.length,
        url: `${URLEnvironment}/${apiVersionEndpoint}/${reviewsEndpoint}`,
        data: {
            reviews
        }
    });
})

/** Handling POST requests to the '/api/v1/reviews' endpoint. Creates a new review in the database based on the provided data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.createReview = catchAsync(async (req, res) => {
    // Creating a new tour in the database based on the request body
    const newReview = await Review.create(req.body)
    // Responding with a JSON object containing the newly created tour data
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        createdAt: req.requestTime,
        url: `${URLEnvironment}/${apiVersionEndpoint}/${reviewsEndpoint}`,
        data: {
            review: newReview
        }
    });
})


