// Importing the Tour model
const Tour = require('./../models/tourModel');

// Reading and parsing tour data from a JSON file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/** Handling GET requests to the '/api/v1/tours' endpoint. Retrieves all tours from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllTours = async (req, res) => {
    try {
        // Creating a copy of the request query object and excluding certain fields
        const queryObject = { ...req.query };
        // Creating an array with specific fields that we don't want to filter
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // Looping through excludedFields and removing each one from queryObject
        excludedFields.forEach(el => delete queryObject[el]);

        // Converting the queryObject to a string and replacing specific keywords for MongoDB operators
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Constructing the MongoDB query based on the request parameters
        let query = Tour.find(JSON.parse(queryString));

        // Checking if the sort parameter exists in the request
        if (req.query.sort) {
            // Splitting and joining the sort parameter for multiple fields and directions
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sorting by createdAt in descending order
            query = query.sort('-createdAt');
        }

        // Checking if the fields parameter exists in the request
        if (req.query.fields) {
            // Splitting and joining the fields parameter for selecting specific fields
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            // Excluding the '__v' field by default
            query = query.select('-__v');
        }

        // Executing the query and fetching the resulting tours from the database
        const tours = await query;

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
            message: error
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