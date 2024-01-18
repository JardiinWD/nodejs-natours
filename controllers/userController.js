// Importing the User model
const User = require('./../models/userModel');
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing and destructuring endpoints utilities
const { apiVersionEndpoint, usersEndpoint, URLEnvironment } = require('../utils/endpoints')

/** Handling GET requests to the '/api/v1/users' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllUsers = catchAsync(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find({})
    // Responding with a JSON object containing the requested users data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: users.length,
        url: `${URLEnvironment}/${apiVersionEndpoint}/${usersEndpoint}`,
        data: {
            users
        }
    })
})

/** Handling GET requests to the '/api/v1/users/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}

/** Handling POST requests to the '/api/v1/users' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}

/** Handling PATCH requests to the '/api/v1/users/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}

/** Handling DELETE requests to the '/api/v1/users/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}