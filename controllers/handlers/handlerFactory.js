
// Importing the catchAsync function
const catchAsync = require('./../../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('./../../utils/appErrors')
// Importing Status codes
const { StatusCodes } = require('http-status-codes')
// Importing the APIFeatures utils file
const APIFeatures = require('../../utils/apiFeatures')

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


/** Controller function for retrieving a single document from the specified Mongoose Model.
 * @param {Model} Model - Mongoose Model Schema
 * @param {Object} popOptions - Options for population (if applicable)
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    // Construct the query to find a document by ID
    let query = Model.findById(req.params.id);
    // If population options are provided, apply population to the query
    if (popOptions) query.populate(popOptions);
    // Execute the query and await the result
    const doc = await query;

    // Check if a valid document is found
    if (!doc) {
        return next(new AppErrors('No document found with that ID', StatusCodes.BAD_REQUEST));
    }

    // Respond with a JSON object containing the requested document data
    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            doc
        }
    });
});

/** Handling GET requests to the '/api/v1/documents' endpoint. Retrieves all documents from the database.
 * @param {Model} Model - Mongoose Model Schema
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.getAll = (Model) => catchAsync(async (req, res, next) => {

    // Filter to get reviews for a specific tour if 'tourId' parameter is present
    let filter = {};
    // To allow for nested GET reviews on Tour
    if (req.params.tourId) {
        filter = {
            tour: req.params.tourId,
        };
    }

    // Creating an instance of the APIFeatures class with the MongoDB query and request query string.
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()       // Applying filtering based on request parameters
        .sort()         // Applying sorting based on request parameters
        .limitFields()  // Applying field limiting based on request parameters
        .paginate();    // Applying pagination based on request parameters
    // Executing the query and fetching the resulting documents from the database
    const document = await features.query.explain();

    // Responding with a JSON object containing a list of documents
    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: document.length,
        data: {
            data: document
        }
    });
})