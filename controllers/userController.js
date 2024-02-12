// Importing the User model
const User = require('./../models/userModel');
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('../utils/appErrors');
// Importing Handled factory 
const Factory = require('./handlers/handlerFactory');
// Importing the StatusCode Library
const { StatusCodes } = require('http-status-codes');


/** Function to filter out unwanted fields from an object based on an array of allowed fields.
 * 
 * @param {Object} obj - The object to filter.
 * @param {Array} allowedFields - The array of allowed fields.
 */
const filterObj = (obj, ...allowedFields) => {
    // Create a new object to store allowed fields
    const newObject = {}

    // Iterate through the object's keys
    Object.keys(obj).forEach(el => {
        // Check if the key is included in the allowedFields array
        if (allowedFields.includes(el)) {
            // Add the key-value pair to the newObject
            newObject[el] = obj[el]
        }
    })

    // Return the new filtered object
    return newObject
}

/** Handling GET requests to the '/api/v1/users/getMe' endpoint (only for logged user)
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.getMe = catchAsync(async (req, res, next) => {
    // Set the user ID in the request parameters to the logged-in user's ID
    req.params.id = req.user.id
    // Calling the next middleware
    next()
})


/** Handling PATCH requests to the '/api/v1/users/updateMe' endpoint (only for logged user)
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm || req.body.email) {
        return next(new AppErrors('You cannot update Your Password from here.', StatusCodes.BAD_REQUEST))
    }

    // Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 2. Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true, // Return the modified document rather than the original
        runValidators: true // Run validators on update
    });

    // 3. Respond with success status and updated user data
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});


/** Handling DELETE requests to the '/api/v1/users/deleteMe' endpoint (only for the currently logged-in user)
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.deleteMe = catchAsync(async (req, res, next) => {

    // Deactivate the user by setting the 'active' field to false
    await User.findByIdAndUpdate(req.user.id, {
        active: false
    })

    // Respond with a success status and null data (no content)
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: null
    })
})


// Handling GET requests to the '/api/v1/users' endpoint
exports.getAllUsers = Factory.getAll(User)
// Handling GET requests to the '/api/v1/users/:id' endpoint
exports.getUser = Factory.getOne(User)
// Handling POST requests to the '/api/v1/users' endpoint
exports.createUser = Factory.createOne(User)
//  Handling PATCH requests to the '/api/v1/users/:id' endpoint (for updating password use updateMe)
exports.updateUser = Factory.updateOne(User)
// Handling DELETE requests to the '/api/v1/users/:id' endpoint
exports.deleteUser = Factory.deleteOne(User)