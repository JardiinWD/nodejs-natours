
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


/** INSERT COMMENT HERE
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.setTourUsersIds = catchAsync(async (req, res, next) => {
    // Allow nested routes for tour and userId
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }
    // We Get userId from the Auth controller
    if (!req.body.user) {
        req.body.user = req.user.id
    }
    // Call the next middleware function
    next()
})


// Handling GET requests to the '/api/v1/reviews/:id' endpoint
exports.getReview = Factory.getOne(Review)
// Handling DELETE requests to the '/api/v1/reviews/:id' endpoint
exports.deleteReview = Factory.deleteOne(Review)
// Handling PATCH requests to the '/api/v1/reviews/:id' endpoint
exports.updateReview = Factory.updateOne(Review)
// Handling POST requests to the '/api/v1/reviews/:id' endpoint
exports.createReview = Factory.createOne(Review)