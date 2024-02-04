
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
// Importing Handled factory 
const Factory = require('./handlers/handlerFactory')

/** Handling GET requests to the '/api/v1/reviews' endpoint. Retrieves all reviews from the database.
 * If 'tourId' parameter is provided, retrieves reviews for a specific tour.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllReviews = catchAsync(async (req, res) => {
    // Filter to get reviews for a specific tour if 'tourId' parameter is present
    let filter = {};
    if (req.params.tourId) {
        filter = {
            tour: req.params.tourId,
        };
    }

    // Fetching reviews from the database based on the filter
    const reviews = await Review.find(filter).select('-__v');

    // Responding with a JSON object containing a list of reviews
    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: reviews.length,
        tourId: req.params.tourId || null, // Using the '||' operator for a default value
        url: `${URLEnvironment}/${apiVersionEndpoint}/${reviewsEndpoint}`,
        data: {
            reviews,
        },
    });
});


/** Handling POST requests to the '/api/v1/reviews' endpoint. Creates a new review in the database based on the provided data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.createReview = catchAsync(async (req, res) => {
    // Allow nested routes for tour and userId
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }
    // We Get userId from the Auth controller
    if (!req.body.user) {
        req.body.user = req.user.id
    }


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


/** Handling DELETE requests to the '/api/v1/reviews/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteReview = Factory.deleteOne(Review)