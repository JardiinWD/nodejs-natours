
// Importing the catchAsync function
const catchAsync = require('./../../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('./../../utils/appErrors')
// Importing Status codes
const { StatusCodes } = require('http-status-codes')

/** Handling DELETE requests to the Controller's Routes endpoint
 * @param {Model} Model - Mongoose Model Schema
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    // Check if there is a correct doc
    if (!doc) {
        return next(new AppErrors('No document found with that ID', StatusCodes.BAD_REQUEST))
    }
    // Responding with a 204 status code as the document is deleted
    return res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        deletedAt: req.requestTime,
        data: null
    })
})


/** Handling PATCH requests to the Controller Routes endpoint
 * @param {Model} Model - Mongoose Model Schema
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    // Check if there is a correct document
    if (!doc) {
        return next(new AppErrors('No document found with that ID', StatusCodes.BAD_REQUEST))
    }
    // Responding with a 200 status code and a placeholder for the updated document
    res.status(StatusCodes.OK).json({
        status: 'success',
        updatedAt: req.requestTime,
        data: {
            doc
        }
    })
})


/** Handling POST requests to the Controller Routes endpoint
 * @param {Model} Model - Mongoose Model Schema
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.createOne = Model => catchAsync(async (req, res, next) => {
    // Creating a new document in the database based on the request body
    const newDocument = await Model.create(req.body);
    // Responding with a JSON object containing the newly created document data
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        createdAt: req.requestTime,
        data: {
            data: newDocument
        }
    });
})


/** Handling GET requests to the Controller Routes endpoint
 * @param {Model} Model - Mongoose Model Schema
 * @param {INSERT} popOptions - INSERT COMMENT HERE
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    // INSERT COMMENT HERE
    let query = Model.findById(req.params.id)
    // INSERT COMMENT HERE
    if (popOptions) query.populate(popOptions)
    // INSERT COMMENT HERE
    const doc = await query


    // Check if there is a correct document
    if (!doc) {
        return next(new AppErrors('No document found with that ID', StatusCodes.BAD_REQUEST))
    }

    // Responding with a JSON object containing the requested document data
    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            doc
        }
    });
})