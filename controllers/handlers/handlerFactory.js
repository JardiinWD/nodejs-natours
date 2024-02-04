
// Importing the catchAsync function
const catchAsync = require('./../../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('./../../utils/appErrors')
// Importing Status codes
const { StatusCodes } = require('http-status-codes')

/** INSERT COMMENT HERE
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    // Check if there is a correct doc
    if (!doc) {
        return next(new AppErrors('No document found with that ID', 404))
    }
    // Responding with a 204 status code as the tour is deleted
    return res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        deletedAt: req.requestTime,
        data: null
    })
})