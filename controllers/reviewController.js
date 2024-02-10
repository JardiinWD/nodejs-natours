
// Importing Review Model
const Review = require('./../models/reviewModel')
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' });
// Importing Handled factory 
const Factory = require('./handlers/handlerFactory')


/** Middleware for setting Tour and User IDs in the request body.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.setTourUsersIds = catchAsync(async (req, res, next) => {

    // Allowing nested routes for tour and userId
    if (!req.body.tour) {
        req.body.tour = req.params.tourId;
    }

    // Getting userId from the Auth controller
    if (!req.body.user) {
        req.body.user = req.user.id;
    }

    // Calling the next middleware function
    next();
});


// Handling GET requests to the '/api/v1/reviews' endpoint. Retrieves all reviews from the database.
exports.getAllReviews = Factory.getAll(Review)
// Handling GET requests to the '/api/v1/reviews/:id' endpoint
exports.getReview = Factory.getOne(Review)
// Handling DELETE requests to the '/api/v1/reviews/:id' endpoint
exports.deleteReview = Factory.deleteOne(Review)
// Handling PATCH requests to the '/api/v1/reviews/:id' endpoint
exports.updateReview = Factory.updateOne(Review)
// Handling POST requests to the '/api/v1/reviews/:id' endpoint
exports.createReview = Factory.createOne(Review)