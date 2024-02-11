// Importing Tour Model
const Tour = require('../models/tourModel')
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing the StatusCodes http library
const { StatusCodes } = require('http-status-codes');


/** Middleware for setting Overview View
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.getOverview = catchAsync(async (req, res, next) => {
    // Get tour data from collection
    const tours = await Tour.find();
    // Pass all the data from collectionto the overview template
    res.status(StatusCodes.OK).render('overview', {
        title: 'All Tours',
        tours
    })
})

/** Middleware for retrieving tour data for view rendering.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware. 
 */
exports.getTour = catchAsync(async (req, res, next) => {
    // Retrieve tour data from the database based on the provided slug
    const tour = await Tour.findOne({
        slug: req.params.slug
    }).populate({
        path: 'reviews', // Populate the 'reviews' field
        fields: 'review rating user' // Select specific fields for the populated documents
    });

    // Render the 'tour' view template with the retrieved tour data
    res.status(StatusCodes.OK).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});


/** Middleware for retrieving user data for rendering login page
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware. 
 */
exports.getLoginForm = catchAsync(async (req, res, next) => {
    // Setting Content-Security-Policy header to allow connections to the local server
    res
        .status(StatusCodes.OK)
        .set(
            'Content-Security-Policy',
            "connect-src 'self' http://localhost:7775/"
        ).render('login', {
            title: 'Log into your account',
        });
})


