// Importing Tour Model
const Tour = require('../models/tourModel')
// Importing User Model
const User = require('../models/userModel')

// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing the StatusCodes http library
const { StatusCodes } = require('http-status-codes');
// Importing AppErrors handler
const AppErrors = require('./../utils/appErrors')


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

    // If there are no tour with that name then create a new AppErrors
    if (!tour) {
        return next(new AppErrors('There is no tour with that name', StatusCodes.NOT_FOUND))
    }


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


/** Middleware for INSERT COMMENT HERE
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAccount = catchAsync(async (req, res) => {
    res
        .status(StatusCodes.OK)
        .set(
            'Content-Security-Policy',
            "connect-src 'self' http://localhost:7775/"
        ).render('account', {
            title: 'Your Account',
        });
})


/** Middleware for INSERT COMMENT HERE
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware. 
 */
exports.updateUserData = catchAsync(async (req, res, next) => {
    // INSERT COMMENT HERE
    const updatedUser = await User.findByIdAndUpdate(req.body.id, {
        name: req.body.name, // INSERT COMMENT HERE
        email: req.body.email // INSERT COMMENT HERE
    }, {
        new: true,
        runValidators: true
    });

    // INSERT COMMENT HERE
    res
        .status(StatusCodes.OK)
        .set(
            'Content-Security-Policy',
            "connect-src 'self' http://localhost:7775/"
        ).render('account', {
            title: 'Your Account',
            user: updatedUser
        });
})