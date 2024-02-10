
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing the StatusCodes http library
const { StatusCodes } = require('http-status-codes');


/** Middleware for setting Overview View
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getOverview = (req, res) => {
    res.status(StatusCodes.OK).render('overview', {
        title: 'All Tours',
    })
}

/** Middleware for setting Tour data on View
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getTour = (req, res) => {
    res.status(StatusCodes.OK).render('tour', {
        title: 'The Forest Hiker Tour',
    })
}

