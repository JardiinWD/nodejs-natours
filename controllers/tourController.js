// Importing the Tour model
const Tour = require('./../models/tourModel');
// Importing the APIFeatures utils file
const APIFeatures = require('./../utils/apiFeatures')

/** This middleware modifies the request query to retrieve the top 5 tours with specific fields and sorting.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.aliasTopTours = (req, res, next) => {
    // Setting limit, sort, and fields in the request query for retrieving top tours
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    // Proceeding to the next middleware
    next();
}

// Reading and parsing tour data from a JSON file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/** Handling GET requests to the '/api/v1/tours' endpoint. Retrieves all tours from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllTours = async (req, res) => {
    try {
        // Creating an instance of the APIFeatures class with the MongoDB query and request query string.
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()       // Applying filtering based on request parameters
            .sort()         // Applying sorting based on request parameters
            .limitFields()  // Applying field limiting based on request parameters
            .paginate();    // Applying pagination based on request parameters
        // Executing the query and fetching the resulting tours from the database
        const tours = await features.query;

        // Responding with a JSON object containing a list of tours
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (error) {
        // Handling errors and responding with a fail status
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
}

/** Handling GET requests to the '/api/v1/tours/:id' endpoint. Retrieves a specific tour by its ID from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getTour = async (req, res) => {
    try {
        // Fetching a specific tour by its ID from the database
        const tour = await Tour.findById(req.params.id);
        // Responding with a JSON object containing the requested tour data
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (error) {
        // Handling errors and responding with a fail status
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

/** Handling POST requests to the '/api/v1/tours' endpoint. Creates a new tour in the database based on the provided data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.createTour = async (req, res) => {
    try {
        // Creating a new tour in the database based on the request body
        const newTour = await Tour.create(req.body);
        // Responding with a JSON object containing the newly created tour data
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        // Handling errors related to invalid data and responding with a fail status
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
}

/** Handling PATCH requests to the '/api/v1/tours/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        // Responding with a 200 status code and a placeholder for the updated tour
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        // Handling errors and responding with a fail status
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}

/** Handling DELETE requests to the '/api/v1/tours/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        // Responding with a 204 status code as the tour is deleted
        return res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        // Handling errors and responding with a fail status
        res.status(404).json({
            status: 'fail',
            message: error
        });
    }
}